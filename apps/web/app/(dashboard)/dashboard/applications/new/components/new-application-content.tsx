'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationStatus, Company, RemoteType } from '@prisma/client';
import ApplicationForm from '../../components/new-application-form';
import { ApplicationFormData, schema } from '../../lib/new-application-schema';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default function NewApplicationContent({
  companies,
  defaultCurrency,
}: {
  companies: Company[];
  defaultCurrency: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const companyId = searchParams.get('companyId');

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      jobUrl: '',
      lowSalary: undefined,
      highSalary: undefined,
      currency: defaultCurrency ?? 'USD',
      location: '',
      remote: RemoteType.ON_SITE,
      status: ApplicationStatus.APPLIED,
      appliedAt: new Date(),
      companyId: companyId || '',
      companyName: '',
      companyUrl: '',
    },
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    try {
      // Store salary values as dollars (no conversion needed)
      const submitData = {
        ...data,
        lowSalary: data.lowSalary || null,
        highSalary: data.highSalary || null,
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const application = await response.json();
        router.push(`/dashboard/applications/${application.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create application');
      }
    } catch (error) {
      console.error('Error creating application:', error);
      alert('Failed to create application');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New Application</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Application
          </h1>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <ApplicationForm
            form={form}
            handleSubmit={handleSubmit}
            companies={companies}
            defaultCurrency={defaultCurrency}
          />
        </div>
      </div>
    </div>
  );
}
