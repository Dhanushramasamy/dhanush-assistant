'use client';

import { UserButton, useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        {user && (
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-white">
              {user.fullName || user.username}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}
      </div>
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
            userButtonPopoverActionButton: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
            userButtonPopoverActionButtonText: "text-gray-700 dark:text-gray-200",
            userButtonPopoverFooter: "border-t border-gray-200 dark:border-gray-700",
          }
        }}
      />
    </div>
  );
} 