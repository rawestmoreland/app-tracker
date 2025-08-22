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
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { updateNote, deleteNote } from '@/lib/actions/application-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema } from '@/app/(dashboard)/dashboard/applications/lib/new-note-schema';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function NotesSection({
  noteForm,
  notes,
  handleAddNote,
}: {
  noteForm: UseFormReturn<NoteFormData>;
  notes: Note[];
  handleAddNote: (data: NoteFormData) => void;
}) {
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form for editing notes
  const editNoteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: '',
      type: NoteType.GENERAL,
    },
  });

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    editNoteForm.reset({
      content: note.content,
      type: note.type,
    });
    setIsEditing(false);
  };

  const handleEditNote = async (data: NoteFormData) => {
    if (!selectedNote) return;

    setIsSaving(true);
    try {
      const result = await updateNote(selectedNote.id, data);
      if (result.success) {
        setIsEditing(false);
        setSelectedNote(null);
        toast.success('Note updated successfully');
      } else {
        toast.error(result.error || 'Failed to update note');
      }
    } catch (error) {
      alert('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    setIsDeleting(true);

    const result = await deleteNote(noteToDelete);
    if (result.success) {
      setNoteToDelete(null);
      if (selectedNote?.id === noteToDelete) {
        setSelectedNote(null);
      }
      toast.success('Note deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete note');
    }
    setIsDeleting(false);
  };

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
            <div
              key={note.id}
              className="cursor-pointer rounded-r-md border-l-4 border-blue-500 pl-4 transition-colors duration-150 hover:bg-gray-50"
              onClick={() => handleNoteClick(note)}
            >
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

      {/* Note View/Edit Dialog */}
      <Dialog
        open={selectedNote !== null}
        onOpenChange={() => setSelectedNote(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Note' : 'View Note'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Make changes to your note below.'
                : 'Click edit to modify this note.'}
            </DialogDescription>
          </DialogHeader>

          {selectedNote && (
            <div className="space-y-4">
              {isEditing ? (
                <Form {...editNoteForm}>
                  <form
                    onSubmit={editNoteForm.handleSubmit(handleEditNote)}
                    className="space-y-4"
                  >
                    <FormField
                      control={editNoteForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <TiptapEditor {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editNoteForm.control}
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
                                  {startCase(
                                    type.replace('_', ' ').toLowerCase(),
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <div className="rounded-md bg-gray-50 p-3">
                      <TiptapDisplay content={selectedNote.content} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="rounded-md bg-gray-50 p-2">
                      {startCase(
                        selectedNote.type.replace('_', ' ').toLowerCase(),
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <div className="rounded-md bg-gray-50 p-2">
                      {format(selectedNote.createdAt, 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNoteToDelete(selectedNote.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      disabled={isSaving || isDeleting}
                    >
                      {isSaving || isDeleting ? 'Saving...' : 'Edit'}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={noteToDelete !== null}
        onOpenChange={() => setNoteToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteNote}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
