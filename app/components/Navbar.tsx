'use client';

import { SignInButton, useUser } from "@clerk/nextjs";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Dhanush Assistant
            </span>
          </div>
          <div className="flex items-center">
            {!isLoaded ? (
              <div className="text-gray-600 dark:text-gray-300">Loading...</div>
            ) : isSignedIn ? (
              <UserProfile />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm">
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