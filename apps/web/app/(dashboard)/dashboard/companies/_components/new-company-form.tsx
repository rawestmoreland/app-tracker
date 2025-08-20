'use client';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Company, CompanySize } from '@prisma/client';
import { CompanyFormData } from '../lib/new-company-schema';
import { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import TiptapEditor from '@/components/tiptap-editor';

export default function NewCompanyForm({
  form,
  isAdmin,
  handleSubmit,
}: {
  form: UseFormReturn<CompanyFormData>;
  isAdmin: boolean;
  handleSubmit: (data: CompanyFormData) => void;
}) {
  const router = useRouter();
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicates, setDuplicates] = useState<Company[]>([]);
  const [hasPublicDuplicates, setHasPublicDuplicates] = useState(false);
  const [hasPrivateDuplicates, setHasPrivateDuplicates] = useState(false);

  const watchName = form.watch('name');
  const watchVisibility = form.watch('visibility');

  useEffect(() => {
    const checkDuplicates = async () => {
      if (watchName.length < 3) {
        setDuplicates([]);
        setHasPublicDuplicates(false);
        setHasPrivateDuplicates(false);
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
          setHasPublicDuplicates(data.hasPublicDuplicates || false);
          setHasPrivateDuplicates(data.hasPrivateDuplicates || false);
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

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                {isCheckingDuplicates && (
                  <FormDescription className="text-blue-600">
                    Checking for similar companies...
                  </FormDescription>
                )}
                {duplicates.length > 0 && !isCheckingDuplicates && (
                  <div className="space-y-2">
                    {hasPublicDuplicates && (
                      <FormDescription className="text-red-600">
                        ⚠️ Found{' '}
                        {
                          duplicates.filter(
                            (c) =>
                              c.visibility === 'PUBLIC' ||
                              c.visibility === 'GLOBAL',
                          ).length
                        }{' '}
                        public compan
                        {duplicates.filter(
                          (c) =>
                            c.visibility === 'PUBLIC' ||
                            c.visibility === 'GLOBAL',
                        ).length > 1
                          ? 'ies'
                          : 'y'}{' '}
                        with the same name. You cannot create a public company
                        with this name.
                      </FormDescription>
                    )}
                    {hasPrivateDuplicates && (
                      <FormDescription className="text-orange-600">
                        ℹ️ Found{' '}
                        {
                          duplicates.filter((c) => c.visibility === 'PRIVATE')
                            .length
                        }{' '}
                        private compan
                        {duplicates.filter((c) => c.visibility === 'PRIVATE')
                          .length > 1
                          ? 'ies'
                          : 'y'}{' '}
                        with the same name. You can still create a private
                        company.
                      </FormDescription>
                    )}
                    {watchVisibility === 'PUBLIC' && hasPublicDuplicates && (
                      <FormDescription className="font-medium text-red-600">
                        Please select &quot;Private&quot; visibility or use an
                        existing company.
                      </FormDescription>
                    )}
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Brief description of the company..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Technology" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a size" />
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., San Francisco, CA" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://..." />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  We recommend using a logo from LinkedIn. Just copy the
                  company&apos;s image URL from the company&apos;s profile page.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Visibility Settings */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Visibility Settings
            </h3>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Duplicate Policy:</strong> Public companies cannot be
                duplicated. If a company with the same name already exists
                publicly, you must use the existing company or create a private
                company instead.
              </p>
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PRIVATE">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Private</Badge>
                          <span>Only visible to you (duplicates allowed)</span>
                        </div>
                      </SelectItem>
                      {isAdmin && (
                        <SelectItem value="PUBLIC">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Public</Badge>
                            <span>
                              Visible to all users (no duplicates allowed)
                            </span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === 'PRIVATE'
                      ? 'Private companies are only visible to you and can be duplicated if needed.'
                      : 'Public companies are visible to all users and help grow our database. Duplicates are not allowed.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Global toggle for admins */}
            {isAdmin && (
              <FormField
                control={form.control}
                name="isGlobal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        Mark as Global Company
                      </FormLabel>
                      <FormDescription className="text-sm text-gray-600">
                        Global companies are visible to all users and cannot be
                        duplicated. This should only be used for well-known,
                        established companies.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                isCheckingDuplicates ||
                (watchVisibility === 'PUBLIC' && hasPublicDuplicates)
              }
            >
              {form.formState.isSubmitting
                ? 'Creating...'
                : watchVisibility === 'PUBLIC' && hasPublicDuplicates
                  ? 'Cannot Create Public Company'
                  : 'Create Company'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
