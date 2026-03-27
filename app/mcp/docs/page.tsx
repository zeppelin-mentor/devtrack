'use client';

import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Code2, BookOpen, Server, Shield } from 'lucide-react';

export default function McpDocsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">MCP Docs</h1>
              <p className="text-slate-600 mt-1">
                Configure DevTrack MCP on VS Code, Cursor, and Kiro with HTTP transport.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" /> Endpoint
              </h2>
              <p className="text-sm text-slate-700">DevTrack MCP server endpoint:</p>
              <code className="block p-3 bg-slate-900 text-slate-100 rounded-lg text-sm break-all">
                https://trackmydevelopement.vercel.app/api/mcp
              </code>
              <p className="text-sm text-slate-600">Transport: HTTP only. Stdio is disabled for this integration.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" /> Authentication And Limits
              </h2>
              <p className="text-sm text-slate-700">1. Go to MCP Access in DevTrack and create an API key.</p>
              <p className="text-sm text-slate-700">2. Send the key in <strong>x-api-key</strong> header.</p>
              <p className="text-sm text-slate-700">3. Default limit is 100 requests/day per key.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <Code2 className="w-5 h-5 text-orange-600" /> IDE Client Configs
              </h2>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900">VS Code (<span className="font-mono">.vscode/mcp.json</span>)</h3>
                <pre className="p-3 bg-slate-100 rounded-lg overflow-x-auto text-sm"><code>{`{
  "servers": {
    "devtrack": {
      "url": "https://trackmydevelopement.vercel.app/api/mcp",
      "headers": {
        "x-api-key": "YOUR_MCP_API_KEY"
      }
    }
  }
}`}</code></pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900">Cursor</h3>
                <pre className="p-3 bg-slate-100 rounded-lg overflow-x-auto text-sm"><code>{`{
  "mcpServers": {
    "devtrack": {
      "url": "https://trackmydevelopement.vercel.app/api/mcp",
      "headers": {
        "x-api-key": "YOUR_MCP_API_KEY"
      }
    }
  }
}`}</code></pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900">Kiro</h3>
                <pre className="p-3 bg-slate-100 rounded-lg overflow-x-auto text-sm"><code>{`{
  "mcpServers": {
    "devtrack": {
      "url": "https://trackmydevelopement.vercel.app/api/mcp",
      "headers": {
        "x-api-key": "YOUR_MCP_API_KEY"
      }
    }
  }
}`}</code></pre>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 inline-flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Tooling Guidance
              </h2>
              <p className="text-sm text-slate-700">
                Use DevTrack MCP for project tools (<code>list_projects</code>, <code>add_project</code>, <code>edit_project</code>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
