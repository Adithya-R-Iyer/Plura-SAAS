import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Route matchers for protected routes
const isAgencyDashboardRoute = createRouteMatcher(['/agency(.*)']);
const isSubAccountDashboardRoute = createRouteMatcher(['/subaccount(.*)']);

export default clerkMiddleware((auth, req: NextRequest) => {
  // Handle authentication for protected routes
  // if (isAgencyDashboardRoute(req) || isSubAccountDashboardRoute(req)) {
  //   auth().protect();
  // }

  // Perform actions after authentication
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostName = req.headers;

  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // Handle subdomain rewriting
  const customSubDomain = hostName.get('host')?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
  }

  // Handle specific path redirection
  if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  // Handle homepage and site URL rewriting
  if (url.pathname === '/' || (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
    return NextResponse.rewrite(new URL(`/site`, req.url));
  }

  // Handle rewriting for protected routes
  if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  // Continue processing for other cases
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
