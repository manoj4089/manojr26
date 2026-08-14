'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import {
  MathUtils,
  Vector3,
  type Group,
  type Material,
  type Mesh,
  type MeshPhysicalMaterial,
  type PerspectiveCamera,
  type PointLight,
} from 'three';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scrollData } from '@/lib/scrollData';
import { damp, smoothstep } from '@/lib/math';
import { wantsTransmission, type QualityTier } from '@/lib/quality';

const MODEL = '/models/hero_rock.glb';

/**
 * The shot Blender framed, lifted verbatim from the `HeroCamera` node in the
 * GLB. It is copied here rather than driven from the node itself because the
 * camera has to live OUTSIDE the group this component transforms — otherwise
 * every parallax nudge and scroll recede would drag the camera along with the
 * rock and nothing would appear to move at all.
 */
const CAMERA = {
  position: [4.3, -0.75, 10.8],
  /** glTF quaternion, xyzw. */
  quaternion: [0.03905977, 0.15593463, -0.00617115, 0.98697561],
  /** yfov 0.39959652 rad. */
  fov: 22.895,
  /** The render aspect the shot was composed at. */
  aspect: 16 / 9,
  near: 0.1,
  far: 200,
} as const;

/** The Main_Rock pivot in model space — the point the light rig aims at. */
const ROCK_PIVOT = new Vector3(2.3, 0.1, 0);

/**
 * Blender's key/fill/rim are area lights, which KHR_lights_punctual cannot
 * represent — the exporter drops the light data and leaves behind an empty at
 * the same transform. Without re-creating them the rock is lit only by the seven
 * acid `Energy_Spill` points that DID export, and reads as a uniformly green
 * blob. Positions are read back off those empties so re-exporting from Blender
 * with the rig moved still moves the lighting here.
 *
 * The intensities look enormous next to the usual three.js 1-5, and have to be:
 * the baked albedo is a very dark stone, ~3.5% linear reflectance. Every bright
 * facet in the Blender render is lighting, not paint, so reproducing it takes
 * roughly the reciprocal of that in irradiance.
 */
const RIG = [
  { node: 'Key_Light', fallback: [-1.2, 3.3, 3], color: '#fdf6e8', intensity: 20 },
  { node: 'Rim_Light', fallback: [5.5, 2.7, 2.6], color: '#cfe0ff', intensity: 11 },
  { node: 'Fill_Light', fallback: [4.8, -0.4, -3], color: '#8fa2c8', intensity: 3.5 },
] as const;

/**
 * The exported `Energy_Spill` points, rebalanced. Blender converts watts to
 * candela on export — physically faithful, but these sit less than a unit from
 * the surfaces they light, so at the exported 489cd the inverse-square term
 * leaves them drowning the key light and the whole rock goes acid green.
 *
 * The range matters more than the intensity. Left at the exported 0 — infinite
 * — seven point lights scattered through the mesh wash every facet evenly and
 * the shape flattens out. Windowed, they do what they were modelled to do: burn
 * out at the cracks and die within a facet or two.
 */
const SPILL_INTENSITY = 0.023;
/** World units, so it scales with PLACEMENT rather than with the model. */
const SPILL_RANGE = 1.5;

/**
 * Where the rock sits, as an offset from its own pivot, and how big. The
 * headline is bottom-left and runs to ~14ch of a 12.5rem display face, which
 * leaves the right-hand third and the band above the type free — this lands the
 * silhouette in the middle of that gap at roughly 760px across on a 1080p
 * window, clear of the longest line.
 */
const PLACEMENT = { x: 0.88, y: 0.32, scale: 0.68 };

/** Where the rock goes as the hero compresses. Up and away, like the heading. */
const RECEDE = { y: 1.6, z: -3.4, shrink: 0.2 };

/** Hero progress window over which the rock fades out completely. */
const FADE = { start: 0.4, end: 0.88 };

/** Radians of yaw/pitch at the very edge of the viewport. */
const POINTER = { yaw: 0.07, pitch: 0.045 };

/** Slow suspended drift, on top of the rotation baked into the GLB. */
const FLOAT = { speed: 0.32, amount: 0.09 };

useGLTF.preload(MODEL);

/**
 * The hero rock — one GLB carrying the mesh, its seven acid spill lights, the
 * glass ribbons, the debris field and six looping rotation clips.
 *
 * It renders into the single fixed canvas behind the DOM and is tied to the hero
 * by its own ScrollTrigger, deliberately mirroring the `top top` / `+=110%`
 * window HeroMotion pins over. That coupling is the reason the rock recedes on
 * exactly the same stroke as the type instead of drifting on its own schedule.
 */
