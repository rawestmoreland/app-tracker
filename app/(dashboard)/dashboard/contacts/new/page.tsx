'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
}

function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    linkedin: '',
    notes: '',
    companyId: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (applicationId) {
          router.push(`/dashboard/applications/${applicationId}`);
        } else {
          router.push('/contacts');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create contact');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Link
            href={
              applicationId
                ? `/dashboard/applications/${applicationId}`
                : '/dashboard/contacts'
            }
            className='text-blue-600 hover:text-blue-800 text-sm font-medium'
          >
            ← Back to {applicationId ? 'Application' : 'Contacts'}
          </Link>
          <h1 className='text-3xl font-bold text-gray-900 mt-2'>
            Add New Contact
          </h1>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name *
              </label>
              <input
                type='text'
                id='name'
                name='name'
                required
                value={formData.name}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='e.g., John Smith'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='john@company.com'
                />
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  placeholder='+1 (555) 123-4567'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700'
              >
                Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='e.g., Senior Recruiter'
              />
            </div>

            <div>
              <label
                htmlFor='linkedin'
                className='block text-sm font-medium text-gray-700'
              >
                LinkedIn URL
              </label>
              <input
                type='url'
                id='linkedin'
                name='linkedin'
                value={formData.linkedin}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='https://linkedin.com/in/johnsmith'
              />
            </div>

            <div>
              <label
                htmlFor='companyId'
                className='block text-sm font-medium text-gray-700'
              >
                Company
              </label>
              <select
                id='companyId'
                name='companyId'
                value={formData.companyId}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <p className='mt-1 text-sm text-gray-500'>
                Don&apos;t see the company?{' '}
                <Link
                  href='/companies/new'
                  className='text-blue-600 hover:text-blue-800'
                >
                  Add it here
                </Link>
              </p>
            </div>

            <div>
              <label
                htmlFor='notes'
                className='block text-sm font-medium text-gray-700'
              >
                Notes
              </label>
              <textarea
                id='notes'
                name='notes'
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className='mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                placeholder='Additional notes about this contact...'
              />
            </div>

            <div className='flex justify-end space-x-4 pt-6'>
              <Link
                href={
                  applicationId
                    ? `/dashboard/applications/${applicationId}`
                    : '/dashboard/contacts'
                }
                className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Cancel
              </Link>
              <button
                type='submit'
                disabled={loading}
                className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
              >
                {loading ? 'Creating...' : 'Create Contact'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded mb-4'></div>
            <div className='space-y-4'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewContact() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContactForm />
    </Suspense>
  );
}
