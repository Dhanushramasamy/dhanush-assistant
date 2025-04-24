'use client';

import { SignInButton, useUser } from "@clerk/nextjs";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Dhanush Assistant</span>
          </div>
          <div className="flex items-center">
            {!isLoaded ? (
              <div>Loading...</div>
            ) : isSignedIn ? (
              <UserProfile />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 