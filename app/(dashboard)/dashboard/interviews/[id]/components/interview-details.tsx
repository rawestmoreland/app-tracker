'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon } from 'lucide-react';
import type {
  Interview,
  Note,
  Application,
  Company,
  Contact,
} from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
  noteSchema,
  type NoteFormData,
} from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';

type FullInterview = Interview & {
  notes: Note[];
  application: Application & {
    company: Company;
  };
  contacts: Contact[];
};

interface InterviewDetailsProps {
  interview: FullInterview;
}

const formatInterviewType = (type: string) => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatInterviewFormat = (format: string) => {
  return format
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getOutcomeBadgeVariant = (outcome: string | null) => {
  switch (outcome) {
    case 'PASSED':
      return 'default'; // Using default for success
    case 'FAILED':
      return 'destructive';
    case 'PENDING':
      return 'secondary';
    case 'CANCELLED':
      return 'outline';
    case 'RESCHEDULED':
      return 'secondary'; // Using secondary for rescheduled
    default:
      return 'secondary';
  }
};

const formatNoteType = (type: string) => {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function InterviewDetails({ interview }: InterviewDetailsProps) {
  const router = useRouter();
  const [isAddingNote, setIsAddingNote] = useState(false);

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: '',
      type: 'GENERAL',
      interviewId: interview.id,
    },
  });

  const handleAddNote = async (data: NoteFormData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      noteForm.reset();
      setIsAddingNote(false);
      router.refresh();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/dashboard/applications'>Applications</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/dashboard/applications/${interview.application.id}`}
                  >
                    {interview.application.title} at{' '}
                    {interview.application.company.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Interview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className='mt-6 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {formatInterviewType(interview.type)} Interview
              </h1>
              <p className='mt-2 text-lg text-gray-600'>
                {interview.application.title} at{' '}
                {interview.application.company.name}
              </p>
            </div>
            <div className='flex space-x-3'>
              <Button variant='outline' asChild>
                <Link
                  href={`/dashboard/applications/${interview.application.id}`}
                >
                  Back to Application
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Interview Details */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Interview Details
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <UserIcon className='h-5 w-5 text-gray-400' />
                    <div>
                      <h3 className='text-sm font-medium text-gray-700'>
                        Type
                      </h3>
                      <p className='text-sm text-gray-900'>
                        {formatInterviewType(interview.type)}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <MapPinIcon className='h-5 w-5 text-gray-400' />
                    <div>
                      <h3 className='text-sm font-medium text-gray-700'>
                        Format
                      </h3>
                      <p className='text-sm text-gray-900'>
                        {formatInterviewFormat(interview.format)}
                      </p>
                    </div>
                  </div>

                  {interview.duration && (
                    <div className='flex items-center space-x-3'>
                      <ClockIcon className='h-5 w-5 text-gray-400' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-700'>
                          Duration
                        </h3>
                        <p className='text-sm text-gray-900'>
                          {interview.duration} minutes
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className='space-y-4'>
                  {interview.scheduledAt && (
                    <div className='flex items-center space-x-3'>
                      <CalendarIcon className='h-5 w-5 text-gray-400' />
                      <div>
                        <h3 className='text-sm font-medium text-gray-700'>
                          Scheduled Date
                        </h3>
                        <p className='text-sm text-gray-900'>
                          {new Date(interview.scheduledAt).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {interview.outcome && (
                    <div>
                      <h3 className='text-sm font-medium text-gray-700 mb-2'>
                        Outcome
                      </h3>
                      <Badge
                        variant={getOutcomeBadgeVariant(interview.outcome)}
                      >
                        {formatInterviewType(interview.outcome)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {interview.feedback && (
                <div className='mt-6'>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>
                    Feedback
                  </h3>
                  <div className='bg-gray-50 rounded-md p-3'>
                    <p className='text-sm text-gray-900 whitespace-pre-wrap'>
                      {interview.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interview Notes */}
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Notes</h2>
                <Button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  variant={isAddingNote ? 'outline' : 'default'}
                >
                  {isAddingNote ? 'Cancel' : 'Add Note'}
                </Button>
              </div>

              {/* Add Note Form */}
              {isAddingNote && (
                <div className='mb-6 p-4 bg-gray-50 rounded-md'>
                  <Form {...noteForm}>
                    <form
                      onSubmit={noteForm.handleSubmit(handleAddNote)}
                      className='space-y-4'
                    >
                      <FormField
                        control={noteForm.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select note type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='GENERAL'>General</SelectItem>
                                <SelectItem value='INTERVIEW_PREP'>
                                  Interview Prep
                                </SelectItem>
                                <SelectItem value='FEEDBACK'>
                                  Feedback
                                </SelectItem>
                                <SelectItem value='FOLLOW_UP'>
                                  Follow Up
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={noteForm.control}
                        name='content'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note Content</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder='Add your interview notes here...'
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='flex justify-end space-x-3'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setIsAddingNote(false)}
                        >
                          Cancel
                        </Button>
                        <Button type='submit'>Save Note</Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}

              {/* Notes List */}
              <div className='space-y-4'>
                {interview.notes.length === 0 ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-500'>
                      No notes yet. Add your first note above.
                    </p>
                  </div>
                ) : (
                  interview.notes.map((note) => (
                    <div
                      key={note.id}
                      className='border border-gray-200 rounded-md p-4'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <Badge variant='outline' className='text-xs'>
                          {formatNoteType(note.type)}
                        </Badge>
                        <time className='text-xs text-gray-500'>
                          {new Date(note.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </time>
                      </div>
                      <p className='text-sm text-gray-900 whitespace-pre-wrap'>
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Application Info */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Application Details
              </h3>
              <div className='space-y-3'>
                <div>
                  <h4 className='text-sm font-medium text-gray-700'>
                    Position
                  </h4>
                  <p className='text-sm text-gray-900'>
                    {interview.application.title}
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-700'>Company</h4>
                  <p className='text-sm text-gray-900'>
                    {interview.application.company.name}
                  </p>
                </div>
                {interview.application.location && (
                  <div>
                    <h4 className='text-sm font-medium text-gray-700'>
                      Location
                    </h4>
                    <p className='text-sm text-gray-900'>
                      {interview.application.location}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className='text-sm font-medium text-gray-700'>
                    Applied Date
                  </h4>
                  <p className='text-sm text-gray-900'>
                    {new Date(
                      interview.application.appliedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contacts */}
            {interview.contacts.length > 0 && (
              <div className='bg-white rounded-lg shadow p-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Interview Contacts
                </h3>
                <div className='space-y-3'>
                  {interview.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className='border-b border-gray-200 last:border-0 pb-3 last:pb-0'
                    >
                      <h4 className='text-sm font-medium text-gray-900'>
                        {contact.name}
                      </h4>
                      {contact.title && (
                        <p className='text-xs text-gray-600'>{contact.title}</p>
                      )}
                      {contact.email && (
                        <p className='text-xs text-gray-600'>{contact.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <Button variant='outline' className='w-full' asChild>
                  <Link
                    href={`/dashboard/applications/${interview.application.id}`}
                  >
                    View Full Application
                  </Link>
                </Button>
                <Button variant='outline' className='w-full' asChild>
                  <Link
                    href={`dashboard/contacts/new?companyId=${interview.application.company.id}`}
                  >
                    Add Contact
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
