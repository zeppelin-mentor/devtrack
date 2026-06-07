'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import type { Page } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';

export default function SharedPageView({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/share/${token}`);
        if (!response.ok) {
          throw new Error('Page not found or not publicly shared');
        }
        const data = await response.json();
        setPage(data.page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="mb-6 text-slate-600">{error || 'This page does not exist or is not publicly shared.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Go to DevTrack
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <FileText className="h-6 w-6" />
              DevTrack
            </Link>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>{page.view_count} views</span>
              <span>•</span>
              <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {page.cover_url && (
            <div
              className="h-64 rounded-t-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${page.cover_url})` }}
            />
          )}
          <div className="p-8 md:p-12">
            <div className="mb-8 flex items-center gap-4">
              {page.icon && (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-4xl">
                  {page.icon}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">{page.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-700">
                    {page.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypeRaw]}
              >
                {page.content || '*This page is empty.*'}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>This page is shared publicly from DevTrack</p>
          <Link href="/" className="mt-2 inline-flex items-center gap-1 text-indigo-600 hover:underline">
            Create your own pages
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </main>
    </div>
  );
}
