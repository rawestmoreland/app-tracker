'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-9xl font-bold text-transparent">
            404
          </div>
          <div className="absolute -top-4 -right-4 h-8 w-8 animate-bounce rounded-full bg-yellow-400"></div>
          <div
            className="absolute -bottom-4 -left-4 h-6 w-6 animate-bounce rounded-full bg-pink-400"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 h-4 w-4 animate-bounce rounded-full bg-green-400"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Oops! This job posting seems to have been filled
          </h1>

          <p className="text-xl leading-relaxed text-gray-600">
            The page you&apos;re looking for has either been moved, deleted, or
            never existed. Just like that perfect job opportunity that got away!
            🎯
          </p>

          {/* Fun Job-Related Message */}
          <div className="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-center space-x-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                Jobble Pro Tip
              </span>
            </div>
            <p className="text-gray-700">
              &ldquo;When one door closes, another opens. But we often look so
              long and so regretfully upon the closed door that we do not see
              the one which has opened for us.&rdquo;
              <br />
              <span className="mt-2 block text-sm text-gray-500">
                - Alexander Graham Bell (and probably every career coach ever)
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
            >
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5" />
                <span>View Applications</span>
              </Link>
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">
                Can&apos;t find what you&apos;re looking for?
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Try searching for a specific application or company name in your
              dashboard
            </p>
          </div>

          {/* Fun Stats */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600">404</div>
              <div className="text-sm text-gray-600">Pages Not Found</div>
            </div>
            <div className="rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-600">∞</div>
              <div className="text-sm text-gray-600">Job Opportunities</div>
            </div>
            <div className="rounded-xl border border-gray-200/50 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-sm text-gray-600">Chance to Bounce Back</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="fixed top-20 left-10 h-3 w-3 animate-ping rounded-full bg-yellow-400 opacity-75"></div>
        <div
          className="fixed top-40 right-20 h-2 w-2 animate-ping rounded-full bg-pink-400 opacity-75"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="fixed bottom-40 left-20 h-4 w-4 animate-ping rounded-full bg-blue-400 opacity-75"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="fixed right-10 bottom-20 h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>
    </div>
  );
}
