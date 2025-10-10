'use client';

import { Button } from '@/components/ui/button';
import {
  Search,
  Briefcase,
  Home,
  ArrowLeft,
  AlertTriangle,
  FileQuestion,
  ShieldAlert,
  ServerCrash,
} from 'lucide-react';
import { NotFoundPage } from '@/components/error-pages/not-found-page';

export default function ErrorPagesShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">
            Error & Not-Found Pages Showcase
          </h1>
          <p className="text-lg text-gray-600">
            All error state designs used throughout Jobble
          </p>
        </div>

        {/* 404 Not Found - Current Design */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
            <FileQuestion className="mr-2 h-6 w-6 text-blue-600" />
            404 Not Found (Production Design)
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            This is the actual 404 page used throughout Jobble. Located at{' '}
            <code className="rounded bg-gray-100 px-2 py-1 text-xs">
              components/error-pages/not-found-page.tsx
            </code>
          </p>
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
            <div className="scale-75 origin-top">
              <NotFoundPage />
            </div>
          </div>
        </div>

        {/* 403 Forbidden */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
            <ShieldAlert className="mr-2 h-6 w-6 text-red-600" />
            403 Forbidden
          </h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="relative mb-8">
                <div className="animate-pulse bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-9xl font-bold text-transparent">
                  403
                </div>
                <div className="absolute -top-4 left-1/2 h-16 w-16 -translate-x-1/2 animate-bounce">
                  <ShieldAlert className="h-16 w-16 text-red-500" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="mb-4 text-3xl font-bold text-gray-900">
                  Access Denied
                </h3>

                <p className="text-lg leading-relaxed text-gray-600">
                  Sorry, you don&apos;t have permission to access this page.
                  This area is restricted to administrators only.
                </p>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                  <div className="mb-3 flex items-center justify-center space-x-2">
                    <ShieldAlert className="h-6 w-6 text-red-600" />
                    <span className="text-lg font-semibold text-red-800">
                      Need Access?
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    Contact your system administrator if you believe you should
                    have access to this resource.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 500 Server Error */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
            <ServerCrash className="mr-2 h-6 w-6 text-purple-600" />
            500 Server Error
          </h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="relative mb-8">
                <div className="animate-pulse bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-9xl font-bold text-transparent">
                  500
                </div>
                <div className="absolute -top-4 left-1/2 h-16 w-16 -translate-x-1/2 animate-bounce">
                  <ServerCrash className="h-16 w-16 text-purple-500" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="mb-4 text-3xl font-bold text-gray-900">
                  Something went wrong on our end
                </h3>

                <p className="text-lg leading-relaxed text-gray-600">
                  Don&apos;t worry, it&apos;s not you - it&apos;s us. Our
                  servers are having a moment. We&apos;ve been notified and are
                  working on it!
                </p>

                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
                  <div className="mb-3 flex items-center justify-center space-x-2">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                    <span className="text-lg font-semibold text-purple-800">
                      Jobble Pro Tip
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    While we fix this, why not take a quick break? Your dream
                    job isn&apos;t going anywhere, and neither is your data!
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Try Again
                  </Button>

                  <Button variant="outline" size="lg">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generic Error State */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
            <AlertTriangle className="mr-2 h-6 w-6 text-yellow-600" />
            Generic Error State
          </h2>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="animate-bounce">
                  <AlertTriangle className="h-24 w-24 text-yellow-500" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="mb-4 text-3xl font-bold text-gray-900">
                  Oops! Something Unexpected Happened
                </h3>

                <p className="text-lg leading-relaxed text-gray-600">
                  We encountered an unexpected error. Don&apos;t worry, your
                  job applications are safe!
                </p>

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
                  <div className="mb-3 flex items-center justify-center space-x-2">
                    <Search className="h-6 w-6 text-yellow-600" />
                    <span className="text-lg font-semibold text-yellow-800">
                      What you can do
                    </span>
                  </div>
                  <ul className="space-y-2 text-left text-sm text-yellow-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Refresh the page and try again</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Check your internet connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        If the problem persists, contact support@jobble.com
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Refresh Page
                  </Button>

                  <Button variant="outline" size="lg">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-blue-900">
            Usage Guidelines
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                404 Not Found
              </p>
              <p className="text-sm text-gray-600">
                Use when a requested resource or page doesn&apos;t exist. Keep
                the tone light and helpful.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">403 Forbidden</p>
              <p className="text-sm text-gray-600">
                Use when a user tries to access a restricted area without
                proper permissions.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                500 Server Error
              </p>
              <p className="text-sm text-gray-600">
                Use for server-side errors. Reassure users and let them know
                it&apos;s being handled.
              </p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="mb-2 font-semibold text-gray-800">
                Generic Error
              </p>
              <p className="text-sm text-gray-600">
                Use for unexpected errors. Provide clear next steps and
                recovery options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
