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
import { Company, Contact } from '@prisma/client';
import { Combobox } from '@/components/ui/combobox';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function NewContactForm({
  form,
  handleSubmit,
  companies,
  uniqueContacts,
}: {
  form: UseFormReturn<NewContactSchema>;
  handleSubmit: (data: NewContactSchema) => void;
  companies: Company[];
  uniqueContacts: Contact[];
}) {
  const existingContactId = form.watch('existingContactId');

  useEffect(() => {
    if (existingContactId) {
      // Clear new contact fields and errors when existing contact is selected
      form.setValue('name', '', { shouldValidate: false });
      form.setValue('email', '', { shouldValidate: false });
      form.setValue('phone', '', { shouldValidate: false });
      form.setValue('title', '', { shouldValidate: false });
      form.setValue('linkedin', '', { shouldValidate: false });
      form.setValue('companyId', '', { shouldValidate: false });
      form.clearErrors();
    } else {
      // Clear existing contact selection when user starts filling new contact form
      form.clearErrors();
    }
  }, [existingContactId, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="existingContactId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Existing Contact</FormLabel>
              <FormControl>
                <Combobox
                  options={uniqueContacts.map((contact) => ({
                    value: contact.id,
                    label: `${contact.name} - ${contact.title}${contact.companyId ? ` (${companies.find((c) => c.id === contact.companyId)?.name})` : ''}`,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select an existing contact"
                  searchPlaceholder="Search contacts..."
                  emptyText="No contact found."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or create new contact
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Jane Doe"
                  disabled={!!existingContactId}
                />
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
                  <Input
                    {...field}
                    placeholder="jane@doe.com"
                    disabled={!!existingContactId}
                  />
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
                  <Input
                    {...field}
                    placeholder="+1234567890"
                    disabled={!!existingContactId}
                  />
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
                <Input
                  {...field}
                  placeholder="Senior Recruiter"
                  disabled={!!existingContactId}
                />
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
                  disabled={!!existingContactId}
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
                  disabled={!!existingContactId}
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
          {form.formState.isSubmitting
            ? existingContactId
              ? 'Adding...'
              : 'Creating...'
            : existingContactId
              ? 'Add Contact as Interviewer'
              : 'Create Contact'}
        </Button>
      </form>
    </Form>
  );
}
