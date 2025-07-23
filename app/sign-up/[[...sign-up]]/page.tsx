'use client';

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
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

      {/* Animated Chibi Sticker */}
      <div className="absolute top-8 left-8 w-32 h-32 animate-bounce">
        <Image
          src="/chibi-sticker.png"
          alt="Dhanush Chibi"
          fill
          className="object-contain drop-shadow-2xl"
        />
      </div>

      {/* Floating Chibi Elements */}
      <div className="absolute top-1/4 right-8 w-16 h-16 animate-pulse">
        <Image
          src="/chibi-sticker.png"
          alt="Dhanush Chibi"
          fill
          className="object-contain opacity-60"
        />
      </div>

      <div className="absolute bottom-1/4 left-12 w-20 h-20 animate-spin" style={{ animationDuration: '20s' }}>
        <Image
          src="/chibi-sticker.png"
          alt="Dhanush Chibi"
          fill
          className="object-contain opacity-40"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-6 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Image
              src="/chibi-sticker.png"
              alt="Dhanush Chibi"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join Dhanush Assistant
          </h1>
          <p className="text-gray-300 text-lg">
            Start your AI journey today! 🚀
          </p>
        </div>

        {/* Clerk SignUp Component with Custom Styling */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/40 p-6">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "text-2xl font-bold text-white",
                headerSubtitle: "text-gray-300",
                formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl",
                formFieldInput: "bg-gray-700/50 border border-gray-600/40 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 rounded-xl px-4 py-3 transition-all duration-200",
                formFieldLabel: "text-gray-200 font-medium",
                footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors duration-200",
                dividerLine: "bg-gray-600/40",
                dividerText: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-700/50 border border-gray-600/40 text-white hover:bg-gray-600/50 transition-all duration-200 rounded-xl",
                socialButtonsBlockButtonText: "text-gray-200",
                formFieldLabelRow: "mb-2",
                formFieldRow: "mb-4",
                formResendCodeLink: "text-blue-400 hover:text-blue-300 transition-colors duration-200",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300 transition-colors duration-200",
                formHeaderTitle: "text-2xl font-bold text-white",
                formHeaderSubtitle: "text-gray-300",
                alertText: "text-red-400",
                alert: "bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4",
                verificationCodeFieldInput: "bg-gray-700/50 border border-gray-600/40 text-white text-center text-2xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 rounded-xl",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
                formFieldInputShowPasswordButtonIcon: "text-gray-400",
                avatarBox: "w-12 h-12",
                userPreviewMainIdentifier: "text-white font-semibold",
                userPreviewSecondaryIdentifier: "text-gray-300",
                userPreviewTextContainer: "text-center",
                formButtonReset: "text-gray-400 hover:text-gray-300 transition-colors duration-200",
                formButtonSecondary: "bg-gray-700/50 border border-gray-600/40 text-white hover:bg-gray-600/50 transition-all duration-200 rounded-xl",
              }
            }}
          />
        </div>

        {/* Bottom Floating Chibi */}
        <div className="absolute -bottom-8 right-0 w-16 h-16 animate-bounce" style={{ animationDelay: '1s' }}>
          <Image
            src="/chibi-sticker.png"
            alt="Dhanush Chibi"
            fill
            className="object-contain opacity-70"
          />
        </div>
      </div>
    </div>
  );
} 