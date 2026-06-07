import { NextRequest } from 'next/server';

export function getSiteUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredUrl) {
    const url = configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`;
    return url.replace(/\/$/, '');
  }

  return request.nextUrl.origin;
}
