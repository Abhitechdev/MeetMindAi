"use client";

import { motion } from "framer-motion";

interface SummaryViewerProps {
  executiveSummary: string;
  keyDecisions: string[];
  actionItems: string[];
  nextSteps: string[];
}

// ponytail: single reusable card, accent color passed as prop — no per-section component
function SectionCard({
  title,
  icon,
  accentColor,
  children,
  index,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      className="glass-card glass-card-hover p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: `${accentColor}15` }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function SummaryViewer({
  executiveSummary,
  keyDecisions,
  actionItems,
  nextSteps,
}: SummaryViewerProps) {
  return (
    <div className="space-y-3">
      {/* Executive Summary */}
      <SectionCard
        title="Executive Summary"
        index={0}
        accentColor="var(--accent-purple)"
        icon={
          <svg className="h-[16px] w-[16px]" style={{ color: "var(--accent-purple)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        }
      >
        <p className="text-[13px] text-foreground/70 leading-relaxed font-medium">{executiveSummary}</p>
      </SectionCard>

      {/* Key Decisions */}
      {keyDecisions.length > 0 && (
        <SectionCard
          title="Key Decisions"
          index={1}
          accentColor="#F59E0B"
          icon={
            <svg className="h-[16px] w-[16px]" style={{ color: "#F59E0B" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <ul className="space-y-1.5">
            {keyDecisions.map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3 text-[13px] text-foreground/70 font-medium"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <span className="shrink-0 mt-1.5 h-1 w-1 rounded-full bg-[#F59E0B]" />
                <span className="leading-snug">{item}</span>
              </motion.li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <SectionCard
          title="Action Items"
          index={2}
          accentColor="#10B981"
          icon={
            <svg className="h-[16px] w-[16px]" style={{ color: "#10B981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          }
        >
          <ul className="space-y-1.5">
            {actionItems.map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3 text-[13px] text-foreground/70 font-medium"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <svg className="shrink-0 mt-0.5 h-3.5 w-3.5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="leading-snug">{item}</span>
              </motion.li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <SectionCard
          title="Next Steps"
          index={3}
          accentColor="var(--accent-blue)"
          icon={
            <svg className="h-[16px] w-[16px]" style={{ color: "var(--accent-blue)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
            </svg>
          }
        >
          <ol className="space-y-1.5">
            {nextSteps.map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-3 text-[13px] text-foreground/70 font-medium"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <span
                  className="shrink-0 flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold"
                  style={{ background: "rgba(59,130,246,0.15)", color: "var(--accent-blue)" }}
                >
                  {i + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </motion.li>
            ))}
          </ol>
        </SectionCard>
      )}
    </div>
  );
}
