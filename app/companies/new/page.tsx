'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CompanySize } from '@prisma/client';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { DuplicateCompanyDialog } from './components/duplicate-company-dialog';

interface User {
  id: string;
  role: 'USER' | 'ADMIN';
}

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'GLOBAL';
  isGlobal: boolean;
}

function NewCompanyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicates, setDuplicates] = useState<Company[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromUrl = searchParams.get('from');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const schema = z.object({
    name: z.string().min(1, 'Company name is required').max(255),
    website: z.url('Please enter a valid URL').optional().or(z.literal('')),
    description: z.string().max(2000).optional(),
    industry: z.string().max(255).optional(),
    size: z
      .enum(Object.values(CompanySize) as [string, ...string[]])
      .optional(),
    location: z.string().max(255).optional(),
    logo: z.url('Please enter a valid URL').optional().or(z.literal('')),
    visibility: z.enum(['PRIVATE', 'PUBLIC']),
    isGlobal: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      website: '',
      description: '',
      industry: '',
      size: CompanySize.MEDIUM,
      location: '',
      logo: '',
      visibility: 'PRIVATE',
      isGlobal: false,
    },
  });

  const watchName = form.watch('name');
  const isAdmin = user?.role === 'ADMIN';

  // Check for duplicates when name changes
  useEffect(() => {
    const checkDuplicates = async () => {
      if (watchName.length < 3) {
        setDuplicates([]);
        return;
      }

      setIsCheckingDuplicates(true);
      try {
        const response = await fetch('/api/companies/check-duplicate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: watchName }),
        });

        if (response.ok) {
          const data = await response.json();
          setDuplicates(data.duplicates || []);
        }
      } catch (error) {
        console.error('Error checking duplicates:', error);
      } finally {
        setIsCheckingDuplicates(false);
      }
    };

    const timeoutId = setTimeout(checkDuplicates, 500);
    return () => clearTimeout(timeoutId);
  }, [watchName]);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const company = await response.json();
        if (fromUrl === 'applications/new') {
          router.push(`/applications/new?companyId=${company.id}`);
        } else {
          router.push(`/companies/${company.id}`);
        }
      } else if (response.status === 409) {
        // Duplicate found - show dialog
        const errorData = await response.json();
        setDuplicates([errorData.existingCompany]);
        setShowDuplicateDialog(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseExistingCompany = async (companyId: string) => {
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useExistingCompanyId: companyId }),
      });

      if (response.ok) {
        const company = await response.json();
        router.push(`/companies/${company.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to use existing company');
      }
    } catch (error) {
      console.error('Error using existing company:', error);
      alert('Failed to use existing company');
    }
    setShowDuplicateDialog(false);
  };

  const handleCreateNew = () => {
    setShowDuplicateDialog(false);
    // Continue with form submission
    form.handleSubmit(handleSubmit)();
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE':
        return 'Only visible to you';
      case 'PUBLIC':
        return 'Visible to all users';
      case 'GLOBAL':
        return 'Visible to all users and marked as global';
      default:
        return '';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <Breadcrumb className='mb-4'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/'>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/companies'>Companies</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {fromUrl === 'applications/new' && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href='/applications/new'>New Application</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>Add New Company</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className='text-3xl font-bold text-gray-900'>Add New Company</h1>
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    {isCheckingDuplicates && (
                      <FormDescription className='text-blue-600'>
                        Checking for similar companies...
                      </FormDescription>
                    )}
                    {duplicates.length > 0 && !isCheckingDuplicates && (
                      <FormDescription className='text-orange-600'>
                        Found {duplicates.length} similar compan
                        {duplicates.length > 1 ? 'ies' : 'y'}
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='https://...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder='Brief description of the company...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='industry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., Technology' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='size'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a size' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={CompanySize.STARTUP}>
                            Startup
                          </SelectItem>
                          <SelectItem value={CompanySize.SMALL}>
                            Small (1-50)
                          </SelectItem>
                          <SelectItem value={CompanySize.MEDIUM}>
                            Medium (51-500)
                          </SelectItem>
                          <SelectItem value={CompanySize.LARGE}>
                            Large (501-5000)
                          </SelectItem>
                          <SelectItem value={CompanySize.ENTERPRISE}>
                            Enterprise (5000+)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='e.g., San Francisco, CA' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='https://...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visibility Settings */}
              <div className='border-t pt-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Visibility Settings
                </h3>

                <FormField
                  control={form.control}
                  name='visibility'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='PRIVATE'>
                            <div className='flex items-center gap-2'>
                              <Badge variant='outline'>Private</Badge>
                              <span>Only visible to you</span>
                            </div>
                          </SelectItem>
                          {isAdmin && (
                            <SelectItem value='PUBLIC'>
                              <div className='flex items-center gap-2'>
                                <Badge variant='secondary'>Public</Badge>
                                <span>
                                  Visible to all users (help us grow our
                                  database)
                                </span>
                              </div>
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {getVisibilityDescription(field.value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Global toggle for admins */}
                {isAdmin && (
                  <FormField
                    control={form.control}
                    name='isGlobal'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className='space-y-1 leading-none'>
                          <FormLabel className='text-sm font-medium'>
                            Mark as Global Company
                          </FormLabel>
                          <FormDescription className='text-sm text-gray-600'>
                            Global companies are visible to all users and cannot
                            be duplicated. This should only be used for
                            well-known, established companies.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className='flex justify-end space-x-4 pt-6'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting || isCheckingDuplicates}
                >
                  {isSubmitting ? 'Creating...' : 'Create Company'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <DuplicateCompanyDialog
        isOpen={showDuplicateDialog}
        onClose={() => setShowDuplicateDialog(false)}
        duplicates={duplicates}
        onUseExisting={handleUseExistingCompany}
        onCreateNew={handleCreateNew}
      />
    </div>
  );
}

function NewCompanySkeleton() {
  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <div className='h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse'></div>
          <div className='h-8 bg-gray-200 rounded w-1/2 animate-pulse'></div>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='space-y-4'>
            <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
            <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-1/3 animate-pulse'></div>
            <div className='h-10 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
            <div className='h-24 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewCompany() {
  return (
    <Suspense fallback={<NewCompanySkeleton />}>
      <NewCompanyContent />
    </Suspense>
  );
}
