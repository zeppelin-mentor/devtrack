'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import { KeyRound, Plug, RefreshCw, Trash2, Copy } from 'lucide-react';

type McpKey = {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  requests_today: number;
  requests_date: string;
  last_used_at: string | null;
  created_at: string;
};

export default function McpPage() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<McpKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [keyName, setKeyName] = useState('Default MCP Key');
  const [newRawKey, setNewRawKey] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const endpointUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://trackmydevelopement.vercel.app/api/mcp';
    return `${window.location.origin}/api/mcp`;
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessage('No active session found. Please sign in again.');
        return;
      }

      const response = await fetch('/api/mcp/keys', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load API keys');
      }

      setKeys(payload.keys || []);
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Unexpected error';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void loadKeys();
    }
  }, [user]);

  const handleCreateKey = async () => {
    setCreating(true);
    setMessage(null);
    setNewRawKey('');

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessage('No active session found. Please sign in again.');
        return;
      }

      const response = await fetch('/api/mcp/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: keyName }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create API key');
      }

      setNewRawKey(payload.rawKey || '');
      setMessage('API key created. Copy it now - it will not be shown again.');
      await loadKeys();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Unexpected error';
      setMessage(text);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessage('No active session found. Please sign in again.');
        return;
      }

      const response = await fetch('/api/mcp/keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to revoke key');
      }

      setMessage('API key revoked.');
      await loadKeys();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Unexpected error';
      setMessage(text);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">MCP Access</h1>
                <p className="text-slate-600 mt-1">Create API keys and use DevTrack MCP in your coding workflow.</p>
              </div>
              <button
                onClick={() => void loadKeys()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 text-sm">
                {message}
              </div>
            )}

            {newRawKey && (
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                <p className="font-semibold text-amber-900">New API Key (shown once)</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <code className="px-3 py-2 bg-white border border-amber-200 rounded text-sm break-all">{newRawKey}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(newRawKey)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" /> Create API Key
              </h2>
              <div className="flex flex-wrap gap-3">
                <input
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="flex-1 min-w-[220px] px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Key name"
                />
                <button
                  disabled={creating}
                  onClick={() => void handleCreateKey()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </button>
              </div>
              <p className="text-sm text-slate-600">Default rate limit: 100 requests/day per key.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Your API Keys</h2>
              {loading ? (
                <p className="text-slate-500">Loading keys...</p>
              ) : keys.length === 0 ? (
                <p className="text-slate-500">No keys created yet.</p>
              ) : (
                <div className="space-y-3">
                  {keys.map((key) => (
                    <div key={key.id} className="border border-slate-200 rounded-lg p-4 flex flex-wrap items-center gap-3 justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{key.name}</p>
                        <p className="text-sm text-slate-600">Prefix: {key.key_prefix}... | Used today: {key.requests_today}/100</p>
                        <p className="text-xs text-slate-500">Created: {new Date(key.created_at).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => void handleRevokeKey(key.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <Plug className="w-5 h-5 text-emerald-600" /> MCP Configuration
              </h2>
              <p className="text-sm text-slate-600">Use this endpoint in your MCP client. Send your API key in <code>x-api-key</code>.</p>
              <code className="block p-3 bg-slate-900 text-slate-100 rounded-lg text-sm break-all">{endpointUrl}</code>
              <pre className="p-3 bg-slate-100 rounded-lg overflow-x-auto text-sm"><code>{`{
  "mcpServers": {
    "devtrack": {
      "url": "${endpointUrl}",
      "headers": {
        "x-api-key": "YOUR_MCP_API_KEY"
      }
    }
  }
}`}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
