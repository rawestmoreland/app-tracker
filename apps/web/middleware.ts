import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSignedInUser } from './app/lib/auth';
import { User } from '@prisma/client';

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/waitlist(.*)',
  '/about(.*)',
  '/api/webhooks/clerk(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  let dbUser: User | null = null;

  try {
    const response = await getSignedInUser();
    dbUser = response.dbUser;
  } catch (error) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // Temporary bypass for users completing onboarding
  const url = new URL(req.url);
  if (userId && url.searchParams.get('onboarding') === 'complete') {
    return NextResponse.next();
  }

  // Catch users who do not have `onboardingComplete: true` in the database
  // Redirect them to the /onboarding route to complete onboarding
  if (userId && !dbUser?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
