'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default function NewCompany() {
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(1).max(255),
    website: z.url(),
    description: z.string().min(1).max(1000),
    industry: z.string().min(1).max(255),
    size: z.enum(CompanySize),
    location: z.string().min(1).max(255),
    logo: z.url().optional(),
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
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
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
        router.push(`/companies/${company.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company');
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website *</FormLabel>
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
                        rows={8}
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
                      <FormLabel>Industry *</FormLabel>
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
                      <FormLabel>Company Size *</FormLabel>
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
                    <FormLabel>Location *</FormLabel>
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
                    <FormLabel>Logo (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='https://...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-4 pt-6'>
                <Button
                  type='button'
                  variant='link'
                  className='text-blue-600 hover:text-blue-800 text-sm p-0 font-medium cursor-pointer'
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  className='cursor-pointer'
                >
                  {form.formState.isSubmitting
                    ? 'Creating...'
                    : 'Create Company'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
