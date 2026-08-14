import { profile } from '@/data/profile';
import { StatementMotion } from '@/components/motion/StatementMotion';
import { Parallax } from '@/components/motion/Parallax';

const { statement } = profile;

/**
 * The unnumbered band between WORK and SKILLS.
 *
 * Phase 4 scrubs `data-statement-left` and `data-statement-right` in opposite
 * directions while the LiquidStatement GL scene rotates behind them. The lines
 * are laid out so that at rest they already read correctly — the animation
 * exaggerates an existing composition rather than assembling it.
 */
export function Statement() {
  return (
    <StatementMotion>
      <section
        data-section="statement"
        aria-label="Statement"
        className="relative overflow-hidden py-28 lg:py-44"
      >
        {/* Background plane — deliberately the slowest layer in the section. */}
        <Parallax
          speed={0.22}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[30rem] -translate-y-1/2"
        >
          <div
            aria-hidden
            className="size-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(43,107,255,0.14),transparent_65%)] blur-2xl"
          />
        </Parallax>

        <div className="edge-x relative lg:pl-[7.5rem]">
          <p className="mono-label mb-8">Every line of code matters</p>

          <h2 className="display display-tight text-[clamp(2.25rem,8.4vw,7.5rem)]">
            <span className="reveal-mask">
              <span className="block text-bone-dim">{statement.lead}</span>
            </span>
            <span className="reveal-mask">
              <span data-statement-left className="block will-change-transform">
                {statement.left}
              </span>
            </span>
            <span className="reveal-mask">
              <span
                data-statement-right
                className="block text-acid will-change-transform lg:pl-[14vw]"
              >
                {statement.right}
              </span>
            </span>
          </h2>

          <p
            data-statement-support
            className="mt-10 max-w-sm text-sm leading-relaxed text-bone-dim will-change-transform lg:ml-auto lg:mt-14 lg:text-right"
          >
            {statement.support}
          </p>
        </div>
      </section>
    </StatementMotion>
  );
}
