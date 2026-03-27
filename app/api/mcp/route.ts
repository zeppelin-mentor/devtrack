import { NextResponse } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createProjectsMcpServerForUser } from '@/lib/mcp/projectsServer';
import { consumeDailyQuota, extractApiKey, findActiveApiKey } from '@/lib/mcp/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function withRateLimitHeaders(response: Response, quota: { limit: number; remaining: number; resetDate: string }) {
  const headers = new Headers(response.headers);
  headers.set('x-ratelimit-limit', String(quota.limit));
  headers.set('x-ratelimit-remaining', String(quota.remaining));
  headers.set('x-ratelimit-reset-date', quota.resetDate);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET() {
  return NextResponse.json({
    name: 'devtrack-projects-mcp',
    transport: 'streamable-http',
    endpoint: '/api/mcp',
    auth: 'x-api-key or Bearer <api-key>',
    rateLimit: '100 requests/day per API key',
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      allow: 'GET,POST,OPTIONS',
    },
  });
}

export async function POST(request: Request) {
  try {
    const rawApiKey = extractApiKey(request);

    if (!rawApiKey) {
      return NextResponse.json(
        { error: 'Missing API key. Use x-api-key header or Bearer token.' },
        { status: 401 },
      );
    }

    const keyRow = await findActiveApiKey(rawApiKey);
    if (!keyRow) {
      return NextResponse.json({ error: 'Invalid or inactive API key.' }, { status: 401 });
    }

    const quota = await consumeDailyQuota(keyRow, 100);
    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: 'Daily request limit exceeded for this API key.',
          limit: quota.limit,
          used: quota.used,
          remaining: quota.remaining,
          resetDate: quota.resetDate,
        },
        {
          status: 429,
          headers: {
            'x-ratelimit-limit': String(quota.limit),
            'x-ratelimit-remaining': String(quota.remaining),
            'x-ratelimit-reset-date': quota.resetDate,
          },
        },
      );
    }

    let parsedBody: unknown;
    if (request.headers.get('content-type')?.includes('application/json')) {
      parsedBody = await request.json().catch(() => undefined);
    }

    const server = createProjectsMcpServerForUser(keyRow.user_id);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    const response = await transport.handleRequest(request, { parsedBody });

    return withRateLimitHeaders(response, quota);
  } catch (error) {
    console.error('MCP HTTP route error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
