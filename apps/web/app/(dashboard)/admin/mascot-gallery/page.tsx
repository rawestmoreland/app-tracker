'use client';

import { JobbleMascot } from '@/components/jobble-mascot';
import { useState } from 'react';

type MascotVariant =
  | 'default'
  | 'celebrating'
  | 'confused'
  | 'sleeping'
  | 'stressed'
  | 'thinking'
  | 'waving'
  | 'tired'
  | 'excited';

type MascotSize = 'sm' | 'md' | 'lg' | 'xl';

export default function MascotGalleryPage() {
  const [selectedSize, setSelectedSize] = useState<MascotSize>('lg');

  const variants: Array<{
    name: MascotVariant;
    title: string;
    description: string;
    useCase: string;
  }> = [
    {
      name: 'default',
      title: 'Default (Juggling)',
      description:
        'The main Jobble mascot juggling job applications - represents multitasking and active job hunting.',
      useCase: 'Landing pages, hero sections, general branding',
    },
    {
      name: 'celebrating',
      title: 'Celebrating',
      description:
        'Excited and celebratory with arms raised and confetti - perfect for success moments.',
      useCase: 'Job offer received, interview scheduled, milestone achievements',
    },
    {
      name: 'confused',
      title: 'Confused',
      description:
        'Scratching head with question marks - representing uncertainty or need for help.',
      useCase: 'Error states, help sections, tutorial prompts',
    },
    {
      name: 'sleeping',
      title: 'Sleeping',
      description:
        'Peacefully sleeping with Z\'s - represents rest or inactive states.',
      useCase: 'No recent activity, idle states, archived applications',
    },
    {
      name: 'stressed',
      title: 'Stressed',
      description:
        'Multiple arms juggling with sweat drops - represents being overwhelmed.',
      useCase: 'Too many applications, deadline warnings, high activity alerts',
    },
    {
      name: 'thinking',
      title: 'Thinking',
      description:
        'Hand on chin with thought bubble and lightbulb - represents contemplation.',
      useCase: 'Decision prompts, suggestions, AI recommendations',
    },
    {
      name: 'waving',
      title: 'Waving',
      description:
        'Friendly wave with a big smile - welcoming and approachable.',
      useCase: 'Onboarding, welcome messages, greetings',
    },
    {
      name: 'tired',
      title: 'Tired',
      description:
        'Slouching with coffee and dark circles - represents exhaustion.',
      useCase: 'Long job search reminders, encouragement messages, break suggestions',
    },
    {
      name: 'excited',
      title: 'Excited',
      description:
        'Star eyes and huge smile with sparkles - maximum excitement!',
      useCase: 'Premium features, special announcements, major achievements',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Jobble Mascot Gallery
          </h1>
          <p className="text-lg text-gray-600">
            All personality variants of the Jobble mascot
          </p>
        </div>

        {/* Size Selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Select Size:
            </h2>
            <div className="flex space-x-2">
              {(['sm', 'md', 'lg', 'xl'] as MascotSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mascot Variants Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {variants.map((variant) => (
            <div
              key={variant.name}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
            >
              {/* Mascot Display */}
              <div className="mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 transition-all group-hover:from-blue-100 group-hover:to-indigo-100">
                <JobbleMascot variant={variant.name} size={selectedSize} />
              </div>

              {/* Variant Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {variant.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {variant.description}
                </p>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase text-blue-800">
                    Use Case
                  </p>
                  <p className="text-sm text-blue-700">{variant.useCase}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-600">
                    Code
                  </p>
                  <code className="text-xs text-gray-800">
                    {`<JobbleMascot variant="${variant.name}" size="${selectedSize}" />`}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Demo */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Interactive Size Comparison
          </h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="flex flex-wrap items-end justify-center gap-8">
              <div className="text-center">
                <JobbleMascot variant="default" size="sm" />
                <p className="mt-2 text-sm font-medium text-gray-600">Small</p>
              </div>
              <div className="text-center">
                <JobbleMascot variant="default" size="md" />
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Medium
                </p>
              </div>
              <div className="text-center">
                <JobbleMascot variant="default" size="lg" />
                <p className="mt-2 text-sm font-medium text-gray-600">Large</p>
              </div>
              <div className="text-center">
                <JobbleMascot variant="default" size="xl" />
                <p className="mt-2 text-sm font-medium text-gray-600">
                  Extra Large
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emotional Range Demo */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Emotional Range: Job Search Journey
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="waving" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  1. Starting Out
                </h3>
                <p className="text-sm text-gray-600">
                  Welcome! Ready to find your dream job?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="default" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  2. Active Hunting
                </h3>
                <p className="text-sm text-gray-600">
                  Juggling multiple applications like a pro!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="thinking" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  3. Decision Time
                </h3>
                <p className="text-sm text-gray-600">
                  Which opportunity is the right fit?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="stressed" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  4. Crunch Time
                </h3>
                <p className="text-sm text-gray-600">
                  Multiple interviews scheduled this week!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="tired" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  5. Taking a Break
                </h3>
                <p className="text-sm text-gray-600">
                  Time to recharge before the next round.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="excited" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  6. Interview Success!
                </h3>
                <p className="text-sm text-gray-600">
                  You nailed it! Waiting for the offer...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
              <JobbleMascot variant="celebrating" size="md" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  7. Job Offer Received!
                </h3>
                <p className="text-sm text-gray-600">
                  Congratulations on your new role!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Design Specifications */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-blue-900">
            Design Specifications
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-800">Colors</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <span className="font-medium">Body:</span> Blue #3B82F6
                </li>
                <li>
                  <span className="font-medium">Eyes:</span> Dark Slate #1E293B
                </li>
                <li>
                  <span className="font-medium">Cheeks:</span> Pink #F472B6
                </li>
                <li>
                  <span className="font-medium">Accents:</span> Various bright
                  colors
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-800">Sizes</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>
                  <span className="font-medium">Small:</span> 64x64px (icons,
                  avatars)
                </li>
                <li>
                  <span className="font-medium">Medium:</span> 128x128px
                  (cards, lists)
                </li>
                <li>
                  <span className="font-medium">Large:</span> 192x192px (hero
                  sections)
                </li>
                <li>
                  <span className="font-medium">XL:</span> 256x256px (landing
                  pages)
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-800">
                Character Traits
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Friendly and approachable</li>
                <li>• Multi-armed (represents multitasking)</li>
                <li>• Expressive facial expressions</li>
                <li>• Round, blob-like body shape</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="mb-2 font-semibold text-gray-800">Usage Tips</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Match emotion to user context</li>
                <li>• Use consistently across platform</li>
                <li>• Avoid overuse (one per page section)</li>
                <li>• Consider animation for key moments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-green-900">
            Implementation Notes
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                Basic Implementation
              </p>
              <code className="block rounded bg-gray-100 p-3 text-sm text-gray-800">
                {`import { JobbleMascot } from '@/components/jobble-mascot';

<JobbleMascot variant="celebrating" size="lg" />`}
              </code>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                With Custom Styling
              </p>
              <code className="block rounded bg-gray-100 p-3 text-sm text-gray-800">
                {`<JobbleMascot
  variant="default"
  size="md"
  className="drop-shadow-lg hover:scale-110 transition-transform"
/>`}
              </code>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                Available Variants
              </p>
              <code className="block rounded bg-gray-100 p-3 text-sm text-gray-800">
                {`'default' | 'celebrating' | 'confused' | 'sleeping' | 'stressed' | 'thinking' | 'waving' | 'tired' | 'excited'`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
