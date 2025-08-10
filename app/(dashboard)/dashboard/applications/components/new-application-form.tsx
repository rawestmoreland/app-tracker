import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Combobox } from '@/components/ui/combobox';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationStatus, Company, RemoteType } from '@prisma/client';
import { ApplicationFormData } from '../lib/new-application-schema';
import { startCase } from 'lodash';

export default function ApplicationForm({
  form,
  handleSubmit,
  companies,
  isEdit = false,
  cancelEdit,
}: {
  form: UseFormReturn<ApplicationFormData>;
  handleSubmit: (data: ApplicationFormData) => Promise<void>;
  companies: Company[];
  isEdit?: boolean;
  cancelEdit?: () => void;
}): React.ReactNode {
  const router = useRouter();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title *</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  {...field}
                  placeholder='e.g., Senior Software Engineer'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='companyId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company *</FormLabel>
              <FormControl>
                <Combobox
                  options={companies.map((company) => ({
                    value: company.id,
                    label: company.name,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder='Select a company'
                  searchPlaceholder='Search companies...'
                  emptyText='No company found.'
                  className='w-full'
                />
              </FormControl>
              <FormDescription>
                Don&apos;t see your company?{' '}
                <Link
                  href='/dashboard/companies/new?from=applications/new'
                  className='text-blue-600 hover:text-blue-800'
                >
                  Add it here
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  {...field}
                  placeholder='Enter job description with line breaks as needed...'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='jobUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input type='url' {...field} placeholder='https://...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='currency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='USD'>USD ($)</SelectItem>
                    <SelectItem value='EUR'>EUR (€)</SelectItem>
                    <SelectItem value='GBP'>GBP (£)</SelectItem>
                    <SelectItem value='CAD'>CAD (C$)</SelectItem>
                    <SelectItem value='AUD'>AUD (A$)</SelectItem>
                    <SelectItem value='JPY'>JPY (¥)</SelectItem>
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
            name='lowSalary'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Salary</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder='e.g., 80000'
                  />
                </FormControl>
                <FormDescription>
                  Annual salary in dollars (e.g., 80000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='highSalary'
            render={({ field }) => (
              <FormItem>
                <FormLabel>High Salary</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder='e.g., 120000'
                  />
                </FormControl>
                <FormDescription>
                  Annual salary in dollars (e.g., 120000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    {...field}
                    placeholder='e.g., San Francisco, CA'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='remote'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remote Policy</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select remote policy' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(RemoteType).map((remote) => (
                        <SelectItem key={remote} value={remote}>
                          {startCase(remote.replace('_', ' ').toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ApplicationStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {startCase(status.replace('_', ' ').toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='appliedAt'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Applied Date *</FormLabel>
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
                            format(field.value ?? new Date(), 'PPP')
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
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout='dropdown'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className='flex justify-end space-x-4 pt-6'>
          <Button
            onClick={() => (isEdit ? cancelEdit?.() : router.back())}
            variant='link'
            className='text-blue-600 hover:text-blue-800 text-sm p-0 font-medium cursor-pointer'
          >
            Cancel
          </Button>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Creating...'
              : isEdit
              ? 'Update Application'
              : 'Create Application'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
