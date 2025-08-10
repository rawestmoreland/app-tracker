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
import {
  getRemotePolicyColor,
  getSizeColor,
  getStatusColor,
} from '@/lib/utils';
import {
  addNote,
  deleteApplication,
  deleteResume,
  updateApplication,
} from '../actions/application-actions';
import { NoteFormData, noteSchema } from '../../lib/new-note-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
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

type FullApplication = Application & {
  company: Company;
  interviews: (Interview & {
    contacts: Contact[];
  })[];
  notes: Note[];
  appliedAt: Date;
};

export default function ApplicationContent({
  application,
  companies,
}: {
  application: FullApplication;
  companies: Company[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      router.push('/');
    } else {
      alert(result.error || 'Failed to delete application');
    }
  };

  const handleAddNote = async (data: NoteFormData) => {
    const result = await addNote(application.id, data);

    if (result.success) {
      noteForm.reset();
    } else {
      alert(result.error || 'Failed to add note');
    }
  };

  const handleResumeUploadComplete = () => {
    setUploadError(null);
  };

  const handleResumeUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleResumeDelete = async () => {
    const result = await deleteResume(application.id);

    if (result.success) {
      alert('Resume deleted successfully');
    } else {
      alert(result.error || 'Failed to delete resume');
    }
  };

  const displaySalary = (
    lowSalary: number | undefined,
    highSalary: number | undefined
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
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/'>Dashboard</Link>
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
          <div className='flex justify-between items-start mt-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                {application.title}
              </h1>
              <div className='flex items-center space-x-2'>
                {application.company.logo && (
                  <img
                    src={application.company.logo}
                    alt={application.company.name}
                    className='w-10 h-10 rounded-md'
                  />
                )}
                <p className='text-xl text-gray-600 mt-1'>
                  {application.company.name}
                </p>
              </div>
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={() => setEditing(!editing)}
                className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50'
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Application Details */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
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
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.replace('_', ' ')}
                    </span>
                    <span className='text-sm text-gray-500'>
                      Applied: {format(application.appliedAt, 'MM/dd/yyyy')}
                    </span>
                  </div>

                  {application.description && (
                    <div>
                      <h3 className='text-sm font-medium text-gray-700'>
                        Description
                      </h3>
                      <div className='mt-1 text-sm text-gray-900 whitespace-pre-wrap'>
                        {application.description}
                      </div>
                    </div>
                  )}

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {application.jobUrl && (
                      <div>
                        <div className='flex items-center space-x-2'>
                          <LinkIcon className='w-4 h-4 text-gray-500' />
                          <h3 className='text-sm font-medium text-gray-700'>
                            Job URL
                          </h3>
                        </div>
                        <a
                          href={application.jobUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='mt-1 text-sm text-blue-600 hover:text-blue-800'
                        >
                          View Job Posting
                        </a>
                      </div>
                    )}

                    {(application.lowSalary || application.highSalary) && (
                      <div>
                        <div className='flex items-center space-x-2'>
                          <DollarSignIcon className='w-4 h-4 text-gray-500' />
                          <h3 className='text-sm font-medium text-gray-700'>
                            Salary
                          </h3>
                        </div>
                        <p className='mt-1 text-sm text-gray-900'>
                          {displaySalary(
                            application.lowSalary || 0,
                            application.highSalary || 0
                          )}
                        </p>
                      </div>
                    )}

                    {application.location && (
                      <div>
                        <div className='flex items-center space-x-2'>
                          <MapPinIcon className='w-4 h-4 text-gray-500' />
                          <h3 className='text-sm font-medium text-gray-700'>
                            Location
                          </h3>
                        </div>
                        <p className='mt-1 text-sm text-gray-900'>
                          {application.location}
                        </p>
                      </div>
                    )}

                    {application.remote && (
                      <div>
                        <div className='flex items-center space-x-2'>
                          <GlobeIcon className='w-4 h-4 text-gray-500' />
                          <h3 className='text-sm font-medium text-gray-700'>
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
            <div className='bg-white rounded-lg shadow p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-gray-900'>
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
                <p className='text-gray-500 text-center py-4'>
                  No interviews scheduled yet.
                </p>
              ) : (
                <div className='space-y-4'>
                  {application.interviews.map((interview) => (
                    <Link
                      key={interview.id}
                      href={`/dashboard/interviews/${interview.id}`}
                      className='block border border-gray-200 rounded-lg p-4'
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-medium text-gray-900'>
                            {interview.type.replace('_', ' ')}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {interview.format.replace('_', ' ')}
                            {interview.scheduledAt &&
                              ` • ${format(
                                interview.scheduledAt,
                                'MM/dd/yyyy'
                              )}`}
                            {interview.duration &&
                              ` • ${interview.duration} minutes`}
                          </p>
                        </div>
                        {interview.outcome && (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                        <div className='mt-2'>
                          <p className='text-sm text-gray-600'>Interviewers:</p>
                          <div className='flex flex-wrap gap-2 mt-1'>
                            {interview.contacts.map((contact) => (
                              <span
                                key={contact.id}
                                className='text-sm bg-gray-100 px-2 py-1 rounded'
                              >
                                {contact.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {interview.feedback && (
                        <div className='mt-2'>
                          <p className='text-sm text-gray-600'>Feedback:</p>
                          <div className='text-sm text-gray-900 mt-1 whitespace-pre-wrap'>
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
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Notes
              </h2>

              <Form {...noteForm}>
                <form
                  onSubmit={noteForm.handleSubmit(handleAddNote)}
                  className='mb-4'
                >
                  <div className='space-y-3'>
                    <FormField
                      control={noteForm.control}
                      name='content'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Add Note</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='flex justify-between items-end'>
                      <FormField
                        control={noteForm.control}
                        name='type'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select a note type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={NoteType.GENERAL}>
                                  General
                                </SelectItem>
                                <SelectItem value={NoteType.INTERVIEW_PREP}>
                                  Interview Prep
                                </SelectItem>
                                <SelectItem value={NoteType.FEEDBACK}>
                                  Feedback
                                </SelectItem>
                                <SelectItem value={NoteType.FOLLOW_UP}>
                                  Follow Up
                                </SelectItem>
                                <SelectItem value={NoteType.SALARY_NEGOTIATION}>
                                  Salary Negotiation
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type='submit'>Add Note</Button>
                    </div>
                  </div>
                </form>
              </Form>

              {application.notes.length === 0 ? (
                <p className='text-gray-500 text-center py-4'>No notes yet.</p>
              ) : (
                <div className='space-y-4'>
                  {application.notes.map((note) => (
                    <div
                      key={note.id}
                      className='border-l-4 border-blue-500 pl-4'
                    >
                      <div className='flex justify-between items-start'>
                        <div className='text-sm text-gray-900 whitespace-pre-wrap flex-1'>
                          {note.content}
                        </div>
                        <span className='text-xs text-gray-500 ml-2 flex-shrink-0'>
                          {format(note.createdAt, 'MM/dd/yyyy')}
                        </span>
                      </div>
                      <span className='inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        {note.type.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Resume Upload */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Resume
              </h2>
              <FileUpload
                onUploadComplete={handleResumeUploadComplete}
                onUploadError={handleResumeUploadError}
                onDelete={handleResumeDelete}
                existingFile={
                  application.resume && application.resumeName
                    ? {
                        key: application.resume,
                        filename: application.resumeName,
                      }
                    : undefined
                }
                accept='.pdf,.doc,.docx'
                maxSize={10 * 1024 * 1024} // 10MB
                applicationId={application.id}
                stackButtons
                className='flex-col gap-2'
              />
              {uploadError && (
                <p className='text-red-600 text-sm mt-2'>{uploadError}</p>
              )}
            </div>

            {/* Company Info */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Company
              </h2>
              <div className='space-y-3'>
                <div>
                  <h3 className='text-sm font-medium text-gray-700'>Name</h3>
                  <p className='text-sm text-gray-900'>
                    {application.company.name}
                  </p>
                </div>

                {application.company.website && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-700'>
                      Website
                    </h3>
                    <a
                      href={application.company.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-600 hover:text-blue-800'
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {application.company.industry && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-700'>
                      Industry
                    </h3>
                    <p className='text-sm text-gray-900'>
                      {application.company.industry}
                    </p>
                  </div>
                )}

                {application.company.size && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-700'>Size</h3>
                    <Badge className={getSizeColor(application.company.size)}>
                      {application.company.size.replace('_', ' ')}
                    </Badge>
                  </div>
                )}

                {application.company.location && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-700'>
                      Location
                    </h3>
                    <p className='text-sm text-gray-900'>
                      {application.company.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Quick Actions
              </h2>
              <div className='space-y-3'>
                <Button variant='outline' className='w-full' asChild>
                  <Link
                    href={`/dashboard/applications/${application.id}/interviews/new`}
                  >
                    Schedule Interview
                  </Link>
                </Button>
                <Button variant='outline' className='w-full' asChild>
                  <Link href={`/contacts/new?applicationId=${application.id}`}>
                    Add Contact
                  </Link>
                </Button>
                {!editing && (
                  <Button
                    variant='outline'
                    className='w-full'
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
