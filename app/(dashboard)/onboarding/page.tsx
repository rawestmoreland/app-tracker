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
import { Badge } from '@/components/ui/badge';
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

  const schema = z.object({
    signupReason: z.enum(
      Object.values(SignupReason) as [SignupReason, ...SignupReason[]]
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
      const res = await completeOnboarding(data);
      if (res?.message) {
        await user?.reload();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReason = form.watch('signupReason');

  return (
    <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4'>
            <CheckCircle2 className='w-8 h-8 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Welcome to JobTracker
          </h1>
          <p className='text-gray-600 text-lg'>
            Let&apos;s get you set up for success
          </p>
        </div>

        {/* Progress Indicator */}
        <div className='flex items-center justify-center mb-8'>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <div className='w-8 h-1 bg-green-500 rounded-full'></div>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            <div className='w-8 h-1 bg-gray-300 rounded-full'></div>
            <div className='w-3 h-3 bg-gray-300 rounded-full'></div>
          </div>
        </div>

        {/* Form Card */}
        <Card className='shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
          <CardHeader className='text-center pb-6'>
            <CardTitle className='text-xl font-semibold text-gray-900'>
              What brings you here today?
            </CardTitle>
            <CardDescription className='text-gray-600'>
              This helps us personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='signupReason'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='sr-only'>Signup Reason</FormLabel>
                      <div className='grid gap-3'>
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
                                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-blue-50 border-blue-200'
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                  onClick={() => field.onChange(reason)}
                                >
                                  <div className='flex items-start space-x-3'>
                                    <div
                                      className={`p-2 rounded-lg ${data.color}`}
                                    >
                                      <IconComponent className='w-5 h-5' />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                      <h3 className='font-medium text-gray-900'>
                                        {data.title}
                                      </h3>
                                      <p className='text-sm text-gray-600 mt-1'>
                                        {data.description}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className='w-5 h-5 text-blue-600 flex-shrink-0' />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
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
                  type='submit'
                  className='w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                  disabled={!selectedReason || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className='flex items-center space-x-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
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
        <div className='text-center mt-6'>
          <p className='text-sm text-gray-500'>
            You can change this later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
