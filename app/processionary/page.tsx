'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLang } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

const blob = process.env.NEXT_PUBLIC_BLOB_URL ?? ''

export default function ProcessionaryPage() {
	const { lang } = useLang()
	const tp = translations[lang].processionary

	return (
		<main className="bg-parchment min-h-screen relative overflow-hidden">
			<div className="grain absolute inset-0 pointer-events-none" />

			<div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
				{/* Back link */}
				<Link
					href="/#araki"
					className="inline-flex items-center font-sans text-[0.85rem] text-mer hover:text-mer/70 transition-colors mb-10"
				>
					{tp.back}
				</Link>

				{/* Hero */}
				<header className="mb-12">
					<span className="font-mono text-[0.7rem] tracking-[0.25em] uppercase text-red-600 mb-3 inline-block">
						⚠ {tp.warning.title}
					</span>
					<h1 className="font-display text-4xl sm:text-5xl text-night tracking-tight mb-5">
						{tp.title}
					</h1>
					<p className="font-sans text-earth/75 text-[1.05rem] leading-relaxed max-w-2xl">
						{tp.intro}
					</p>
				</header>

				{/* 3D hero image */}
				<div className="relative rounded-2xl overflow-hidden shadow-float mb-12 bg-night">
					<Image
						src={`${blob}/processionary/3d.png`}
						alt={tp.title}
						width={1200}
						height={800}
						className="w-full h-auto"
						priority
					/>
				</div>

				{/* Warning callout */}
				<section className="bg-red-50 border-l-4 border-red-600 rounded-r-xl p-6 sm:p-7 mb-14">
					<h2 className="font-display text-2xl text-night tracking-tight mb-3">
						{tp.warning.title}
					</h2>
					<p className="font-sans text-earth/85 leading-relaxed text-[0.95rem]">
						{tp.warning.text}
					</p>
				</section>

				{/* Season */}
				<section className="mb-14">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.season.title}
					</h2>
					<p className="font-sans text-earth/75 leading-relaxed">{tp.season.text}</p>
				</section>

				{/* Identify */}
				<section className="mb-14">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.identify.title}
					</h2>
					<p className="font-sans text-earth/75 leading-relaxed mb-6">
						{tp.identify.text}
					</p>
					<figure className="rounded-xl overflow-hidden">
						<Image
							src={`${blob}/processionary/caterpillars.jpg`}
							alt={tp.identify.title}
							width={1024}
							height={768}
							className="w-full h-auto"
						/>
						<figcaption className="font-sans text-clay text-[0.78rem] italic mt-2 px-1">
							{tp.identify.caption}
						</figcaption>
					</figure>
				</section>

				{/* Danger for dog */}
				<section className="mb-14">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.dangerForDog.title}
					</h2>
					<p className="font-sans text-earth/75 leading-relaxed mb-6">
						{tp.dangerForDog.text}
					</p>
					<div className="grid sm:grid-cols-2 gap-4">
						<figure className="rounded-xl overflow-hidden">
							<Image
								src={`${blob}/processionary/symptoms.png`}
								alt={tp.dangerForDog.symptomsCaption}
								width={600}
								height={450}
								className="w-full h-auto"
							/>
							<figcaption className="font-sans text-clay text-[0.78rem] italic mt-2 px-1">
								{tp.dangerForDog.symptomsCaption}
							</figcaption>
						</figure>
						<figure className="rounded-xl overflow-hidden">
							<Image
								src={`${blob}/processionary/dog.jpg`}
								alt={tp.dangerForDog.dogCaption}
								width={600}
								height={450}
								className="w-full h-auto"
							/>
							<figcaption className="font-sans text-clay text-[0.78rem] italic mt-2 px-1">
								{tp.dangerForDog.dogCaption}
							</figcaption>
						</figure>
					</div>
				</section>

				{/* What to do */}
				<section className="mb-14 bg-cream rounded-2xl p-7 sm:p-9 border border-stone/30 shadow-card">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.whatToDo.title}
					</h2>
					<p className="font-sans text-earth/80 leading-relaxed mb-6">
						{tp.whatToDo.intro}
					</p>
					<ol className="space-y-4">
						{tp.whatToDo.steps.map((step, i) => (
							<li key={i} className="flex gap-4">
								<span className="font-display text-2xl text-red-600 leading-none shrink-0 mt-0.5">
									{i + 1}
								</span>
								<span className="font-sans text-earth/85 leading-relaxed text-[0.95rem]">
									{step}
								</span>
							</li>
						))}
					</ol>
				</section>

				{/* Lifecycle / Nymphose */}
				<section className="mb-14">
					<figure className="rounded-xl overflow-hidden">
						<Image
							src={`${blob}/processionary/nymphose.jpg`}
							alt={tp.identify.caption}
							width={1200}
							height={600}
							className="w-full h-auto"
						/>
					</figure>
				</section>

				{/* Prevention */}
				<section className="mb-14">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.prevention.title}
					</h2>
					<p className="font-sans text-earth/75 leading-relaxed mb-6">
						{tp.prevention.text}
					</p>
					<figure className="rounded-xl overflow-hidden">
						<Image
							src={`${blob}/processionary/trap.jpg`}
							alt={tp.prevention.caption}
							width={1024}
							height={768}
							className="w-full h-auto"
						/>
						<figcaption className="font-sans text-clay text-[0.78rem] italic mt-2 px-1">
							{tp.prevention.caption}
						</figcaption>
					</figure>
				</section>

				{/* Contacts */}
				<section className="mb-12">
					<h2 className="font-display text-2xl text-night tracking-tight mb-4">
						{tp.contacts.title}
					</h2>
					<p className="font-sans text-earth/75 leading-relaxed">
						{tp.contacts.text}
					</p>
				</section>

				{/* Back link bottom */}
				<Link
					href="/#araki"
					className="inline-flex items-center font-sans text-[0.85rem] text-mer hover:text-mer/70 transition-colors mt-6"
				>
					{tp.back}
				</Link>
			</div>
		</main>
	)
}
