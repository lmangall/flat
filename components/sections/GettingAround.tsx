'use client'

import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'


export default function GettingAround() {
  const { lang } = useLang()
  const t = translations[lang]
  const ta = t.around

  // Warnings sit inline in the step list but aren't steps — don't let them eat a number.
  let stepCount = 0
  const arrivalSteps = ta.arrival.steps.map((text) => {
    const isWarning = text.startsWith('⚠️')
    return { text, isWarning, num: isWarning ? null : ++stepCount }
  })

  return (
    <section id="around" className="bg-cream py-28 px-6 sm:px-8 relative">
      <div className="grain absolute inset-0" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <h2 className="font-display text-4xl sm:text-5xl text-night tracking-tight mb-4">
          {ta.title}
        </h2>
        <div className="w-16 h-px bg-mer/30 mb-14 ml-1" />

        <div className="space-y-0">
          {/* Getting here */}
          <div className="py-7 sm:py-8 border-b border-stone/30">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">{ta.arrival.emoji}</span>
              <h3 className="font-display text-xl text-night tracking-tight">
                {ta.arrival.title}
              </h3>
            </div>

            <div className="mb-7">
              <p className="font-sans text-mer/70 text-[0.72rem] font-medium uppercase tracking-widest mb-1">
                {ta.arrival.before.label}
              </p>
              <p className="font-sans text-earth/65 text-[0.82rem] leading-relaxed">
                {ta.arrival.before.text}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                {ta.arrival.before.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-sans font-medium text-[0.78rem] text-mer hover:text-night transition-colors"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            </div>

            <ol className="space-y-3.5 ml-1">
              {arrivalSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  {step.isWarning ? (
                    <div className="bg-sunset/6 border border-sunset/12 rounded-xl px-5 py-3.5 w-full">
                      <span className="text-[0.82rem] font-sans text-earth leading-relaxed">{step.text}</span>
                    </div>
                  ) : (
                    <>
                      <span className="shrink-0 w-6 h-6 bg-mer/8 text-mer font-sans font-medium text-xs flex items-center justify-center rounded-full mt-0.5">
                        {step.num}
                      </span>
                      <span className="font-sans text-earth/70 text-[0.82rem] leading-relaxed">
                        {step.text}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-7 ml-1 space-y-1.5">
              <p className="font-sans text-earth/55 text-[0.8rem] leading-relaxed">
                {ta.arrival.frequency}
              </p>
              <p className="font-sans text-earth/55 text-[0.8rem] leading-relaxed">
                {ta.arrival.back}
              </p>
            </div>
          </div>

          {/* Trains */}
          <div className="py-7 sm:py-8 border-b border-stone/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{ta.trains.emoji}</span>
              <h3 className="font-display text-xl text-night tracking-tight">
                {ta.trains.title}
              </h3>
            </div>
            <p className="font-sans text-earth/65 text-[0.82rem] leading-relaxed mb-6">
              {ta.trains.text}
            </p>

            {/* Carte Zou — subtle inline tip */}
            <div className="mt-2">
              <p className="font-sans text-mer/70 text-[0.72rem] font-medium uppercase tracking-widest mb-1">
                {ta.trains.card.eyebrow}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1.5">
                <h4 className="font-display text-lg text-night tracking-tight">
                  {ta.trains.card.title}
                </h4>
                <span className="font-sans text-mer font-medium text-[0.78rem]">
                  {ta.trains.card.price}
                </span>
              </div>
              <p className="font-sans text-earth/55 text-[0.8rem] leading-relaxed mb-3">
                {ta.trains.card.text}
              </p>
              <a
                href={ta.trains.card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-sans font-medium text-[0.78rem] text-mer hover:text-night transition-colors"
              >
                {ta.trains.card.cta}
              </a>
            </div>
          </div>

          {/* Buses + Maps */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="py-7 sm:py-8 border-b border-stone/30 sm:border-b-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{ta.buses.emoji}</span>
                <h3 className="font-display text-lg text-night tracking-tight">
                  {ta.buses.title}
                </h3>
              </div>
              <p className="font-sans text-earth/65 text-[0.82rem] leading-relaxed">
                {ta.buses.text}
              </p>
            </div>

            <div className="py-7 sm:py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{ta.maps.emoji}</span>
                <h3 className="font-display text-lg text-night tracking-tight">
                  {ta.maps.title}
                </h3>
              </div>
              <p className="font-sans text-earth/65 text-[0.82rem] leading-relaxed">
                {ta.maps.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
