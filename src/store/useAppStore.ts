import { create } from 'zustand';

import type { SectionId } from '@/lib/constants';
import type { QualityTier } from '@/lib/quality';

export type CursorMode = 'default' | 'view' | 'link' | 'drag' | 'hidden';

/**
 * Discrete app state only — everything here changes a handful of times per
 * session, so a React render per change is entirely appropriate.
 *
 * Per-frame values (scroll, velocity, pointer, section progress) live in
 * src/lib/scrollData.ts instead. Putting them here would mean hundreds of
 * reconciliations per second.
 *
 * Always subscribe with a selector — `useAppStore(s => s.activeIndex)` — so the
 * cursor does not re-render when the work index changes.
 */
interface AppState {
  ready: boolean;
  quality: QualityTier;

  activeSection: SectionId;
  activeIndex: number;

  /** 0-based index of the visible project in the horizontal track. */
  workIndex: number;
  isDragging: boolean;

  cursorMode: CursorMode;
  /** id of the project whose case study is open, or null. */
  openProject: string | null;
  expandedSkill: string | null;

  setReady: (ready: boolean) => void;
  setQuality: (quality: QualityTier) => void;
  setActiveSection: (id: SectionId, index: number) => void;
  setWorkIndex: (i: number) => void;
  setIsDragging: (v: boolean) => void;
  setCursorMode: (mode: CursorMode) => void;
  setOpenProject: (id: string | null) => void;
  setExpandedSkill: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  quality: 'low',

  activeSection: 'home',
  activeIndex: 0,

  workIndex: 0,
  isDragging: false,

  cursorMode: 'default',
  openProject: null,
  expandedSkill: null,

  setReady: (ready) => set({ ready }),
  setQuality: (quality) => set({ quality }),

  // Guarded so a ScrollTrigger firing repeatedly with the same section does not
  // produce a render. Zustand does not bail out on equal values by itself.
  setActiveSection: (id, index) =>
    set((s) => (s.activeSection === id ? s : { activeSection: id, activeIndex: index })),

  setWorkIndex: (i) => set((s) => (s.workIndex === i ? s : { workIndex: i })),
  setIsDragging: (v) => set((s) => (s.isDragging === v ? s : { isDragging: v })),
  setCursorMode: (mode) => set((s) => (s.cursorMode === mode ? s : { cursorMode: mode })),
  setOpenProject: (id) => set({ openProject: id }),
  setExpandedSkill: (id) => set({ expandedSkill: id }),
}));
