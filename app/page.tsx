'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Chat with Dhanush</h1>
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[500px] overflow-y-auto">
          {messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : ''}`}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <p key={`${message.id}-${i}`} className="text-sm text-gray-800">
                        {part.text}
                      </p>
                    );
                  case 'tool-invocation':
                    return (
                      <pre key={`${message.id}-${i}`} className="text-xs bg-gray-50 p-2 rounded mt-2">
                        {JSON.stringify(part.toolInvocation, null, 2)}
                      </pre>
                    );
                }
              })}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
