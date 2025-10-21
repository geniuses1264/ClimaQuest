import React, { useState } from "react";
import { motion } from "framer-motion";


const FAQ_ITEMS = [
  {
    q: "How does ClimaQuest get weather data?",
    a: "ClimaQuest uses trusted global APIs like WeatherAPI to fetch real-time and forecasted weather updates.",
  },
  {
    q: "Can I view weather for my current location?",
    a: "Yes! ClimaQuest automatically detects your location and displays accurate weather conditions instantly.",
  },
  {
    q: "Does ClimaQuest support hourly and daily forecasts?",
    a: "Absolutely. You can explore detailed hourly changes and 7-day forecasts for any location worldwide.",
  },
  {
    q: "Can I search for other cities?",
    a: "Yes — just use the search bar at the top to view weather details for any city or country.",
  },
  {
    q: "Is ClimaQuest free to use?",
    a: "Yes, ClimaQuest is completely free and designed for everyone who loves clear, modern weather insights.",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-sky-800">
      {/* Decorative blurred shapes */}
      <motion.div
        className="pointer-events-none absolute -z-10 rounded-full mix-blend-screen opacity-30"
        style={{ width: 420, height: 420, right: -80, top: -60, background: "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.45), transparent 30%)" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="pointer-events-none absolute -z-10 rounded-full mix-blend-screen opacity-25"
        style={{ width: 520, height: 520, left: -120, bottom: -80, background: "radial-gradient(circle at 70% 70%, rgba(14,165,233,0.35), transparent 30%)" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 1.4 }}
      />

      <section className="relative w-full max-w-5xl">
        <div className="bg-white/6 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 md:p-10 overflow-hidden">
          <header className="text-center mb-6 md:mb-10">
            <motion.h1
              className="text-3xl md:text-4xl font-bold tracking-tight text-white"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Welcome to ClimaQuest
            </motion.h1>
            <motion.p
              className="mt-2 text-sky-100/90 max-w-2xl mx-auto"
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              Your gateway to accurate weather forecasts and smart climate insights.
            </motion.p>
            <motion.p
              className="mt-4 text-sm md:text-base text-slate-200/80 max-w-3xl mx-auto"
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              At ClimaQuest, we’re redefining how you experience the weather. From current conditions to daily and hourly forecasts,
              we bring the world’s weather to your fingertips — simple, fast, and visually inspiring.
            </motion.p>
          </header>

          {/* About Section */}
          <motion.section
            className="bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-5 md:p-6 mb-6 hover:shadow-sky-400/20 transition-shadow"
            initial={{ scale: 0.99, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            aria-labelledby="about-title"
          >
            <h2 id="about-title" className="text-xl font-semibold text-white/95">About ClimaQuest</h2>
            <p className="mt-3 text-slate-200/80 text-sm md:text-base">
              ClimaQuest is a modern weather forecast platform that lets you explore real-time weather data anywhere in the world.
              Using advanced APIs, we deliver daily and hourly forecasts with detailed insights such as humidity, UV index, and wind conditions —
              all wrapped in a beautiful interface.
            </p>
          </motion.section>

          {/* FAQ */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-white/95 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {FAQ_ITEMS.map((it, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl bg-white/6 border ${isOpen ? "border-sky-400/70 shadow-[0_6px_30px_rgba(14,165,233,0.08)]" : "border-white/8"} overflow-hidden transition-all`}
                  >
                    <motion.button
                      onClick={() => toggle(i)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between gap-4"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                    >
                      <span className="text-sm md:text-base text-white/95 font-medium">{it.q}</span>
                      <span className={`text-sky-200/90 text-xs md:text-sm transition-transform ${isOpen ? "rotate-45" : "rotate-0"}`}>
                        {/* simple plus/minus icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </motion.button>

                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="px-4"
                      style={{ overflow: "hidden" }}
                    >
                      <div className="py-3 text-sm text-slate-200/80">
                        {it.a}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact */}
          <motion.section
            className="bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-3"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h4 className="text-lg font-semibold text-white/95">Contact Us</h4>
              <p className="mt-2 text-slate-200/80 text-sm">Have feedback, suggestions, or questions? We’d love to hear from you.</p>
              <a
                href="mailto:contact@climaquest.com"
                className="inline-block mt-3 text-sky-200/95 text-sm font-medium hover:underline"
              >
                contact@climaquest.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* Social icons styled neon-blue */}
              <a href="#" aria-label="GitHub" className="p-2 rounded-md bg-transparent hover:shadow-[0_6px_20px_rgba(14,165,233,0.12)] transition">
                <svg className="w-6 h-6 text-sky-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.9 3.16 9.06 7.55 10.53.55.1.75-.24.75-.53 0-.26-.01-1.14-.01-2.07-3.07.67-3.72-1.48-3.72-1.48-.5-1.28-1.22-1.62-1.22-1.62-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.45-.28-5.02-1.22-5.02-5.43 0-1.2.43-2.2 1.13-2.98-.12-.28-.49-1.41.11-2.94 0 0 .92-.3 3.02 1.13A10.5 10.5 0 0112 6.8c.93.004 1.86.126 2.73.37 2.09-1.43 3.01-1.13 3.01-1.13.6 1.53.23 2.66.11 2.94.7.78 1.13 1.78 1.13 2.98 0 4.23-2.57 5.15-5.02 5.42.39.34.73 1.03.73 2.08 0 1.5-.01 2.71-.01 3.08 0 .29.2.64.76.53 4.39-1.48 7.54-5.64 7.54-10.53C23.25 5.48 18.27.5 12 .5z"/>
                </svg>
              </a>

              <a href="#" aria-label="Twitter" className="p-2 rounded-md bg-transparent hover:shadow-[0_6px_20px_rgba(14,165,233,0.12)] transition">
                <svg className="w-6 h-6 text-sky-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23 4.56c-.8.36-1.7.6-2.62.71a4.52 4.52 0 001.98-2.5 9.03 9.03 0 01-2.86 1.09 4.51 4.51 0 00-7.69 4.12A12.82 12.82 0 013 3.88a4.5 4.5 0 001.4 6.02 4.48 4.48 0 01-2.04-.56v.06a4.51 4.51 0 003.62 4.42c-.48.13-.99.2-1.51.08a4.52 4.52 0 004.22 3.13A9.05 9.05 0 012 19.54 12.78 12.78 0 008.29 21c7.55 0 11.69-6.27 11.69-11.71v-.53A8.36 8.36 0 0023 4.56z"/>
                </svg>
              </a>

              <a href="#" aria-label="LinkedIn" className="p-2 rounded-md bg-transparent hover:shadow-[0_6px_20px_rgba(14,165,233,0.12)] transition">
                <svg className="w-6 h-6 text-sky-200" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 11.02 0H4.98zM3 8.98h4v12H3v-12zM9 8.98h3.82v1.64h.06c.53-1 1.83-2.06 3.76-2.06 4.03 0 4.78 2.65 4.78 6.09v6.33H19v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.96v5.7H9v-12z"/>
                </svg>
              </a>
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="mt-2">
            <div className="w-full rounded-lg bg-slate-900/70 text-center py-3 px-4">
              <p className="text-sm text-gray-300">© 2025 ClimaQuest. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
