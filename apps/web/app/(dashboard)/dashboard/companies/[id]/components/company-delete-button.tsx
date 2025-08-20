'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CompanyDeleteButtonProps {
  companyId: string;
}

export function CompanyDeleteButton({ companyId }: CompanyDeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this company? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <Button variant='destructive' onClick={handleDelete}>
      Delete
    </Button>
  );
}
