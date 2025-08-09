'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Application,
  Company,
  InterviewFormat,
  InterviewOutcome,
  InterviewType,
} from '@prisma/client';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';

interface PageProps {
  application: Application & { company: Company };
}

export function NewInterviewContent({ application }: PageProps) {
  const router = useRouter();
  const routeParams = useParams();

  const schema = z.object({
    type: z.enum(InterviewType),
    format: z.enum(InterviewFormat),
    scheduledAt: z.date(),
    duration: z.number().min(1),
    feedback: z.string().optional(),
    outcome: z.enum(InterviewOutcome),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: InterviewType.PHONE_SCREEN,
      format: InterviewFormat.PHONE,
      scheduledAt: new Date(),
      duration: 60,
      feedback: '',
      outcome: InterviewOutcome.PENDING,
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await fetch(`/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, applicationId: application.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to create interview');
      }

      router.push(`/applications/${application.id}`);
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Failed to create interview');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Link
            href={`/applications/${routeParams.id}`}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium'
          >
            ← Back to Application
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 mt-2'>
            Schedule Interview
          </h1>
          <p className='text-gray-600 mt-1'>
            {application.title} at {application.company.name}
          </p>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select an interview type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={InterviewType.PHONE_SCREEN}>
                            Phone Screen
                          </SelectItem>
                          <SelectItem value={InterviewType.TECHNICAL}>
                            Technical
                          </SelectItem>
                          <SelectItem value={InterviewType.BEHAVIORAL}>
                            Behavioral
                          </SelectItem>
                          <SelectItem value={InterviewType.SYSTEM_DESIGN}>
                            System Design
                          </SelectItem>
                          <SelectItem value={InterviewType.CODING_CHALLENGE}>
                            Coding Challenge
                          </SelectItem>
                          <SelectItem value={InterviewType.PAIR_PROGRAMMING}>
                            Pair Programming
                          </SelectItem>
                          <SelectItem value={InterviewType.ONSITE}>
                            Onsite
                          </SelectItem>
                          <SelectItem value={InterviewType.FINAL_ROUND}>
                            Final Round
                          </SelectItem>
                          <SelectItem value={InterviewType.REFERENCE_CHECK}>
                            Reference Check
                          </SelectItem>
                          <SelectItem value={InterviewType.OTHER}>
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='format'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select an interview format' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={InterviewFormat.PHONE}>
                            Phone
                          </SelectItem>
                          <SelectItem value={InterviewFormat.VIDEO}>
                            Video
                          </SelectItem>
                          <SelectItem value={InterviewFormat.IN_PERSON}>
                            In Person
                          </SelectItem>
                          <SelectItem value={InterviewFormat.CODING_PLATFORM}>
                            Coding Platform
                          </SelectItem>
                          <SelectItem value={InterviewFormat.TAKE_HOME}>
                            Take Home
                          </SelectItem>
                          <SelectItem value={InterviewFormat.OTHER}>
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='scheduledAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            captionLayout='dropdown'
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='duration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          id='duration'
                          name='duration'
                          value={field.value}
                          onChange={field.onChange}
                          min='15'
                          step='15'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='outcome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outcome</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select an outcome' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={InterviewOutcome.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={InterviewOutcome.PASSED}>
                          Passed
                        </SelectItem>
                        <SelectItem value={InterviewOutcome.FAILED}>
                          Failed
                        </SelectItem>
                        <SelectItem value={InterviewOutcome.CANCELLED}>
                          Cancelled
                        </SelectItem>
                        <SelectItem value={InterviewOutcome.RESCHEDULED}>
                          Rescheduled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='feedback'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={12}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Interview feedback, notes, or observations with line breaks as needed...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-4 pt-6'>
                <Button
                  variant='link'
                  type='button'
                  className='text-blue-600 hover:text-blue-800 text-sm p-0 font-medium cursor-pointer'
                  asChild
                >
                  <Link href={`/applications/${routeParams.id}`}>Cancel</Link>
                </Button>
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  className='cursor-pointer'
                >
                  {form.formState.isSubmitting
                    ? 'Creating...'
                    : 'Schedule Interview'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
