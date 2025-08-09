'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Company {
  id: string;
  name: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyEditFormProps {
  company: Company;
}

export function CompanyEditForm({ company }: CompanyEditFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company.name,
    website: company.website || '',
    description: company.description || '',
    industry: company.industry || '',
    size: company.size || 'SMALL',
    location: company.location || '',
    logo: company.logo || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditing(false);
        router.refresh(); // Refresh the page to show updated data
      } else {
        console.error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  return (
    <>
      <Button
        variant={editing ? 'outline' : 'default'}
        onClick={() => setEditing(!editing)}
      >
        {editing ? 'Cancel' : 'Edit'}
      </Button>

      {/* Edit Form */}
      {editing && (
        <form
          onSubmit={handleUpdate}
          className='bg-white p-6 rounded-lg shadow mb-8'
        >
          <h2 className='text-xl font-semibold mb-4'>Edit Company</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Company Name *
              </label>
              <Input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Website
              </label>
              <Input
                type='url'
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Industry
              </label>
              <Input
                type='text'
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Company Size
              </label>
              <select
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='STARTUP'>Startup</option>
                <option value='SMALL'>Small (1-50)</option>
                <option value='MEDIUM'>Medium (51-200)</option>
                <option value='LARGE'>Large (201-1000)</option>
                <option value='ENTERPRISE'>Enterprise (1000+)</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location
              </label>
              <Input
                type='text'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Logo URL
              </label>
              <Input
                type='url'
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
              />
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
          <div className='flex gap-2 mt-4'>
            <Button type='submit'>Save Changes</Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
