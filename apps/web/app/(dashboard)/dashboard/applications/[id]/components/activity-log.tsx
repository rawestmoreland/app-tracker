'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CalendarIcon,
  Clock,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ApplicationEvent, EventType, EventSource } from '@prisma/client';
import { addActivityLogEntry } from '@/lib/actions/application-actions';

interface ActivityLogProps {
  events: ApplicationEvent[];
  applicationId: string;
}

// Helper function to get icon for event source
function getEventSourceIcon(source: EventSource) {
  switch (source) {
    case 'EMAIL':
      return <Mail className="h-4 w-4" />;
    case 'PHONE_CALL':
      return <Phone className="h-4 w-4" />;
    case 'LINKEDIN':
      return <MessageSquare className="h-4 w-4" />;
    case 'JOB_PORTAL':
      return <Globe className="h-4 w-4" />;
    case 'IN_PERSON':
      return <User className="h-4 w-4" />;
    case 'RECRUITER':
      return <User className="h-4 w-4" />;
    case 'REFERRAL':
      return <User className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

// Helper function to get color for event type
function getEventTypeColor(type: EventType) {
  switch (type) {
    case 'APPLICATION_SUBMITTED':
    case 'CONFIRMATION_RECEIVED':
      return 'bg-blue-100 text-blue-800';
    case 'PHONE_SCREEN_INVITE':
    case 'TECHNICAL_INVITE':
    case 'ONSITE_INVITE':
      return 'bg-green-100 text-green-800';
    case 'OFFER_RECEIVED':
    case 'OFFER_ACCEPTED':
      return 'bg-emerald-100 text-emerald-800';
    case 'REJECTION_RECEIVED':
    case 'POSITION_FILLED':
      return 'bg-red-100 text-red-800';
    case 'WITHDRAWN':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function ActivityLog({
  events,
  applicationId,
}: ActivityLogProps) {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: '' as EventType,
    title: '',
    content: '',
    occurredAt: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    source: '' as EventSource,
  });

  const handleAddEvent = async () => {
    if (!newEvent.type || !newEvent.title || !newEvent.source) {
      return;
    }

    const result = await addActivityLogEntry(applicationId, {
      type: newEvent.type,
      title: newEvent.title,
      content: newEvent.content || undefined,
      occurredAt: new Date(newEvent.occurredAt),
      source: newEvent.source,
    });

    if (result.success) {
      setIsAddingEvent(false);
      setNewEvent({
        type: '' as EventType,
        title: '',
        content: '',
        occurredAt: new Date().toISOString().slice(0, 16),
        source: '' as EventSource,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button size="sm">Add Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Activity Log Entry</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, type: value as EventType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-title">Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="e.g., Phone screen invitation"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-content">Content (Optional)</Label>
                <Textarea
                  id="event-content"
                  value={newEvent.content}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, content: e.target.value })
                  }
                  placeholder="Additional details about this event..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date & Time</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={newEvent.occurredAt}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, occurredAt: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-source">Source</Label>
                <Select
                  value={newEvent.source}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, source: value as EventSource })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventSource).map((source) => (
                      <SelectItem key={source} value={source}>
                        {source.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <CalendarIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No activity logged yet</p>
            <p className="text-sm">
              Add events to track your application journey
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 rounded-lg border p-3"
              >
                <div className="mt-1 flex-shrink-0">
                  {getEventSourceIcon(event.source)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    <Badge
                      variant="secondary"
                      className={getEventTypeColor(event.type)}
                    >
                      {event.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  {event.content && (
                    <p className="text-muted-foreground mb-2 text-sm">
                      {event.content}
                    </p>
                  )}
                  <div className="text-muted-foreground flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(event.occurredAt),
                          'MMM d, yyyy h:mm a',
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>via {event.source.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
