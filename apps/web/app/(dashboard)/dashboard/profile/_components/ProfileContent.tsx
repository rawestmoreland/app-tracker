'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { updateUserPreferences } from '@/lib/actions/user-preferences-actions';
import { type UserPreferences } from '@/lib/types/user';
import { CURRENCIES } from '@/lib/utils/currency';
import { useAuth } from '@clerk/clerk-react';
import { UserButton } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export const prefsSchema = z.object({
  ghostThreshold: z.number().min(5 * 24 * 60 * 60),
  receiveEmailNotifications: z.boolean(),
  dataOptOut: z.boolean(),
  currency: z.string(),
});

export default function ProfileContent({
  userPrefs,
}: {
  userPrefs: UserPreferences;
}) {
  const { isLoaded } = useAuth();

  const prefsForm = useForm({
    defaultValues: {
      ghostThreshold: userPrefs.ghostThreshold,
      receiveEmailNotifications: userPrefs.receiveEmailNotifications,
      dataOptOut: userPrefs.dataOptOut,
      currency: userPrefs.currency ?? 'USD',
    },
  });

  const onSubmit = async (data: z.infer<typeof prefsSchema>) => {
    const result = await updateUserPreferences(data);

    if (result.success) {
      prefsForm.reset({
        ghostThreshold: result.prefs.ghostThreshold,
        receiveEmailNotifications: result.prefs.receiveEmailNotifications,
        dataOptOut: result.prefs.dataOptOut,
        currency: result.prefs.currency,
      });
      toast('User preferences updated', {
        description: 'Your preferences have been updated.',
      });
    } else {
      toast(result.error || 'Failed to update user preferences', {
        description: 'Please try again.',
      });
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserButton />
                <span>Your Profile and Preferences</span>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Manage your profile information and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...prefsForm}>
            <form
              onSubmit={prefsForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={prefsForm.control}
                name="ghostThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghost Threshold</FormLabel>
                    <FormDescription>
                      The number of days after which an application will be
                      considered ghosted.
                    </FormDescription>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        prefsForm.handleSubmit(onSubmit)();
                      }}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a threshold"
                            defaultValue={field.value.toString()}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={(5 * 24 * 60 * 60).toString()}>
                          5 days
                        </SelectItem>
                        <SelectItem value={(10 * 24 * 60 * 60).toString()}>
                          10 days
                        </SelectItem>
                        <SelectItem value={(30 * 24 * 60 * 60).toString()}>
                          30 days
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={prefsForm.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <FormDescription>
                      The currency you want to use for salary fields.
                    </FormDescription>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        prefsForm.handleSubmit(onSubmit)();
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a currency"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem
                            key={currency.currencyCode}
                            value={currency.currencyCode}
                          >
                            {currency.currencyCode} {currency.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={prefsForm.control}
                name="receiveEmailNotifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receive Email Notifications</FormLabel>
                    <FormDescription>
                      Receive email notifications for ghosted applications and
                      other important updates.
                    </FormDescription>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          prefsForm.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={prefsForm.control}
                name="dataOptOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Opt Out</FormLabel>
                    <FormDescription>
                      Don't sell my data to third parties.
                    </FormDescription>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          prefsForm.handleSubmit(onSubmit)();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormMessage />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
