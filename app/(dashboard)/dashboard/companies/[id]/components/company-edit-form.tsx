'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/tiptap-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CompanySize } from '@prisma/client';
import { Company } from '../page';

export function CompanyEditForm({ company }: { company: Company }) {
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
          className="mb-8 rounded-lg bg-white p-6 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">Edit Company</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Website
              </label>
              <Input
                type="url"
                value={formData.website || ''}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Industry
              </label>
              <Input
                type="text"
                value={formData.industry || ''}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <Select
                value={formData.size || ''}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    size: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STARTUP">Startup</SelectItem>
                  <SelectItem value="SMALL">Small (1-50)</SelectItem>
                  <SelectItem value="MEDIUM">Medium (51-200)</SelectItem>
                  <SelectItem value="LARGE">Large (201-1000)</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                type="text"
                value={formData.location || ''}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <Input
                type="url"
                value={formData.logo || ''}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <TiptapEditor
                value={formData.description || ''}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
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
