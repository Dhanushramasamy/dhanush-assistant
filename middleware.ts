import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define route matchers for different access levels
const isGeneralDataRoute = createRouteMatcher(['/api/chat(.*)'])
const isPersonalDataRoute = createRouteMatcher(['/api/personal(.*)'])

interface SessionClaims {
  metadata?: {
    category?: string;
  };
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // If no user is signed in, protect all routes
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get the user's category from public metadata
  const category = (sessionClaims as SessionClaims)?.metadata?.category || 'friend'

  // Protect personal data routes - only allow 'close-friend' category
  if (isPersonalDataRoute(req)) {
    if (category !== 'close-friend') {
      return new Response('Forbidden', { status: 403 })
    }
  }

  // For general data routes - allow both 'friend' and 'close-friend' categories
  if (isGeneralDataRoute(req)) {
    if (!['friend', 'close-friend'].includes(category)) {
      return new Response('Forbidden', { status: 403 })
    }
  }
})

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
} 