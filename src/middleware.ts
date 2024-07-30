import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

// Public Routes : ['/site', 'api/uploadthing', ]

const isProtectedRoute = createRouteMatcher([
    '/agency',
    '/subaccount'  // '/forum(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};