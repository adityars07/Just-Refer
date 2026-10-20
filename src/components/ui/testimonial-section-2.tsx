"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { getStoredTestimonials, type PartnerTestimonial } from "@/data/testimonialsData";

export default function Testimonial2() {
  const [items, setItems] = useState<PartnerTestimonial[]>(() => getStoredTestimonials());
  const [selected, setSelected] = useState<PartnerTestimonial | null>(null);

  // Sync automatically when admin updates testimonials
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<PartnerTestimonial[]>;
      if (custom.detail) {
        setItems(custom.detail);
      } else {
        setItems(getStoredTestimonials());
      }
    };
    window.addEventListener("justrefer:testimonials-updated", handleUpdate);
    return () => window.removeEventListener("justrefer:testimonials-updated", handleUpdate);
  }, []);

  // Split testimonials into 3 rows for visual variance
  const row1 = items.slice(0, 3);
  const row2 = items.slice(3, 6);
  const row3 = items.slice(6, 9);

  return (
    <div
      data-testimonial-section
      className="relative w-full py-20 overflow-hidden [--color-primary:#1F9D55] bg-white dark:bg-background text-neutral-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-4 text-center mb-12 t2-container">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          <CheckCircle2 size={13} />
          VERIFIED PARTNER EXPERIENCES
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight t2-title">
          Trusted by 2,400+ Financial & Property Advisors
        </h2>
        <p style={{ maxWidth: 640, margin: '12px auto 0', color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
          Discover how real estate brokers, Chartered Accountants, and wealth managers scale their loan disbursals with direct bank commissions.
        </p>
      </div>

      {/* Main Container acting as the viewport for background and fades */}
      <div className="relative w-full t2-viewport">
        {/* Shaded Background */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] border-y border-black dark:border-white pointer-events-none t2-pattern"></div>

        {/* Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white dark:from-black to-transparent z-20 pointer-events-none t2-fade-left"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white dark:from-black to-transparent z-20 pointer-events-none t2-fade-right"></div>

        {/* Content Rows */}
        <div className="relative z-10 flex flex-col gap-8 py-12 items-center justify-center overflow-hidden t2-rows">
          {[row1, row2, row3].map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex items-center gap-6 min-w-max t2-row-track"
              animate={{
                x: rowIndex % 2 === 0 ? ["0%", "-25%"] : ["-25%", "0%"],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...row, ...row, ...row, ...row].map((testimonial, i) => (
                <Capsule
                  key={`${testimonial.id}-${i}`}
                  testimonial={testimonial}
                  onClick={() => setSelected(testimonial)}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 t2-modal-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-md t2-modal-backdrop"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 10,
                transition: { duration: 0.15 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-black dark:bg-white text-white dark:text-black p-8 md:p-12 rounded-2xl border-2 border-(--color-primary) shadow-2xl z-50 t2-modal-card"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-white dark:hover:text-black transition-colors t2-modal-close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Metric Badge */}
                {selected.metricBadge && (
                  <div style={{ background: 'rgba(31, 157, 85, 0.15)', color: '#34d399', border: '1px solid rgba(31, 157, 85, 0.4)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
                    ⚡ {selected.metricBadge}
                  </div>
                )}

                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 t2-modal-quote">
                  &ldquo;{selected.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 t2-modal-author">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-(--color-primary) t2-modal-avatar">
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base text-white dark:text-black t2-modal-name">
                      {selected.name}
                    </h4>
                    <p className="text-sm text-neutral-400 dark:text-neutral-600 t2-modal-role">
                      {selected.role} {selected.firm ? `• ${selected.firm}` : ''} ({selected.city})
                    </p>
                    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#10b981', marginTop: 2 }}>
                      Specialty: {selected.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Capsule({
  testimonial,
  onClick,
}: {
  testimonial: PartnerTestimonial;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group flex items-center gap-4 p-2 pr-8 rounded-full bg-white dark:bg-black/90 border border-neutral-300 hover:border-(--color-primary) hover:border-dashed dark:hover:border-(--color-primary) dark:border-neutral-800 cursor-pointer transition-all shadow-sm hover:shadow-md t2-capsule"
    >
      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-black group-hover:border-(--color-primary) dark:group-hover:border-(--color-primary) dark:border-white transition-colors t2-avatar-wrap">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover object-top"
          sizes="48px"
        />
      </div>
      <div className="flex flex-col items-start leading-tight t2-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="text-sm font-bold text-neutral-900 dark:text-white t2-name">
            {testimonial.name}
          </span>
          <span style={{ fontSize: 10, background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
            {testimonial.city}
          </span>
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 t2-role">
          {testimonial.role} • {testimonial.category}
        </span>
      </div>
    </motion.div>
  );
}
