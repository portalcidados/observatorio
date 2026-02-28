import { ProxyConfig, NextRequest, NextResponse } from 'next/server'
 
export function proxy(request: NextRequest) {
// Define CSP header with nonce support
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Generate nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // SHA256 hashes for inline scripts
  const scriptHashes = [
    'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=',
    'sha256-I2DmuxESqMBc7I699LGXBUbsbFWsjISHkYipfl5NLb8=',
    'sha256-A4YAtXod9DY0TTxuZ9DF7hQQs7FLBYy9v+7+yrqxn7o=',
    'sha256-8NxxGXxir9pjY1tgobEanFuJ/nW5tfGtLxLWJWjuN6A=',
    'sha256-DsoVc5FBtiFzFVprMLb7k3gKy0FYX7fMwSef2XeymCM=',
    'sha256-ODF6w7yglqORN/KuIsl8BOyE2dZmkkqHyScTUYU7+n8=',
    'sha256-j/DJh3tOOqC3mvlAkpSW3QcbR98SsBBK+LOw+3i9+rw=',
    'sha256-441MT30wfZ+SJtcQSCfzkxsisG1laMUFw7lWCr2SYUA='
  ]

const scriptSrcDirectives = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...scriptHashes.map(hash => `'${hash}'`),
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ]

const cspHeader = `
    default-src 'self' https://*.cloudinary.com https://*.sharepoint.com https://*.mapbox.com/ https://*.powerbi.com/ https://*.outlook.com/;
    script-src ${scriptSrcDirectives.join(' ')};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ;
    font-src 'self' data: https://storage.googleapis.com;
    media-src 'self' data: blob: https://*.cloudinary.com https://*.sharepoint.com ;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
 
  const requestHeaders = new Headers(request.headers)
 requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Set security headers
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
  
  // X-Content-Type-Options: nosniff - Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-Frame-Options: DENY - Prevents clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-XSS-Protection: 1; mode=block - Enables XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy: strict-origin-when-cross-origin - Controls referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy - Restricts browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
 
  return response
}

  export const config: ProxyConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],

}