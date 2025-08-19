'use client';

import { NoteFormData } from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TiptapDisplay, TiptapEditor } from '@/components/tiptap-editor';
import { Note, NoteType } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { startCase } from 'lodash';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function NotesSection({
  noteForm,
  notes,
  handleAddNote,
}: {
  noteForm: UseFormReturn<NoteFormData>;
  notes: Note[];
  handleAddNote: (data: NoteFormData) => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Notes</h2>

      <Form {...noteForm}>
        <form onSubmit={noteForm.handleSubmit(handleAddNote)} className="mb-4">
          <div className="space-y-3">
            <FormField
              control={noteForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Note</FormLabel>
                  <FormControl>
                    <TiptapEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-between">
              <FormField
                control={noteForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a note type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(NoteType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {startCase(type.replace('_', ' ').toLowerCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Note</Button>
            </div>
          </div>
        </form>
      </Form>

      {notes.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No notes yet.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 text-sm whitespace-pre-wrap text-gray-900">
                  <TiptapDisplay content={note.content} />
                </div>
                <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                  {format(note.createdAt, 'MM/dd/yyyy')}
                </span>
              </div>
              <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {note.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
