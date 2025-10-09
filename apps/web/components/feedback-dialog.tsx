"use client";

import { CircleQuestionMarkIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { createFeatureRequest } from "@/app/_actions/feature-requests";
import { toast } from "sonner";

export const formSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(1000, {
      message: "Description must be less than 1000 characters",
    }),
});

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await createFeatureRequest(data);

    if (result.error) {
      toast("There was an error submitting your feature request.");
    } else {
      toast("Feature request submitted", {
        description: "We'll review it and get back to you soon.",
      });
      setIsOpen(false);
      form.reset();
    }
  };

  const description = form.watch("description");

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <CircleQuestionMarkIcon className="h-5 w-5" />
        Feedback
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>We&apos;d love to hear from you!</DialogTitle>
            <DialogDescription>
              We&apos;re always looking for ways to improve Jobble. Let us
              know what you&apos;d like to see added to the platform.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-xs text-gray-500">
                      {description.length} / 1000 characters
                    </FormDescription>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || description.length > 1000
                  }
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
