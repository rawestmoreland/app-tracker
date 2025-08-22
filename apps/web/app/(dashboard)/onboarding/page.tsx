'use client';

import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from './_actions/complete-onboarding';
import z from 'zod';
import { SignupReason } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Building2,
  Sparkles,
} from 'lucide-react';

const signupReasonData = {
  [SignupReason.BETWEEN_JOBS]: {
    title: 'Between Jobs',
    description: 'Currently searching for your next opportunity',
    icon: Briefcase,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [SignupReason.JUST_GRADUATED]: {
    title: 'Just Graduated',
    description: 'Ready to start your professional journey',
    icon: GraduationCap,
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  [SignupReason.EMPLOYED_AND_LOOKING]: {
    title: 'Employed & Looking',
    description: 'Exploring new opportunities while working',
    icon: Building2,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  [SignupReason.OTHER]: {
    title: 'Other',
    description: 'Tell us more about your situation',
    icon: Sparkles,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Debug logging for production
  React.useEffect(() => {
    console.log('Onboarding component mounted');
    console.log('User:', user?.id);
    console.log('User metadata:', user?.publicMetadata);

    // If user has already completed onboarding, redirect them
    if (user?.publicMetadata?.onboardingComplete) {
      console.log('User already completed onboarding, redirecting...');
      router.push('/dashboard');
    }
  }, [user, router]);

  const schema = z.object({
    signupReason: z.enum(
      Object.values(SignupReason) as [SignupReason, ...SignupReason[]],
    ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      signupReason: undefined,
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      console.log('Starting onboarding completion...', data);
      const res = await completeOnboarding(data);
      console.log('Onboarding response:', res);

      if (
        (res?.message as { onboardingComplete: boolean })?.onboardingComplete
      ) {
        console.log('Onboarding completed successfully, reloading user...');
        // Wait for user reload to complete
        await user?.reload();

        console.log('User reloaded, waiting for metadata update...');
        // Add a small delay to ensure metadata is updated
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Redirecting to dashboard...');
        // Try Next.js router first, fallback to window.location
        try {
          router.push('/dashboard?onboarding=complete');
          // If router.push doesn't work within 2 seconds, force navigation
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              console.log('Router push failed, forcing navigation...');
              window.location.href = '/dashboard?onboarding=complete';
            }
          }, 2000);
        } catch (routerError) {
          console.error('Router error:', routerError);
          window.location.href = '/dashboard?onboarding=complete';
        }
      } else {
        console.error('Onboarding completion failed:', res);
        // Fallback redirect even if onboarding completion check fails
        window.location.href = '/dashboard?onboarding=complete';
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Fallback redirect even if there's an error
      window.location.href = '/dashboard?onboarding=complete';
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReason = form.watch('signupReason');

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome to JobTracker
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s get you set up for success
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className="h-1 w-8 rounded-full bg-green-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div className="h-1 w-8 rounded-full bg-gray-300"></div>
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              What brings you here today?
            </CardTitle>
            <CardDescription className="text-gray-600">
              This helps us personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="signupReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Signup Reason</FormLabel>
                      <div className="grid gap-3">
                        {Object.entries(signupReasonData).map(
                          ([reason, data]) => {
                            const IconComponent = data.icon;
                            const isSelected = field.value === reason;

                            return (
                              <div
                                key={reason}
                                className={`relative cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? 'ring-2 ring-blue-500 ring-offset-2'
                                    : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                                }`}
                              >
                                <div
                                  className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                                    isSelected
                                      ? 'border-blue-200 bg-blue-50'
                                      : 'border-gray-200 bg-white hover:border-gray-300'
                                  }`}
                                  onClick={() => field.onChange(reason)}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`rounded-lg p-2 ${data.color}`}
                                    >
                                      <IconComponent className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="font-medium text-gray-900">
                                        {data.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-gray-600">
                                        {data.description}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selected Reason Preview */}
                {/* {selectedReasonData && (
                  <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Badge
                        variant='secondary'
                        className='bg-blue-100 text-blue-800'
                      >
                        You selected
                      </Badge>
                    </div>
                    <p className='text-sm text-blue-900'>
                      <strong>{selectedReasonData.title}</strong> -{' '}
                      {selectedReasonData.description}
                    </p>
                  </div>
                )} */}

                <Button
                  type="submit"
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                  disabled={!selectedReason || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Setting up your account...</span>
                    </div>
                  ) : (
                    'Continue to Dashboard'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can change this later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
