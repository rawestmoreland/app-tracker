"use client";

import { NewContactForm } from "@/app/_components/dashboard/contacts/new-contact-form";
import {
  newContactSchema,
  NewContactSchema,
} from "@/app/_components/dashboard/contacts/new-contact-schema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addContact } from "../_actions/add-contact";

export default function NewContactContent({
  companies,
}: {
  companies: Company[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const companyId = searchParams.get("companyId");

  const form = useForm<NewContactSchema>({
    resolver: zodResolver(newContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      linkedin: "",
      notes: "",
      companyId: companyId || "",
    },
  });

  const handleSubmit = async (data: NewContactSchema) => {
    const { error, message, contact } = await addContact(data);

    if (error) {
      toast(message, {
        description: "Please try again.",
      });
    } else {
      toast(message);
      router.push(`/dashboard/companies/${contact?.companyId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/dashboard/companies/${companyId}`}>
                    {
                      companies.find((company) => company.id === companyId)
                        ?.name
                    }
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>New Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-900">Add New Contact</h1>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <NewContactForm
            form={form}
            handleSubmit={handleSubmit}
            companies={companies}
          />
        </div>
      </div>
    </div>
  );
}
