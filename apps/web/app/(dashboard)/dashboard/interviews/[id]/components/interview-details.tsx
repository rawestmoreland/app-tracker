'use client';

import Link from 'next/link';

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
import { InterviewStatusDropdown } from '@/app/_components/dashboard/interview-status-dropdown';
import { InterviewTypeDropdown } from '@/app/_components/dashboard/interview-type-dropdown';
import { InterviewFormatDropdown } from '@/app/_components/dashboard/interview-format-dropdown';
import { InterviewDurationEditor } from '@/app/_components/dashboard/interview-duration-editor';
import { InterviewDateTimeEditor } from '@/app/_components/dashboard/interview-datetime-editor';
import { NotesSection } from '@/app/_components/dashboard/notes/notes-section';
import { addNote } from '@/lib/actions/application-actions';
import { toast } from 'sonner';

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


export default function InterviewDetails({ interview }: InterviewDetailsProps) {
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
      const result = await addNote(interview.application.id, {
        ...data,
        interviewId: interview.id,
      });

      if (result.success) {
        toast.success('Note added successfully');
        noteForm.reset();
      } else {
        toast.error(result.error || 'Failed to add note');
      }
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/applications">Applications</Link>
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

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formatInterviewType(interview.type)} Interview
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {interview.application.title} at{' '}
                {interview.application.company.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link
                  href={`/dashboard/applications/${interview.application.id}`}
                >
                  Back to Application
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Interview Details */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Interview Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Type
                      </h3>
                      <InterviewTypeDropdown
                        interviewId={interview.id}
                        currentType={interview.type}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Format
                      </h3>
                      <InterviewFormatDropdown
                        interviewId={interview.id}
                        currentFormat={interview.format}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Duration
                      </h3>
                      <InterviewDurationEditor
                        interviewId={interview.id}
                        currentDuration={interview.duration}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Scheduled Date
                      </h3>
                      <InterviewDateTimeEditor
                        interviewId={interview.id}
                        currentDateTime={interview.scheduledAt}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Outcome
                    </h3>
                    <InterviewStatusDropdown
                      interviewId={interview.id}
                      currentOutcome={interview.outcome}
                    />
                  </div>
                </div>
              </div>

              {interview.feedback && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-medium text-gray-700">
                    Feedback
                  </h3>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm whitespace-pre-wrap text-gray-900">
                      {interview.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Interview Notes */}
            <div className="rounded-lg bg-white p-6 shadow">
              {/* Add Note Form */}
              <NotesSection
                noteForm={noteForm}
                notes={interview.notes}
                handleAddNote={handleAddNote}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Info */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Application Details
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Position
                  </h4>
                  <p className="text-sm text-gray-900">
                    {interview.application.title}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Company</h4>
                  <p className="text-sm text-gray-900">
                    {interview.application.company.name}
                  </p>
                </div>
                {interview.application.location && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Location
                    </h4>
                    <p className="text-sm text-gray-900">
                      {interview.application.location}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Applied Date
                  </h4>
                  <p className="text-sm text-gray-900">
                    {new Date(
                      interview.application.appliedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contacts */}
            {interview.contacts.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Interview Contacts
                </h3>
                <div className="space-y-3">
                  {interview.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <h4 className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </h4>
                      {contact.title && (
                        <p className="text-xs text-gray-600">{contact.title}</p>
                      )}
                      {contact.email && (
                        <p className="text-xs text-gray-600">{contact.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`/dashboard/applications/${interview.application.id}`}
                  >
                    View Full Application
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
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
