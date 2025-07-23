'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Chat() {
  const { isSignedIn, user } = useUser();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
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
    <main className="relative min-h-screen w-full bg-gray-900">
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
      <div className="flex flex-col h-screen max-h-screen p-2 sm:p-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/40 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-lg">
              <Image
                src="/dhanush-bg.jpg"
                alt="Dhanush"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 30%' }}
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chat with Dhanush
              </h1>
              <p className="text-sm text-gray-400">Your AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-sm text-gray-300 font-medium">Online</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
              <span className="text-xs text-gray-300 font-medium">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 min-h-0 bg-gray-800/40 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/40 mb-4 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="relative w-24 h-24">
                  <Image
                    src="/chibi-sticker.png"
                    alt="Dhanush Chibi"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">Welcome to the chat!</h3>
                  <p className="text-gray-400">Start a conversation with Dhanush</p>
                </div>
              </div>
            )}
            
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
              >
                {message.role === 'assistant' && (
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="/chibi-sticker.png"
                      alt="Dhanush Chibi"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border border-blue-500/40' 
                      : 'bg-gray-700/70 text-gray-100 border border-gray-600/40'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`} className="text-sm sm:text-base leading-relaxed">
                            {part.text}
                          </div>
                        );
                      case 'tool-invocation':
                        return (
                          <pre 
                            key={`${message.id}-${i}`} 
                            className="mt-3 text-xs bg-gray-900/60 p-3 rounded-lg overflow-x-auto border border-gray-800/40"
                          >
                            {JSON.stringify(part.toolInvocation, null, 2)}
                          </pre>
                        );
                    }
                  })}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start items-end gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/chibi-sticker.png"
                    alt="Dhanush Chibi"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="bg-gray-700/70 text-gray-100 border border-gray-600/40 rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-3 p-4 sm:p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/40"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-700/50 text-gray-100 rounded-xl 
                     border border-gray-600/40 focus:outline-none focus:ring-2 
                     focus:ring-blue-500/50 focus:border-transparent
                     placeholder-gray-400 text-sm sm:text-base
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white rounded-xl 
                     hover:from-blue-700/90 hover:to-blue-800/90 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     disabled:from-gray-600/50 disabled:to-gray-700/50 disabled:cursor-not-allowed
                     font-medium border border-blue-500/40
                     text-sm sm:text-base whitespace-nowrap
                     shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </main>
  );
}