export function HeroRock({ tier }: { tier: QualityTier }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL);
  const { actions } = useAnimations(animations, group);

  /**
   * Per-frame values, kept off React exactly as scrollData is — `intro` is
   * written by GSAP, `heroTarget` by a ScrollTrigger, and the frame loop below
   * is the only reader.
   */
  const motion = useRef({ intro: 0, hero: 0, heroTarget: 0, yaw: 0, pitch: 0 });

  // Every unique material in the file, so the fade is one pass over a short list
  // rather than a traverse per frame.
  const materials = useMemo(() => {
    const unique = new Set<Material>();
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => unique.add(m));
      else unique.add(mat);
    });
    return [...unique];
  }, [scene]);

  const rig = useMemo(() => {
    scene.updateMatrixWorld(true);
    return RIG.map((light) => {
      const node = scene.getObjectByName(light.node);
      const at = node ? node.getWorldPosition(new Vector3()) : new Vector3(...light.fallback);
      /**
       * A directional light has no falloff — only the vector from its position
       * to its target counts, and the default target is the origin. Subtracting
       * the rock's pivot therefore aims the light straight at the rock without
       * needing a target object in the graph, which is otherwise the fiddliest
       * part of porting a Blender rig.
       *
       * These are then mounted OUTSIDE the transformed group. Three resolves a
       * directional light's aim in world space, so leaving them inside would let
       * every parallax nudge and the whole scroll recede swing the key light
       * across the rock.
       */
      return { ...light, position: at.sub(ROCK_PIVOT).toArray() as [number, number, number] };
    });
  }, [scene]);

  useLayoutEffect(() => {
    for (const mat of materials) {
      /**
       * Flipped on permanently rather than only while the rock is fading.
       * `transparent` is part of the program cache key, so toggling it mid-scrub
       * forces a shader recompile at the exact moment the user is scrolling —
       * a visible stall. Sitting in the transparent pass costs ~27 sorted draws,
       * which is nothing here.
       */
      mat.transparent = true;
    }
  }, [materials]);

  useLayoutEffect(() => {
    /**
     * Crack_Emission_Bright exports at KHR_materials_emissive_strength 11 —
     * calibrated for Blender's Filmic view transform, which compresses hot
     * colors very differently from three's ACES tone mapping here. At the
     * exposure the rest of the rig needs (see SceneCanvas), that strength
     * pushes every channel into ACES's shoulder together and the crack glow
     * desaturates to near-white instead of reading as acid green. Scaling
     * emissiveIntensity down — rather than lowering exposure further, which
     * would just re-darken the base color this rig is already tuned for —
     * keeps the color saturated without touching anything else.
     */
    for (const mat of materials) {
      const standard = mat as MeshPhysicalMaterial;
      if (mat.name === 'Crack_Emission_Bright' && typeof standard.emissiveIntensity === 'number') {
        standard.emissiveIntensity *= 0.3;
      }
    }
  }, [materials]);

  useLayoutEffect(() => {
    if (wantsTransmission(tier)) return;
    for (const mat of materials) {
      const physical = mat as MeshPhysicalMaterial;
      if (!physical.transmission) continue;
      // Transmission costs a full extra render of the scene every frame. On the
      // medium tier the ribbons become polished graphite instead, which is close
      // to how they read in the Blender render anyway.
      physical.transmission = 0;
      physical.roughness = 0.16;
      physical.metalness = 0.55;
      physical.needsUpdate = true;
    }
  }, [materials, tier]);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      const light = object as PointLight;
      if (!light.isPointLight) return;
      // Stash the exported value so this stays idempotent — StrictMode runs
      // layout effects twice, and compounding the scale would halve the spill.
      light.userData.exportedIntensity ??= light.intensity;
      light.intensity = light.userData.exportedIntensity * SPILL_INTENSITY;
      light.distance = SPILL_RANGE;
    });
  }, [scene]);

  // All six clips loop independently: one for the rock, one per ribbon.
  useLayoutEffect(() => {
    const playing = Object.values(actions);
    playing.forEach((action) => action?.reset().play());
    return () => playing.forEach((action) => action?.stop());
  }, [actions]);

  useGSAP(() => {
    const state = motion.current;

    // Arrives with the headline rather than ahead of it — HeroMotion's lines
    // start rising immediately and run 1.35s.
    gsap.to(state, { intro: 1, duration: 1.9, delay: 0.3, ease: 'expo.out' });

    const hero = document.querySelector<HTMLElement>('[data-section="home"]');
    if (!hero) return;

    ScrollTrigger.create({
      trigger: hero,
      // Must stay in step with the pin in HeroMotion — same start, same length.
      start: 'top top',
      end: '+=110%',
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        state.heroTarget = self.progress;
      },
    });
  }, []);

  useFrame((state, delta) => {
    const root = group.current;
    if (!root) return;

    const m = motion.current;
    const dt = Math.min(delta, 0.05);

    // The heading is on a 0.6s scrub, so raw trigger progress would put the rock
    // slightly ahead of the type on every flick. Damping to roughly the same lag
    // keeps the two moving as one composition.
    m.hero = damp(m.hero, m.heroTarget, 0.09, dt);

    const presence = m.intro * (1 - smoothstep(FADE.start, FADE.end, m.hero));

    // Past the hero there is nothing on screen to draw. Skipping the whole
    // group drops 27 meshes, ten lights and the transmission pass for the entire
    // rest of the page.
    root.visible = presence > 0.002;
    if (!root.visible) return;

    const pointer = scrollData.pointer;
    m.yaw = damp(m.yaw, pointer.nx * POINTER.yaw, 0.06, dt);
    m.pitch = damp(m.pitch, -pointer.ny * POINTER.pitch, 0.06, dt);

    // Settles forward into place as the intro resolves.
    const settle = 1 - m.intro;
    const drift = Math.sin(state.clock.elapsedTime * FLOAT.speed) * FLOAT.amount;

    // Offsets are from the rock's own pivot — see the counter-translated group
    // below — so scaling and rotating never slide it across the frame.
    root.position.set(
      ROCK_PIVOT.x + PLACEMENT.x,
      ROCK_PIVOT.y + PLACEMENT.y + drift + m.hero * RECEDE.y + settle * 0.4,
      ROCK_PIVOT.z + m.hero * RECEDE.z - settle * 1.6,
    );
    root.rotation.set(m.pitch, m.yaw, 0);
    root.scale.setScalar(PLACEMENT.scale * (1 - m.hero * RECEDE.shrink));

    for (const mat of materials) mat.opacity = presence;
  });

  return (
    <>
      <HeroCamera />

      {rig.map((light) => (
        <directionalLight
          key={light.node}
          position={light.position}
          color={light.color}
          intensity={light.intensity}
        />
      ))}

      {/* Just enough to keep the unlit facets off pure black. */}
      <ambientLight intensity={0.5} color="#7d8ba6" />

      <group ref={group}>
        {/*
          Counter-translation, so the group's origin lands on the rock instead of
          on the world origin the rock happens to sit 2.3 units away from. Scale
          and the pointer parallax then work about the rock itself — otherwise
          shrinking it walks it across the frame and a 4° yaw swings it bodily
          sideways.
        */}
        <group position={[-ROCK_PIVOT.x, -ROCK_PIVOT.y, -ROCK_PIVOT.z]}>
          <primitive object={scene} />
        </group>
      </group>
    </>
  );
}

