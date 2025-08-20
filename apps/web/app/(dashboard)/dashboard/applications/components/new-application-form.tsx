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
import { UseFormReturn } from 'react-hook-form';
import { ApplicationStatus, Company, RemoteType } from '@prisma/client';
import { ApplicationFormData } from '../lib/new-application-schema';
import { startCase } from 'lodash';
import { TiptapEditor } from '@/components/tiptap-editor';
import { useState, useEffect, useMemo } from 'react';

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
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set initial state based on whether we have a companyId or not
  useEffect(() => {
    const currentCompanyId = form.getValues('companyId');
    const currentCompanyName = form.getValues('companyName');

    if (!currentCompanyId && currentCompanyName) {
      setIsNewCompany(true);
    } else if (currentCompanyId) {
      setIsNewCompany(false);
    }
  }, [form]);

  const handleCompanyTypeChange = (isNew: boolean) => {
    setIsNewCompany(isNew);
    if (isNew) {
      // Clear existing company selection
      form.setValue('companyId', '');
      // Set the company name from the search query
      form.setValue('companyName', searchQuery);
    } else {
      // Clear new company fields
      form.setValue('companyName', '');
      form.setValue('companyUrl', '');
    }
  };

  const handleCompanySearch = (query: string) => {
    setSearchQuery(query);
    // Don't automatically switch to new company mode - let the user decide
  };

  // Create filtered options with "Create new" option when no matches
  const comboboxOptions = useMemo(() => {
    const filteredCompanies = companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const options = filteredCompanies.map((company) => ({
      value: company.id,
      label: company.name,
    }));

    // Add "Create new" option if no matches and user has typed something
    if (searchQuery && filteredCompanies.length === 0) {
      options.push({
        value: 'new-company',
        label: `Create "${searchQuery}"`,
      });
    }

    return options;
  }, [companies, searchQuery]);

  const handleCompanySelect = (value: string) => {
    if (value === 'new-company') {
      setIsNewCompany(true);
      form.setValue('companyId', '');
      form.setValue('companyName', searchQuery);
    } else {
      setIsNewCompany(false);
      form.setValue('companyId', value);
      form.setValue('companyName', '');
      form.setValue('companyUrl', '');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  placeholder="e.g., Senior Software Engineer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Selection Section */}
        <div className="space-y-4">
          {!isNewCompany ? (
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <FormControl>
                    <Combobox
                      options={comboboxOptions}
                      value={field.value}
                      onValueChange={handleCompanySelect}
                      onSearchChange={handleCompanySearch}
                      placeholder="Search for a company..."
                      searchPlaceholder="Search companies..."
                      emptyText="No company found."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>New Company</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompanyTypeChange(false)}
                >
                  Select Existing
                </Button>
              </div>

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="e.g., Acme Corporation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        {...field}
                        placeholder="https://www.acme.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Company&apos;s website URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <TiptapEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter job description with line breaks as needed..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="jobUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input type="url" {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="lowSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="e.g., 80000"
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
            name="highSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>High Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="e.g., 120000"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="e.g., San Francisco, CA"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remote Policy</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select remote policy" />
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
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
            name="appliedAt"
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
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value ?? new Date(), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="referredBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referred By</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="e.g., John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            onClick={() => (isEdit ? cancelEdit?.() : router.back())}
            variant="link"
            className="cursor-pointer p-0 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
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
