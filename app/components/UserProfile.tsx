'use client';

import { UserButton, useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        {user && (
          <div className="text-sm">
            <p className="font-medium">{user.fullName || user.username}</p>
            <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
      </div>
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
} 