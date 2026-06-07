'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Loader from '@/components/Loader';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { deletePage, getPage, getProjects, updatePage, createProject, generateShareToken, removeShareToken } from '@/lib/supabase/database';
import { supabase } from '@/lib/supabase/client';
import type { Page, PageStatus, Project } from '@/types';
import { ArrowLeft, Link as LinkIcon, Save, Trash2, Share2, Copy, ExternalLink, Plus, Upload, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export default function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<PageStatus>('draft');
  const [projectId, setProjectId] = useState('');
  const [icon, setIcon] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const [pageData, projectsData] = await Promise.all([
        getPage(id),
        getProjects(user.id),
      ]);

      setPage(pageData);
      setTitle(pageData.title);
      setContent(pageData.content);
      setStatus(pageData.status);
      setProjectId(pageData.project_id || '');
      setIcon(pageData.icon || '');
      setCoverUrl(pageData.cover_url || '');
      setIsPublic(pageData.is_public);
      setShareToken(pageData.share_token || null);
      setDirty(false);
      setSaveStatus('saved');
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading page:', error);
      setPage(null);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const savePage = useCallback(async () => {
    if (!page) {
      return;
    }

    try {
      setSaveStatus('saving');
      const updatedPage = await updatePage(page.id, {
        title: title.trim() || 'Untitled',
        content,
        status,
        project_id: projectId || null,
        icon: icon.trim() || null,
        cover_url: coverUrl.trim() || null,
        is_public: isPublic,
      });

      setPage(updatedPage);
      setDirty(false);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving page:', error);
      setSaveStatus('error');
    }
  }, [content, coverUrl, icon, isPublic, page, projectId, status, title]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      const project = await createProject({
        user_id: user!.id,
        name: newProjectName.trim(),
      });
      
      setProjects([project, ...projects]);
      setProjectId(project.id);
      setNewProjectName('');
      setShowNewProjectModal(false);
      markDirty();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleTogglePublic = async () => {
    if (!page) return;

    try {
      if (!isPublic && !shareToken) {
        // Generate share token and make public
        const token = await generateShareToken(page.id);
        setShareToken(token);
        setIsPublic(true);
      } else if (isPublic) {
        // Make private and remove share token
        await removeShareToken(page.id);
        setShareToken(null);
        setIsPublic(false);
      }
      
      // Reload page to get updated data
      const updatedPage = await getPage(page.id);
      setPage(updatedPage);
    } catch (error) {
      console.error('Error toggling public status:', error);
      alert('Failed to update sharing status');
    }
  };

  const copyShareLink = () => {
    if (!shareToken) return;
    
    const shareUrl = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !page) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingCover(true);

      // Delete old cover if exists
      if (coverUrl && coverUrl.includes('supabase')) {
        const oldPath = coverUrl.split('/page-covers/')[1];
        if (oldPath) {
          await supabase.storage.from('page-covers').remove([oldPath]);
        }
      }

      // Upload new cover
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${page.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('page-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('page-covers')
        .getPublicUrl(fileName);

      setCoverUrl(publicUrl);
      markDirty();
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!coverUrl) return;

    if (!confirm('Remove cover image?')) return;

    try {
      // Delete from storage if it's a Supabase URL
      if (coverUrl.includes('supabase')) {
        const path = coverUrl.split('/page-covers/')[1];
        if (path) {
          await supabase.storage.from('page-covers').remove([path]);
        }
      }

      setCoverUrl('');
      markDirty();
    } catch (error) {
      console.error('Error removing cover:', error);
      alert('Failed to remove cover image');
    }
  };

  const markDirty = useCallback(() => {
    setDirty(true);
    setSaveStatus('unsaved');
  }, []);

  const insertLink = useCallback(() => {
    const url = window.prompt('URL');

    if (!url) {
      return;
    }

    const textarea = textareaRef.current;
    const linkText = `[link](${url})`;

    if (!textarea) {
      setContent((currentContent) => `${currentContent}${linkText}`);
      markDirty();
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end) || 'link';
    const newContent = `${content.slice(0, start)}[${selectedText}](${url})${content.slice(end)}`;

    setContent(newContent);
    markDirty();

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + selectedText.length + url.length + 4);
    });
  }, [content, markDirty]);

  useEffect(() => {
    if (!dirty || loading || !page) {
      return;
    }

    setSaveStatus('unsaved');
    const timeout = setTimeout(() => {
      savePage();
    }, 800);

    return () => clearTimeout(timeout);
  }, [dirty, loading, page, savePage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        savePage();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        insertLink();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [insertLink, savePage]);

  const handleDelete = async () => {
    if (!page || !confirm(`Delete "${page.title}"?`)) {
      return;
    }

    try {
      await deletePage(page.id);
      router.push('/pages');
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <div className="flex-1">
            <Loader />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!page) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-4 text-2xl font-bold text-slate-900">Page Not Found</h1>
              <Link href="/pages" className="inline-flex items-center gap-2 text-orange-600 hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to Pages
              </Link>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/pages"
                className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Pages
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : saveStatus === 'saving'
                        ? 'bg-blue-100 text-blue-700'
                        : saveStatus === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {saveStatus === 'saved' && 'Saved'}
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'unsaved' && 'Unsaved'}
                  {saveStatus === 'error' && 'Save failed'}
                </span>
                <button
                  onClick={handleTogglePublic}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm transition ${
                    isPublic
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                  title={isPublic ? 'Make private' : 'Make public'}
                >
                  <Share2 className="h-4 w-4" />
                  {isPublic ? 'Public' : 'Private'}
                </button>
                {isPublic && shareToken && (
                  <button
                    onClick={copyShareLink}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                    title="Copy share link"
                  >
                    {copySuccess ? (
                      <>
                        <Copy className="h-4 w-4 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={insertLink}
                  className="rounded-lg bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  title="Insert link"
                >
                  <LinkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={savePage}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-white p-2 text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {coverUrl && (
                  <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${coverUrl})` }}>
                    <button
                      onClick={handleRemoveCover}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700"
                      title="Remove cover"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="space-y-5 p-6">
                  <div className="flex items-center gap-3">
                    <input
                      value={icon}
                      onChange={(event) => {
                        setIcon(event.target.value);
                        markDirty();
                      }}
                      className="h-12 w-16 rounded-lg border border-slate-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="#"
                      maxLength={4}
                    />
                    <input
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        markDirty();
                      }}
                      className="min-w-0 flex-1 border-none text-4xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
                      placeholder="Untitled"
                    />
                  </div>

                  <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        showPreview
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      onClick={insertLink}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                      title="Insert link (Ctrl/Cmd+K)"
                    >
                      Insert Link
                    </button>
                  </div>

                  {showPreview ? (
                    <div className="prose prose-slate max-w-none min-h-[540px] rounded-lg border border-slate-200 p-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeRaw]}
                      >
                        {content || '*Empty page*'}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(event) => {
                        setContent(event.target.value);
                        markDirty();
                      }}
                      className="min-h-[540px] w-full resize-y rounded-lg border border-slate-300 p-4 font-mono text-sm leading-6 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write in Markdown..."
                    />
                  )}
                </div>
              </section>

              <aside className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                      <select
                        value={status}
                        onChange={(event) => {
                          setStatus(event.target.value as PageStatus);
                          markDirty();
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-700">Project</label>
                        <button
                          type="button"
                          onClick={() => setShowNewProjectModal(true)}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          <Plus className="h-3 w-3" />
                          New
                        </button>
                      </div>
                      <select
                        value={projectId}
                        onChange={(event) => {
                          setProjectId(event.target.value);
                          markDirty();
                        }}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">No linked project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {isPublic && shareToken && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Public Share Link</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${shareToken}`}
                            readOnly
                            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600"
                          />
                          <a
                            href={`/share/${shareToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-700"
                            title="Open in new tab"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                          {page.view_count} views
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Cover Image</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                          id="cover-upload"
                          disabled={uploadingCover}
                        />
                        <label
                          htmlFor="cover-upload"
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 ${
                            uploadingCover ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Upload className="h-4 w-4" />
                          {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                        </label>
                        <input
                          type="url"
                          value={coverUrl}
                          onChange={(event) => {
                            setCoverUrl(event.target.value);
                            markDirty();
                          }}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Or paste image URL..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Updated</label>
                      <p className="text-sm text-slate-600">{new Date(page.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-lg font-semibold text-slate-900">Preview</h2>
                  <div className="prose prose-slate prose-sm max-h-96 max-w-none overflow-y-auto rounded-lg bg-slate-50 p-4">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize, rehypeRaw]}
                    >
                      {content || '*Empty page*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Create New Project</h2>
            <div className="mb-6">
              <label className="mb-1 block text-sm font-medium text-slate-700">Project Name *</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Project"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateProject();
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateProject}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="flex-1 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
