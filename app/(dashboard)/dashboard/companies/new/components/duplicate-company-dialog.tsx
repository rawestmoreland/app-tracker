'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'GLOBAL';
  isGlobal: boolean;
}

interface DuplicateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  duplicates: Company[];
  onUseExisting: (companyId: string) => void;
  onCreateNew: () => void;
  isPublicDuplicate?: boolean;
}

export default function DuplicateCompanyDialog({
  isOpen,
  onClose,
  duplicates,
  onUseExisting,
  onCreateNew,
  isPublicDuplicate = false,
}: DuplicateCompanyDialogProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const handleUseExisting = () => {
    if (selectedCompanyId) {
      onUseExisting(selectedCompanyId);
    }
  };

  const getVisibilityBadge = (visibility: string, isGlobal: boolean) => {
    if (isGlobal) {
      return (
        <Badge variant='default' className='bg-blue-100 text-blue-800'>
          Global
        </Badge>
      );
    }
    switch (visibility) {
      case 'PUBLIC':
        return (
          <Badge variant='secondary' className='bg-green-100 text-green-800'>
            Public
          </Badge>
        );
      case 'PRIVATE':
        return (
          <Badge variant='outline' className='bg-gray-100 text-gray-800'>
            Private
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isPublicDuplicate
              ? 'Company Already Exists'
              : 'Similar Companies Found'}
          </DialogTitle>
          <DialogDescription>
            {isPublicDuplicate
              ? 'A company with this name already exists in the public database. You can use the existing company or create a private company instead.'
              : 'We found some companies with similar names. You can either use one of the existing companies or create a new one.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {duplicates.map((company) => (
            <div
              key={company.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCompanyId === company.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCompanyId(company.id)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h4 className='font-medium text-gray-900'>
                      {company.name}
                    </h4>
                    {getVisibilityBadge(company.visibility, company.isGlobal)}
                  </div>
                  <div className='text-sm text-gray-600 space-y-1'>
                    {company.website && <p>Website: {company.website}</p>}
                    {company.industry && <p>Industry: {company.industry}</p>}
                    {company.location && <p>Location: {company.location}</p>}
                  </div>
                </div>
                <div className='ml-4'>
                  <input
                    type='radio'
                    name='selectedCompany'
                    value={company.id}
                    checked={selectedCompanyId === company.id}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className='h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className='flex flex-col sm:flex-row gap-2'>
          {!isPublicDuplicate && (
            <Button
              variant='outline'
              onClick={onCreateNew}
              className='w-full sm:w-auto'
            >
              Create New Company
            </Button>
          )}
          <Button
            onClick={handleUseExisting}
            disabled={!selectedCompanyId}
            className='w-full sm:w-auto'
          >
            Use Selected Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
