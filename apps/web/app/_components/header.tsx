'use client';

import { SignOutButton, UserButton, useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CircleQuestionMarkIcon,
  CoffeeIcon,
  LaptopMinimalCheckIcon,
  MenuIcon,
  User2Icon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FeedbackDialog } from '@/components/feedback-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    return pathname === path;
  };

  // Don't render authentication-dependent content until Clerk is loaded
  if (!isLoaded) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500"
              >
                <LaptopMinimalCheckIcon className="h-5 w-5" color="white" />
                <span className="sr-only">Jobble</span>
              </Link>

              {/* Desktop Navigation */}
              {isSignedIn && (
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    href="/dashboard"
                    aria-current={
                      isCurrentPath('/dashboard') ? 'page' : undefined
                    }
                    className={cn(
                      isCurrentPath('/dashboard')
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    My Applications
                  </Link>
                  <Link
                    href="/dashboard/companies"
                    aria-current={
                      isCurrentPath('/dashboard/companies') ? 'page' : undefined
                    }
                    className={cn(
                      isCurrentPath('/dashboard/companies')
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    My Companies
                  </Link>
                  <Link
                    href="/dashboard/application-flow"
                    aria-current={
                      isCurrentPath('/dashboard/application-flow')
                        ? 'page'
                        : undefined
                    }
                    className={cn(
                      isCurrentPath('/dashboard/application-flow')
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    Application Flow
                  </Link>
                  <Link
                    href="/dashboard/interviews"
                    aria-current={
                      isCurrentPath('/dashboard/interviews')
                        ? 'page'
                        : undefined
                    }
                    className={cn(
                      isCurrentPath('/dashboard/interviews')
                        ? 'border-indigo-600 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                    )}
                  >
                    My Interviews
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex md:items-center md:gap-4">
              {isAdmin && (
                <Popover
                  open={isAdminMenuOpen}
                  onOpenChange={setIsAdminMenuOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setIsAdminMenuOpen(true)}
                    >
                      Admin
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <Button
                      variant="link"
                      onClick={() => {
                        router.push('/admin');
                        setIsAdminMenuOpen(false);
                      }}
                      aria-current={
                        isCurrentPath('/admin') ? 'page' : undefined
                      }
                    >
                      Admin Dashboard
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        router.push('/admin/companies');
                        setIsAdminMenuOpen(false);
                      }}
                      aria-current={
                        isCurrentPath('/admin/companies') ? 'page' : undefined
                      }
                    >
                      Manage Companies
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
              <Button variant="outline" asChild>
                <Link
                  href="https://buymeacoffee.com/westmorelandcreative"
                  target="_blank"
                >
                  <CoffeeIcon className="h-5 w-5" />
                  Donate
                </Link>
              </Button>
              <FeedbackDialog />
              <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <PopoverTrigger asChild>
                  <Avatar
                    className="cursor-pointer"
                    onClick={() => setIsUserMenuOpen(true)}
                  >
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
                    <AvatarFallback>
                      <User2Icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={10}>
                  <div className="p-2">
                    <ul className="flex flex-col gap-2">
                      <li>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full cursor-pointer"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            router.push('/dashboard/profile');
                          }}
                        >
                          <User2Icon className="h-4 w-4" />
                          <span>Profile</span>
                        </Button>
                      </li>
                      <li>
                        <SignOutButton>
                          <Button
                            size="sm"
                            className="w-full cursor-pointer"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                            }}
                          >
                            Sign Out
                          </Button>
                        </SignOutButton>
                      </li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
              {isSignedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MenuIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">My Applications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/companies">My Companies</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/application-flow">
                        Application Flow
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/interviews">My Interviews</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User2Icon className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="https://buymeacoffee.com/westmorelandcreative"
                        target="_blank"
                        className="flex items-center gap-2"
                      >
                        <CoffeeIcon className="h-4 w-4" />
                        Donate
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        className="flex w-full items-center gap-2 text-left"
                        onClick={() => setIsFeedbackOpen(true)}
                      >
                        <CircleQuestionMarkIcon className="h-4 w-4" />
                        Feedback
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>We&apos;d love to hear from you!</DialogTitle>
            <DialogDescription>
              We&apos;re always looking for ways to improve Jobble. Let us
              know what you&apos;d like to see added to the platform.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Tell us about a feature you'd like to see..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button onClick={() => setIsFeedbackOpen(false)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
