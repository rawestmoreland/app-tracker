'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Heart, Coffee, Users, Target, Sparkles, Gift } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Header Navigation */}
      <header className='absolute inset-x-0 top-0 z-50'>
        <nav
          className='flex items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='text-xl font-bold text-blue-600'>App Track</span>
            </Link>
          </div>
          <div className='flex gap-x-12'>
            <Link
              href='/#features'
              className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600'
            >
              Features
            </Link>
            <Link
              href='/about'
              className='text-sm font-semibold leading-6 text-blue-600 border-b-2 border-blue-600'
            >
              About
            </Link>
          </div>
          <div className='flex lg:flex-1 lg:justify-end'>
            <Link
              href='/sign-in'
              className='text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600'
            >
              Sign in <span aria-hidden='true'>&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 sm:py-32'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <Badge
              variant='secondary'
              className='mb-4 bg-green-100 text-green-800 border-green-200'
            >
              <Gift className='w-4 h-4 mr-2' />
              100% Free Forever
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Born from
              <span className='block text-blue-600'>Frustration</span>
            </h1>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              Hi! I&apos;m an unemployed developer who got completely
              overwhelmed managing hundreds of job applications. So I built this
              tool to save my sanity—and maybe yours too.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]' />
        </div>
      </section>

      {/* Story Section */}
      <section className='py-16 sm:py-24 bg-white'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl'>
            <div className='text-center mb-16'>
              <Sparkles className='mx-auto h-12 w-12 text-yellow-500 mb-4' />
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                My Story
              </h2>
            </div>

            <div className='prose prose-lg max-w-none'>
              <div className='bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl mb-8 border-l-4 border-orange-400'>
                <p className='text-gray-800 text-lg leading-relaxed mb-0'>
                  <strong className='text-orange-700'>The Problem:</strong>{' '}
                  Picture this—I&apos;m 6 months into unemployment, frantically
                  applying to every job I can find. I had applications scattered
                  across emails, screenshots, random notes, and three different
                  spreadsheets that I kept forgetting to update.
                </p>
              </div>

              <div className='bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-2xl mb-8 border-l-4 border-red-400'>
                <p className='text-gray-800 text-lg leading-relaxed mb-0'>
                  <strong className='text-red-700'>The Breaking Point:</strong>{' '}
                  One day, I got called for an interview and had absolutely no
                  clue what role it was for, what company, or even what I&apos;d
                  written in my cover letter. I spent 20 minutes frantically
                  searching through my email while the recruiter waited.
                  Embarrassing doesn&apos;t even begin to cover it.
                </p>
              </div>

              <div className='bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl mb-8 border-l-4 border-blue-400'>
                <p className='text-gray-800 text-lg leading-relaxed mb-0'>
                  <strong className='text-blue-700'>The Solution:</strong> That
                  night, instead of wallowing in self-pity (okay, maybe a little
                  wallowing), I channeled my frustration into code. I built App
                  Track—a simple, intuitive way to keep track of every
                  application, interview, and follow-up without losing my mind.
                </p>
              </div>

              <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border-l-4 border-green-400'>
                <p className='text-gray-800 text-lg leading-relaxed mb-0'>
                  <strong className='text-green-700'>The Mission:</strong> Now I
                  want to help every job seeker avoid the chaos I went through.
                  That&apos;s why App Track is completely free—because looking
                  for work is stressful enough without worrying about
                  subscription fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 sm:py-24 bg-gray-50'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              What Drives Me
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              The principles behind why I built this and keep it free
            </p>
          </div>

          <div className='mx-auto max-w-5xl'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6'>
                  <Heart className='h-8 w-8 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Empathy
                </h3>
                <p className='text-gray-600'>
                  I&apos;ve been where you are. Job searching is tough, and you
                  shouldn&apos;t have to pay for basic organization tools.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6'>
                  <Users className='h-8 w-8 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Community
                </h3>
                <p className='text-gray-600'>
                  Every job seeker deserves access to the same quality tools,
                  regardless of their financial situation.
                </p>
              </div>

              <div className='bg-white p-8 rounded-2xl shadow-sm ring-1 ring-gray-200 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-6'>
                  <Target className='h-8 w-8 text-purple-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Purpose
                </h3>
                <p className='text-gray-600'>
                  If this helps even one person land their dream job, all the
                  late nights coding were worth it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className='py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-indigo-600'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <Coffee className='mx-auto h-12 w-12 text-blue-200 mb-6' />
            <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
              Found App Track Helpful?
            </h2>
            <p className='mt-6 text-lg leading-8 text-blue-100'>
              App Track will always be free, but if it&apos;s helped you stay
              organized and land interviews, a small donation helps me keep the
              servers running and continue improving the platform.
            </p>

            <div className='mt-10 flex flex-col items-center justify-center gap-4'>
              <Button
                asChild
                size='lg'
                variant='secondary'
                className='bg-white text-blue-600 hover:bg-gray-100 px-8'
              >
                <Link
                  href='https://buymeacoffee.com/westmorelandcreative'
                  target='_blank'
                  className='flex items-center'
                >
                  <Coffee className='w-5 h-5 mr-2' />
                  Buy Me a Coffee
                </Link>
              </Button>

              <div className='text-center'>
                <p className='text-blue-200 text-sm'>
                  Or support by spreading the word!
                </p>
                <div className='flex justify-center gap-4 mt-2'>
                  <Button variant='outline' size='sm' asChild>
                    <Link
                      href='https://twitter.com/intent/tweet?url=https://apptrack.space&text=Check%20out%20App%20Track%2C%20a%20free%20job%20application%20tracker%20for%20job%20seekers.'
                      target='_blank'
                    >
                      Share on Twitter
                    </Link>
                  </Button>
                  <Button variant='outline' size='sm'>
                    Tell a Friend
                  </Button>
                </div>
              </div>
            </div>

            <div className='mt-8 p-6 bg-blue-500/20 rounded-xl border border-blue-400/20'>
              <p className='text-blue-100 text-sm'>
                <strong>100% Transparent:</strong> Every donation goes directly
                to hosting costs, development tools, and coffee (lots of
                coffee). I&apos;ll never charge for core features or put
                essential functionality behind a paywall.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 sm:py-24 bg-white'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Ready to Get Organized?
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              Join me and thousands of other job seekers who&apos;ve taken
              control of their search. It&apos;s free, it&apos;s simple, and it
              might just save your sanity.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Button
                asChild
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 px-8'
              >
                <Link href='/waitlist'>Join the waitlist</Link>
              </Button>
              <Button variant='outline' size='lg' asChild>
                <Link href='/#features'>See How It Works</Link>
              </Button>
            </div>

            <p className='mt-6 text-sm text-gray-500'>
              No credit card required • No hidden fees • No bullshit
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900'>
        <div className='mx-auto max-w-7xl px-6 py-12 lg:px-8'>
          <div className='text-center'>
            <Link href='/' className='text-xl font-bold text-blue-400'>
              App Track
            </Link>
            <p className='mt-4 text-sm text-gray-400'>
              Built with ❤️ by a fellow job seeker. &copy;{' '}
              {new Date().getFullYear()} Westmoreland Creative LLC. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
