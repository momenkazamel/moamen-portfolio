"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/ui/count-up";
import { fadeUp, staggerChildren, easeEditorial } from "@/components/home/hero.motion";

type ImpactStat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

const stats: ImpactStat[] = [
  {
    value: 10,
    suffix: "M+",
    label: "Total Views",
    description: "Across projects that collectively exceeded 10 million views.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Countries Served",
    description: "Creative work delivered for clients in 10+ countries.",
  },
  {
    value: 200,
    suffix: "+",
    label: "AI Videos Produced",
    description: "Across commercial, educational, and social media projects.",
  },
  {
    value: 15,
    suffix: "+",
    label: "Brands & Organizations",
    description: "Including startups, schools, agencies, and established brands.",
  },
];

/**
 * Credibility strip between the Hero and Selected Work. The number is the
 * focal point (large serif, near-full contrast); the label is a quiet
 * uppercase caption; the description is one short supporting line — visual
 * weight drops in that exact order. Each stat is one <dt>/<dd> group: the
 * number + label are the "term" (dt), the one-line sentence is its
 * "definition" (dd). Pulled up slightly to sit close against the hero
 * above, since both share the same charcoal ground.
 */
export function Impact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="Impact" className="relative isolate -mt-16 overflow-hidden bg-charcoal text-cream">
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="shell relative pt-16 pb-11">
        <motion.dl
          className="impact-grid"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px" }}
          variants={staggerChildren(0.12, 0.05)}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="impact-item"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: easeEditorial }}
            >
              <dt className="flex flex-col items-start">
                <span className="font-display text-[clamp(2.75rem,10vw,3.5rem)] leading-none tracking-[-0.02em] md:text-[clamp(3.25rem,7vw,4rem)] lg:text-[clamp(4.5rem,6vw,5.5rem)]">
                  <CountUp value={stat.value} suffix={stat.suffix} suffixClassName="text-bronze" />
                </span>
                <span className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-cream/70">
                  {stat.label}
                </span>
              </dt>
              <dd className="mt-[18px] min-h-[3rem] max-w-xs text-[0.92rem] leading-6 text-cream/68">{stat.description}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
