/* eslint-disable @next/next/no-img-element */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApplicationStatus,
  Interview,
  Contact,
  RemoteType,
  Application,
  Company,
  Note,
  NoteType,
  ApplicationEvent,
  Resume,
} from '@prisma/client';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApplicationFormData, schema } from '../../lib/new-application-schema';
import ApplicationForm from '../../components/new-application-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';
import ResumeSelector from '@/components/resume-selector';
import {
  getRemotePolicyColor,
  getSizeColor,
  getStatusColor,
} from '@/lib/utils';
import {
  addApplicationNote,
  deleteApplication,
  deleteResume,
  updateApplication,
} from '@/lib/actions/application-actions';
import { NoteFormData, noteSchema } from '../../lib/new-note-schema';
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
import { DollarSignIcon, GlobeIcon, LinkIcon, MapPinIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ActivityLog from './activity-log';
import TiptapEditor, { TiptapDisplay } from '@/components/tiptap-editor';
import { startCase } from 'lodash';
import { NotesSection } from '@/app/_components/dashboard/notes/notes-section';

type FullApplication = Application & {
  company: Company;
  interviews: (Interview & {
    contacts: Contact[];
  })[];
  notes: Note[];
  events: ApplicationEvent[];
  appliedAt: Date;
  connectedResume?: Resume | null;
};

export default function ApplicationContent({
  application,
  companies,
  resumes,
}: {
  application: FullApplication;
  companies: Company[];
  resumes: Resume[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(
    application.resumeId || null,
  );

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      jobUrl: '',
      lowSalary: undefined,
      highSalary: undefined,
      currency: 'USD',
      location: '',
      remote: application?.remote || RemoteType.ON_SITE,
      status: application?.status || ApplicationStatus.APPLIED,
      appliedAt: application?.appliedAt || new Date(),
      companyId: application?.company.id || '',
      companyName: '',
      companyUrl: '',
      referredBy: application?.referredBy || '',
    },
  });

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: '',
      type: NoteType.GENERAL,
      interviewId: undefined,
      applicationId: application.id,
    },
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        title: application?.title || '',
        description: application?.description || '',
        jobUrl: application?.jobUrl || '',
        lowSalary: application?.lowSalary || 0,
        highSalary: application?.highSalary || 0,
        currency: application?.currency || 'USD',
        location: application?.location || '',
        remote: application?.remote || RemoteType.ON_SITE,
        status: application?.status || ApplicationStatus.APPLIED,
        appliedAt: application?.appliedAt || new Date(),
        companyId: application?.company.id || '',
        companyName: '',
        companyUrl: '',
      });
    }
  }, [editing]);

  const handleUpdate = async (data: ApplicationFormData) => {
    const result = await updateApplication(application.id, data);

    if (result.success) {
      setEditing(false);
    } else {
      alert(result.error || 'Failed to update application');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    const result = await deleteApplication(application.id);

    if (result.success) {
      router.push('/dashboard');
    } else {
      alert(result.error || 'Failed to delete application');
    }
  };

  const handleAddNote = async (data: NoteFormData) => {
    const result = await addApplicationNote(application.id, data);

    if (result.success) {
      noteForm.reset();
    } else {
      alert(result.error || 'Failed to add note');
    }
  };

  const handleResumeChange = (resumeId: string | null) => {
    setCurrentResumeId(resumeId);
    // Refresh the page to get the updated application data
    router.refresh();
  };

  const displaySalary = (
    lowSalary: number | undefined,
    highSalary: number | undefined,
  ) => {
    let salaryString = '';
    if (lowSalary && highSalary) {
      salaryString = `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(lowSalary)} - ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(highSalary)}`;
    } else if (lowSalary) {
      salaryString = `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(lowSalary)}`;
    } else if (highSalary) {
      salaryString = `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(highSalary)}`;
    }
    return salaryString;
  };

  if (!application) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {application.title} at {application.company.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="mt-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.title}
              </h1>
              <div className="flex items-center space-x-2">
                {application.company.logo && (
                  <img
                    src={application.company.logo}
                    alt={application.company.name}
                    className="h-10 w-10 rounded-md"
                  />
                )}
                <p className="mt-1 text-xl text-gray-600">
                  {application.company.name}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setEditing(!editing)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Application Details */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Application Details
              </h2>

              {editing ? (
                <ApplicationForm
                  form={form}
                  handleSubmit={handleUpdate}
                  companies={companies}
                  isEdit
                  cancelEdit={() => setEditing(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        application.status,
                      )}`}
                    >
                      {application.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied: {format(application.appliedAt, 'MM/dd/yyyy')}
                    </span>
                  </div>

                  {application.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Description
                      </h3>
                      <div className="mt-1 text-sm whitespace-pre-wrap text-gray-900">
                        <TiptapDisplay content={application.description} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {application.jobUrl && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Job URL
                          </h3>
                        </div>
                        <a
                          href={application.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Job Posting
                        </a>
                      </div>
                    )}

                    {(application.lowSalary || application.highSalary) && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <DollarSignIcon className="h-4 w-4 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Salary
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-900">
                          {displaySalary(
                            application.lowSalary || 0,
                            application.highSalary || 0,
                          )}
                        </p>
                      </div>
                    )}

                    {application.location && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Location
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-900">
                          {application.location}
                        </p>
                      </div>
                    )}

                    {application.remote && (
                      <div>
                        <div className="flex items-center space-x-2">
                          <GlobeIcon className="h-4 w-4 text-gray-500" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Remote Policy
                          </h3>
                        </div>
                        <Badge
                          className={getRemotePolicyColor(application.remote)}
                        >
                          {application.remote.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interviews */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Interviews
                </h2>
                <Button asChild>
                  <Link
                    href={`/dashboard/applications/${application.id}/interviews/new`}
                  >
                    Add Interview
                  </Link>
                </Button>
              </div>

              {application.interviews.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  No interviews scheduled yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {application.interviews.map((interview) => (
                    <Link
                      key={interview.id}
                      href={`/dashboard/interviews/${interview.id}`}
                      className="block rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {interview.type.replace('_', ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {interview.format.replace('_', ' ')}
                            {interview.scheduledAt &&
                              ` • ${format(
                                interview.scheduledAt,
                                'MM/dd/yyyy',
                              )}`}
                            {interview.duration &&
                              ` • ${interview.duration} minutes`}
                          </p>
                        </div>
                        {interview.outcome && (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              interview.outcome === 'PASSED'
                                ? 'bg-green-100 text-green-800'
                                : interview.outcome === 'FAILED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {interview.outcome}
                          </span>
                        )}
                      </div>

                      {interview.contacts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Interviewers:</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {interview.contacts.map((contact) => (
                              <span
                                key={contact.id}
                                className="rounded bg-gray-100 px-2 py-1 text-sm"
                              >
                                {contact.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {interview.feedback && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Feedback:</p>
                          <div className="mt-1 text-sm whitespace-pre-wrap text-gray-900">
                            {interview.feedback}
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <NotesSection
              noteForm={noteForm}
              notes={application.notes}
              handleAddNote={handleAddNote}
            />

            {/* Activity Log */}
            <ActivityLog
              events={application.events}
              applicationId={application.id}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Selector */}
            <ResumeSelector
              applicationId={application.id}
              resumes={resumes}
              currentResumeId={currentResumeId}
              onResumeChange={handleResumeChange}
            />

            {/* Company Info */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Company
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Name</h3>
                  <Link
                    href={`/dashboard/companies/${application.companyId}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {application.company.name}
                  </Link>
                </div>

                {application.company.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Website
                    </h3>
                    <a
                      href={application.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {application.company.industry && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Industry
                    </h3>
                    <p className="text-sm text-gray-900">
                      {application.company.industry}
                    </p>
                  </div>
                )}

                {application.company.size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Size</h3>
                    <Badge className={getSizeColor(application.company.size)}>
                      {application.company.size.replace('_', ' ')}
                    </Badge>
                  </div>
                )}

                {application.company.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Location
                    </h3>
                    <p className="text-sm text-gray-900">
                      {application.company.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`/dashboard/applications/${application.id}/interviews/new`}
                  >
                    Schedule Interview
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href={`/dashboard/contacts/new?companyId=${application.company.id}`}
                  >
                    Add Contact
                  </Link>
                </Button>
                {!editing && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setEditing(true)}
                  >
                    Edit Application
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
