import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/projetos/dashboard-wri-brasil(.*)',
])

function applySecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const scriptHashes = [
    'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=',
    'sha256-I2DmuxESqMBc7I699LGXBUbsbFWsjISHkYipfl5NLb8=',
    'sha256-A4YAtXod9DY0TTxuZ9DF7hQQs7FLBYy9v+7+yrqxn7o=',
    'sha256-8NxxGXxir9pjY1tgobEanFuJ/nW5tfGtLxLWJWjuN6A=',
    'sha256-DsoVc5FBtiFzFVprMLb7k3gKy0FYX7fMwSef2XeymCM=',
    'sha256-ODF6w7yglqORN/KuIsl8BOyE2dZmkkqHyScTUYU7+n8=',
    'sha256-j/DJh3tOOqC3mvlAkpSW3QcbR98SsBBK+LOw+3i9+rw=',
    'sha256-441MT30wfZ+SJtcQSCfzkxsisG1laMUFw7lWCr2SYUA=',
  ]

  const scriptSrcDirectives = [
    "'self'",
    `'nonce-${nonce}'`,
    ...scriptHashes.map((hash) => `'${hash}'`),
    'https://*.clerk.com',
    'https://*.clerk.accounts.dev',
    'https://challenges.cloudflare.com',
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ]

  const cspHeader = `
    default-src 'self' https://*.cloudinary.com https://*.sharepoint.com https://*.mapbox.com/ https://*.powerbi.com/ https://*.outlook.com/;
    script-src ${scriptSrcDirectives.join(' ')} https://*.clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com;
    connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://*.cloudinary.com https://*.sharepoint.com https://*.mapbox.com https://*.powerbi.com https://*.outlook.com https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://*.clerk.com;
    img-src 'self' blob: data: https://img.clerk.com;
    font-src 'self' data: https://storage.googleapis.com https://*.clerk.com;
    media-src 'self' data: blob: https://*.cloudinary.com https://*.sharepoint.com;
    worker-src 'self' blob:;
    frame-src https://challenges.cloudflare.com https://*.clerk.com https://*.clerk.accounts.dev https://*.powerbi.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `

  const cspValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

  response.headers.set('x-nonce', nonce)
  response.headers.set('Content-Security-Policy', cspValue)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  return response
}

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect()
  }

  const response = NextResponse.next()
  return applySecurityHeaders(request, response)
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
