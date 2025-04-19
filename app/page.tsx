'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Chat() {
  const { isSignedIn, user } = useUser();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  // Auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  if (!isSignedIn) {
    return (
      <main className="relative min-h-screen w-full flex items-center justify-center">
        <div className="fixed inset-0 w-full h-full -z-10">
          <div className="relative w-full h-full">
            <Image
              src="/dhanush-bg.jpg"
              alt="Dhanush Background"
              fill
              sizes="100vw"
              style={{ 
                objectFit: 'cover', 
                objectPosition: 'center 30%',
                transform: 'scale(1.5) translateY(10%)'
              }}
              priority
              quality={100}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/85 via-gray-900/90 to-gray-900/95 backdrop-blur-[1px]"
              style={{ mixBlendMode: 'multiply' }}
            ></div>
          </div>
        </div>
        <div className="text-center p-8 bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome to Chat with Dhanush</h1>
          <p className="text-gray-300 mb-6">Please sign in to start chatting</p>
          <div className="flex gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full">
      {/* Background Image with Gradient Overlay */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div className="relative w-full h-full">
          <Image
            src="/dhanush-bg.jpg"
            alt="Dhanush Background"
            fill
            sizes="100vw"
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'center 30%',
              transform: 'scale(1.5) translateY(10%)'
            }}
            priority
            quality={100}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/85 via-gray-900/90 to-gray-900/95 backdrop-blur-[1px]"
            style={{ mixBlendMode: 'multiply' }}
          ></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col h-screen max-h-screen p-2 sm:p-4 mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30 mb-2 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-500/30">
              <Image
                src="/dhanush-bg.jpg"
                alt="Dhanush"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 30%' }}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Chat with Dhanush
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Online</span>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 min-h-0 bg-gray-800/30 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700/30 mb-2 sm:mb-4">
          <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 shadow-md ${
                    message.role === 'user' 
                      ? 'bg-blue-600/80 text-white border border-blue-500/30' 
                      : 'bg-gray-700/60 text-gray-100 border border-gray-600/30'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`} className="text-sm leading-relaxed">
                            {part.text}
                          </div>
                        );
                      case 'tool-invocation':
                        return (
                          <pre 
                            key={`${message.id}-${i}`} 
                            className="mt-2 text-xs bg-gray-900/60 p-3 rounded-lg overflow-x-auto border border-gray-800/30"
                          >
                            {JSON.stringify(part.toolInvocation, null, 2)}
                          </pre>
                        );
                    }
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2 p-3 sm:p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/30"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-3 sm:px-4 py-2 bg-gray-700/40 text-gray-100 rounded-lg 
                     border border-gray-600/30 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/50 focus:border-transparent
                     placeholder-gray-400 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 bg-blue-600/80 text-white rounded-lg 
                     hover:bg-blue-700/80 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     disabled:bg-gray-600/50 disabled:cursor-not-allowed
                     font-medium border border-blue-500/30
                     text-sm sm:text-base whitespace-nowrap"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
