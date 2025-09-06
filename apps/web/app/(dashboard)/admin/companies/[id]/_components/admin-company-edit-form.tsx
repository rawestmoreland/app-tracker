'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TiptapEditor, { TiptapEditorRef } from '@/components/tiptap-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminCompany } from '../page';
import { Save, X, Shield, Globe } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Image from 'next/image';

export function AdminCompanyEditForm({ company }: { company: AdminCompany }) {
  const router = useRouter();
  const tiptapRef = useRef<TiptapEditorRef>(null);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminCompany>>({
    name: company.name,
    website: company.website || '',
    description: company.description || '',
    plainTextDescription: company.plainTextDescription || '',
    industry: company.industry || '',
    size: company.size || 'SMALL',
    location: company.location || '',
    logo: company.logo || '',
    isGlobal: company.isGlobal || false,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        setEditing(false);
        router.refresh();
      } else {
        console.error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/companies">Companies</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={company.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">
              🏢
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{company.name}</h1>
              {company.isGlobal && (
                <span
                  className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"
                  title="Global Company"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  Global
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              {company.industry || 'No industry specified'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {company.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          )}
          <Button
            variant={editing ? 'outline' : 'default'}
            onClick={() => setEditing(!editing)}
          >
            {editing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              'Edit Company'
            )}
          </Button>
        </div>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold">{company.applicationCount}</div>
          <div className="text-sm text-muted-foreground">Applications</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold">{company.size || '—'}</div>
          <div className="text-sm text-muted-foreground">Company Size</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold">{company.location || '—'}</div>
          <div className="text-sm text-muted-foreground">Location</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold">
            {new Date(company.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-muted-foreground">Added</div>
        </div>
      </div>

      {/* Edit Form */}
      {editing ? (
        <form
          onSubmit={handleUpdate}
          className="rounded-lg bg-white p-6 shadow border"
        >
          <h2 className="mb-4 text-xl font-semibold">Edit Company Details</h2>
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
                ref={tiptapRef}
                value={formData.description || ''}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    description: value,
                    plainTextDescription: tiptapRef.current?.getText() || '',
                  })
                }
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isGlobal"
                  checked={formData.isGlobal || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isGlobal: e.target.checked })
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isGlobal" className="text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Mark as Global Company
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Global companies are visible to all users and can be shared across applications
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        /* Company Details View */
        <div className="rounded-lg bg-white p-6 shadow border">
          <h2 className="mb-4 text-xl font-semibold">Company Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Company Name</h3>
              <p className="text-gray-900">{company.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Website</h3>
              <p className="text-gray-900">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Industry</h3>
              <p className="text-gray-900">{company.industry || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Company Size</h3>
              <p className="text-gray-900">{company.size || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
              <p className="text-gray-900">{company.location || '—'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Global Status</h3>
              <div className="flex items-center gap-2">
                {company.isGlobal ? (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    <Shield className="mr-1 h-3 w-3" />
                    Global Company
                  </span>
                ) : (
                  <span className="text-gray-500">Private Company</span>
                )}
              </div>
            </div>
            {company.description && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <div 
                  className="text-gray-900 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: company.description }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}