'use client';

import {
  Loading,
  AppTrackerLoading,
  MotivationalLoading,
} from '@/components/ui/loading';
import InterviewsLoading from '@/app/_components/dashboard/interviews-loading';

export default function LoadingStatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Loading States Showcase
          </h1>
          <p className="text-lg text-gray-600">
            All available loading state variants used throughout Jobble
          </p>
        </div>

        {/* Dots Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Dots Variant
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Small
                </p>
                <Loading variant="dots" size="sm" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Medium
                </p>
                <Loading variant="dots" size="md" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Large
                </p>
                <Loading variant="dots" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Pulse Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Pulse Variant
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Small
                </p>
                <Loading variant="pulse" size="sm" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Medium
                </p>
                <Loading variant="pulse" size="md" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Large
                </p>
                <Loading variant="pulse" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Spin Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Spin Variant
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Small
                </p>
                <Loading variant="spin" size="sm" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Medium
                </p>
                <Loading variant="spin" size="md" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Large
                </p>
                <Loading variant="spin" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Bounce Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Bounce Variant
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Small
                </p>
                <Loading variant="bounce" size="sm" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Medium
                </p>
                <Loading variant="bounce" size="md" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Large
                </p>
                <Loading variant="bounce" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Typing Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Typing Variant
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Small
                </p>
                <Loading variant="typing" size="sm" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Medium
                </p>
                <Loading variant="typing" size="md" />
              </div>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 p-6">
                <p className="mb-3 text-sm font-medium text-gray-600">
                  Large
                </p>
                <Loading variant="typing" size="lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Variant */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Skeleton Variant (Dashboard)
          </h2>
          <div className="rounded-lg border border-gray-100 bg-gray-50">
            <Loading variant="skeleton" />
          </div>
        </div>

        {/* App Tracker Loading */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            App Tracker Loading
          </h2>
          <div className="rounded-lg border border-gray-100 bg-gray-50">
            <AppTrackerLoading />
          </div>
        </div>

        {/* Interview Loading */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Interviews Loading (Calendar/Video/Users Icons)
          </h2>
          <div className="rounded-lg border border-gray-100 bg-gray-50">
            <InterviewsLoading />
          </div>
        </div>

        {/* Motivational Loading */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Motivational Loading
          </h2>
          <div className="rounded-lg border border-gray-100 bg-gray-50">
            <MotivationalLoading />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-blue-900">
            Usage Examples
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-mono text-sm text-gray-800">
                {'<Loading variant="dots" size="md" />'}
              </p>
              <p className="text-sm text-gray-600">
                Default loading state for buttons and small components
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-mono text-sm text-gray-800">
                {'<Loading variant="skeleton" />'}
              </p>
              <p className="text-sm text-gray-600">
                Page-level loading state showing content structure
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-mono text-sm text-gray-800">
                {'<AppTrackerLoading />'}
              </p>
              <p className="text-sm text-gray-600">
                Full-page loading for job application dashboard
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-mono text-sm text-gray-800">
                {'<InterviewsLoading />'}
              </p>
              <p className="text-sm text-gray-600">
                Interview-specific loading with Calendar, Video, and Users icons
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-mono text-sm text-gray-800">
                {'<MotivationalLoading />'}
              </p>
              <p className="text-sm text-gray-600">
                Engaging loading state with motivational messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