/**
 * Reproduces Blender's camera exactly, and owns its own projection.
 *
 * `manual` tells R3F to stop touching the camera on resize, which it has to,
 * because the default behaviour — hold vertical FOV, let horizontal grow — is
 * wrong for this shot. The composition is horizontal: the rock is parked in the
 * right-hand column next to the type, and a narrower desktop window would walk
 * it towards the middle and straight under the headline.
 */
function HeroCamera() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    // `manual` is R3F's own flag on the camera object; it types it on the Canvas
    // `camera` prop but never augments THREE's class, so this is the only way to
    // set it from inside the tree.
    (camera as PerspectiveCamera & { manual?: boolean }).manual = true;
    camera.position.set(...CAMERA.position);
    camera.quaternion.set(...CAMERA.quaternion);
    camera.near = CAMERA.near;
    camera.far = CAMERA.far;
  }, [camera]);

  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    camera.aspect = aspect;
    // Below the framing aspect, widen vertically instead — that holds the
    // horizontal field constant, so the rock keeps its column.
    camera.fov =
      aspect >= CAMERA.aspect
        ? CAMERA.fov
        : MathUtils.radToDeg(
            2 * Math.atan(Math.tan(MathUtils.degToRad(CAMERA.fov) / 2) * (CAMERA.aspect / aspect)),
          );
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
