'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import NewCompanyForm from '../../components/new-company-form';
import DuplicateCompanyDialog from './duplicate-company-dialog';
import Link from 'next/link';
import { CompanyFormData, companySchema } from '../../lib/new-company-schema';
import { CompanySize, User } from '@prisma/client';

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'GLOBAL';
  isGlobal: boolean;
}
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NewCompanyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [duplicates, setDuplicates] = useState<Company[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isPublicDuplicate, setIsPublicDuplicate] = useState(false);

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

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
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

  const isAdmin = user?.role === 'ADMIN';

  const handleSubmit = async (data: CompanyFormData) => {
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
        setIsPublicDuplicate(errorData.isPublicDuplicate || false);
        setShowDuplicateDialog(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company');
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
        if (fromUrl === 'applications/new') {
          router.push(`/applications/new?companyId=${company.id}`);
        } else {
          router.push(`/companies/${company.id}`);
        }
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

  const handleCloseDialog = () => {
    setShowDuplicateDialog(false);
    setIsPublicDuplicate(false);
  };

  return (
    <div>
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
        <NewCompanyForm
          form={form}
          isAdmin={isAdmin}
          handleSubmit={handleSubmit}
        />
      </div>

      <DuplicateCompanyDialog
        isOpen={showDuplicateDialog}
        onClose={handleCloseDialog}
        duplicates={duplicates}
        onUseExisting={handleUseExistingCompany}
        onCreateNew={handleCreateNew}
        isPublicDuplicate={isPublicDuplicate}
      />
    </div>
  );
}
