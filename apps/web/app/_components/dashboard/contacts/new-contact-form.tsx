import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { NewContactSchema } from './new-contact-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Company } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewContactForm({
  form,
  handleSubmit,
  companies,
}: {
  form: UseFormReturn<NewContactSchema>;
  handleSubmit: (data: NewContactSchema) => void;
  companies: Company[];
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jane Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="jane@doe.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Senior Recruiter" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://linkedin.com/in/jane-doe"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Combobox
                  options={companies.map((company) => ({
                    value: company.id,
                    label: company.name,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a company"
                  searchPlaceholder="Search companies..."
                  emptyText="No company found."
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="hidden"
                  {...field}
                  placeholder="Select an interview"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="flex items-center justify-center"
        >
          <Loader2Icon
            className={cn('animate-spin', {
              hidden: !form.formState.isSubmitting,
            })}
          />
          {form.formState.isSubmitting ? 'Creating...' : 'Create Contact'}
        </Button>
      </form>
    </Form>
  );
}
