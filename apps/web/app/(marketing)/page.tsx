'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { AppTrackerLoading } from '@/components/ui/loading';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@clerk/nextjs';
import { ScreenshotsSection } from './_components/screenshots-section';

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* <Badge variant='secondary' className='mb-4'>
            🚀 Trusted by 10,000+ job seekers
          </Badge> */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Juggle Your Job Applications
            <span className="block text-blue-600">With Ease</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Organize applications, manage interviews, and get insights that help
            you land your dream job faster. Never lose track of another
            opportunity again.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/sign-up">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      title: 'Application Tracking',
      description:
        'Keep track of every job application with detailed status updates, notes, and follow-up reminders.',
      icon: '📋',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Interview Management',
      description:
        'Schedule interviews, set reminders, and track your performance across multiple rounds.',
      icon: '🎯',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Company Database',
      description:
        'Build your own database of companies with contact information and application history.',
      icon: '🏢',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Analytics & Insights',
      description:
        'Get insights into your job search performance with detailed analytics and progress tracking.',
      icon: '📊',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Resume Management',
      description:
        'Store and organize multiple resume versions tailored for different job applications.',
      icon: '📄',
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Smart Reminders',
      description:
        'Never miss a follow-up with intelligent reminders for applications and interviews.',
      icon: '⏰',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Powerful features designed to streamline your job search and keep
            you organized throughout your career journey.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base leading-7 font-semibold text-gray-900">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}
                  >
                    <span className="text-xl">{feature.icon}</span>
                  </span>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

// Social Proof Section
function SocialProofSection() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Job Seekers Worldwide
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of professionals who have streamlined their job
            search with Jobble.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[
            {
              quote:
                'Jobble completely transformed my job search. I went from scattered spreadsheets to a professional system that helped me land my dream role.',
              author: 'Sarah Chen',
              role: 'Software Engineer',
              company: 'TechCorp',
            },
            {
              quote:
                'The interview tracking feature is a game-changer. I never missed a follow-up and always knew exactly where I stood in each process.',
              author: 'Marcus Rodriguez',
              role: 'Product Manager',
              company: 'InnovateCo',
            },
            {
              quote:
                'Finally, a tool that understands what job seekers actually need. The analytics helped me understand my strengths and improve my approach.',
              author: 'Emily Watson',
              role: 'Marketing Director',
              company: 'GrowthLabs',
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"
            >
              <blockquote className="text-gray-900">
                <p className="text-lg leading-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <div className="mt-6 flex items-center gap-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                  <span className="font-semibold text-white">
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <section className="bg-blue-600 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Job Search?
          </h2>
          <p className="mt-4 text-lg text-white">
            Join thousands of professionals who have already streamlined their
            career journey with Jobble.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
            {isSignedIn ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard <span aria-hidden="true">&rarr;</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/sign-in">
                  Sign In <span aria-hidden="true">&rarr;</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="h-12 shrink-0 bg-gray-900">
      <div className="flex h-12 items-center justify-center">
        <p className="text-center text-sm text-gray-300">
          &copy; 2025 Westmoreland Creative. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Main Page Component
function LandingPageContent() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Jobble',
            description:
              'Track job applications, manage interviews, and organize your career journey with Jobble.',
            url: 'https://jobble.app',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free tier available',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1247',
            },
            author: {
              '@type': 'Organization',
              name: 'Jobble',
            },
            featureList: [
              'Application Tracking',
              'Interview Management',
              'Company Database',
              'Analytics & Insights',
              'Resume Management',
              'Smart Reminders',
            ],
          }),
        }}
      />
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-blue-600">Jobble</span>
            </Link>
          </div>
          <div className="hidden gap-x-12 md:flex">
            <Link
              href="#features"
              className="text-sm leading-6 font-semibold text-gray-900 hover:text-blue-600"
            >
              Features
            </Link>
            {/* <Link
              href='/pricing'
              className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600'
            >
              Pricing
            </Link> */}
            <Link
              href="/about"
              className="text-sm leading-6 font-semibold text-gray-900 hover:text-blue-600"
            >
              About
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="text-sm leading-6 font-semibold text-gray-900 hover:text-blue-600"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">App</span>
                <span aria-hidden="true" className="ml-1">
                  &rarr;
                </span>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm leading-6 font-semibold text-gray-900 hover:text-blue-600"
              >
                Sign in <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        {/* <SocialProofSection /> */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<AppTrackerLoading />}>
      <LandingPageContent />
    </Suspense>
  );
}
