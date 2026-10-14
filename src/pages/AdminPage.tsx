import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  LogOut,
  FolderKanban,
  Star,
  Inbox,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Phone,
  MessageCircle,
  RefreshCw,
  Download,
  Upload,
  FileJson
} from 'lucide-react';
import { Project, Testimonial, Inquiry } from '../types';
import { useSound } from '../context/SoundContext';

export const AdminPage: React.FC = () => {
  const { playPop, playSuccess, playSnap } = useSound();

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cretify_admin_token');
  });

  // Auth Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'projects' | 'reviews' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'inquiries'>('projects');

  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Project Modal Editor State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Review Modal Editor State
  const [editingReview, setEditingReview] = useState<Partial<Testimonial> | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Works JSON Import / Export State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importPendingProjects, setImportPendingProjects] = useState<Project[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all data
  const fetchData = async (authToken?: string) => {
    const currentToken = authToken || token;
    setIsLoadingData(true);
    try {
      const [projRes, revRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/reviews')
      ]);
      if (projRes.ok) setProjects(await projRes.json());
      if (revRes.ok) setReviews(await revRes.json());

      if (currentToken) {
        const inqRes = await fetch('/api/inquiries', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        if (inqRes.ok) setInquiries(await inqRes.json());
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    playPop();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed. Please check credentials.');
        setIsLoggingIn(false);
        return;
      }

      localStorage.setItem('cretify_admin_token', data.token);
      setToken(data.token);
      playSuccess();
      showToast('Welcome back, Admin! Synced with production database.');
      fetchData(data.token);
    } catch (err) {
      setAuthError('Connection error. Server is unreachable.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    playSnap();
    localStorage.removeItem('cretify_admin_token');
    setToken(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  // ---------------- PROJECT ACTIONS ----------------
  const handleOpenNewProject = () => {
    playPop();
    setEditingProject({
      name: '',
      year: new Date().getFullYear().toString(),
      client: '',
      category: 'Web apps',
      tagline: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      liveUrl: 'https://',
      accentColor: '#FF5A00',
      gradient: 'from-[#FF5A00]/25 to-[#6B4DFF]/20',
      tags: ['Next.js', 'Tailwind CSS'],
      deliverables: ['Custom Web App', 'High-speed Optimization'],
      metrics: [
        { label: 'Conversion Lift', value: '+40%' },
        { label: 'Speed', value: '0.4s' }
      ],
      challenge: 'Client needed a modern high-speed digital application without template bloat.',
      solution: 'Engineered a bespoke full-stack platform with clean TypeScript and sub-second caching.',
      result: 'Drove massive engagement and automated all workflows seamlessly.',
      mockupType: 'dashboard'
    });
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    playPop();
    setEditingProject({ ...proj });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will remove it for all visitors immediately.`)) {
      return;
    }
    playSnap();

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        playSuccess();
        showToast(`Project "${name}" removed successfully.`);
      }
    } catch {
      alert('Failed to delete project. Check server connection.');
    }
  };

  // Export Works to JSON file
  const handleExportWorks = () => {
    playPop();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `cretify_works_${dateStr}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playSuccess();
    showToast(`Exported ${projects.length} works to ${fileName}`);
  };

  // Trigger file selection for import
  const handleTriggerFileInput = () => {
    playPop();
    fileInputRef.current?.click();
  };

  // Read and parse selected JSON file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const list: any[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.projects)
          ? parsed.projects
          : Array.isArray(parsed.works)
          ? parsed.works
          : null;

        if (!list || list.length === 0) {
          alert('Could not find any projects in this JSON file. Expected an array of project objects.');
          return;
        }

        // Normalize imported items
        const normalized: Project[] = list.map((item, idx) => ({
          id: item.id || `proj-imp-${Date.now()}-${idx}`,
          name: item.name || 'Untitled Project',
          year: item.year || new Date().getFullYear().toString(),
          client: item.client || 'Client',
          category: item.category || 'Web development',
          tagline: item.tagline || '',
          description: item.description || '',
          imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          liveUrl: item.liveUrl || 'https://',
          accentColor: item.accentColor || '#FF5A00',
          gradient: item.gradient || 'from-[#FF5A00]/25 to-[#6B4DFF]/20',
          tags: Array.isArray(item.tags) ? item.tags : ['Digital Experience'],
          deliverables: Array.isArray(item.deliverables) ? item.deliverables : ['Full-Stack Engineering'],
          metrics: Array.isArray(item.metrics) ? item.metrics : [],
          challenge: item.challenge || '',
          solution: item.solution || '',
          result: item.result || '',
          mockupType: item.mockupType || 'dashboard'
        }));

        setImportPendingProjects(normalized);
        setIsImportModalOpen(true);
        playPop();
      } catch {
        alert('Invalid JSON file format. Please upload a valid .json file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Confirm import and send to server API
  const handleConfirmImport = async () => {
    if (!importPendingProjects.length) return;
    setIsImporting(true);
    playPop();

    try {
      const res = await fetch('/api/projects/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projects: importPendingProjects,
          mode: importMode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        playSuccess();
        showToast(
          `Successfully ${importMode === 'replace' ? 'replaced with' : 'merged'} ${importPendingProjects.length} imported works!`
        );
        setIsImportModalOpen(false);
      } else {
        alert('Server error while importing projects.');
      }
    } catch {
      alert('Failed to connect to server during import.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;
    playPop();

    const isExisting = Boolean(editingProject.id);
    const url = isExisting ? `/api/projects/${editingProject.id}` : '/api/projects';
    const method = isExisting ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });

      if (res.ok) {
        const saved = await res.json();
        if (isExisting) {
          setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
          showToast(`Updated "${saved.name}" successfully!`);
        } else {
          setProjects((prev) => [saved, ...prev]);
          showToast(`Added "${saved.name}" to live website!`);
        }
        playSuccess();
        setIsProjectModalOpen(false);
      } else {
        alert('Failed to save project. Server returned an error.');
      }
    } catch {
      alert('Error contacting server.');
    }
  };

  // ---------------- REVIEW ACTIONS ----------------
  const handleOpenNewReview = () => {
    playPop();
    setEditingReview({
      clientName: '',
      role: 'Founder',
      company: '',
      channel: 'WhatsApp',
      time: 'Just now',
      message: '',
      rating: 5,
      avatarColor: '#FF5A00'
    });
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (id: string, author: string) => {
    if (!window.confirm(`Delete review from "${author}"?`)) return;
    playSnap();

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        playSuccess();
        showToast('Review removed.');
      }
    } catch {
      alert('Failed to delete review.');
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.clientName || !editingReview.message) return;
    playPop();

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingReview)
      });

      if (res.ok) {
        const saved = await res.json();
        setReviews((prev) => [saved, ...prev]);
        playSuccess();
        showToast('New review added to live website!');
        setIsReviewModalOpen(false);
      }
    } catch {
      alert('Error saving review.');
    }
  };

  // ---------------- INQUIRY ACTIONS ----------------
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        showToast('Inquiry deleted.');
      }
    } catch {}
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!token) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-28 pb-16 px-6 bg-[#FFF4E6] text-[#14110F]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-[32px] bg-white border-4 border-[#14110F] p-8 sm:p-10 shadow-brutal"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5A00] text-white flex items-center justify-center border-2 border-[#14110F] shadow-brutal-sm">
              <Lock size={30} />
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5A00] font-black">
              RESTRICTED ACCESS
            </span>
            <h1 className="font-display font-black text-3xl text-[#14110F] tracking-tight mt-1 uppercase">
              Cretify Admin
            </h1>
            <p className="font-space text-xs text-[#14110F]/65 mt-1">
              Live Content Manager & Leads Control Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-bold text-[#14110F]/80">
                Username
              </label>
              <input
                type="text"
                required
                autoFocus
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-mono text-sm text-[#14110F] shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-bold text-[#14110F]/80">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-[#14110F] bg-[#FFF4E6]/50 focus:bg-white focus:outline-none focus:border-[#FF5A00] font-mono text-sm text-[#14110F] shadow-inner"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 text-xs font-mono font-medium flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-3 w-full py-4 rounded-xl bg-[#FF5A00] text-white font-display font-black text-sm uppercase tracking-wider border-2 border-[#14110F] shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <span>VERIFYING CREDENTIALS...</span>
              ) : (
                <span>ACCESS ADMIN PORTAL</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-[#14110F]/10 text-center font-mono text-[11px] text-[#14110F]/50">
            Protected with Rate Limiting & JWT Authentication
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------- LOGGED IN PORTAL ----------------
  return (
    <div className="relative z-10 pt-32 pb-24 px-4 sm:px-10 min-h-screen bg-[#FFF4E6] text-[#14110F]">
      <div className="max-w-7xl mx-auto">
        {/* Toast alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-[#14110F] text-[#FFF4E6] border-2 border-white/20 shadow-brutal font-mono text-xs font-bold flex items-center gap-2.5"
            >
              <CheckCircle2 size={16} className="text-[#27E3A4]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-[#14110F]/15">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#27E3A4] font-black bg-[#14110F] px-2.5 py-0.5 rounded-full">
                ● LIVE SYNC ACTIVE
              </span>
              <span className="text-xs font-mono text-[#14110F]/60">Logged in as cretifyservices4508</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#14110F] tracking-tight mt-1 uppercase">
              Cretify Master Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              disabled={isLoadingData}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#14110F] text-xs font-mono font-bold flex items-center gap-1.5 shadow-brutal-sm hover:bg-[#FFF4E6] cursor-pointer"
              title="Refresh database"
            >
              <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
              <span>Sync</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 border-2 border-red-500 text-red-900 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-brutal-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider border-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#FF5A00] text-white border-[#14110F] shadow-brutal'
                : 'bg-white text-[#14110F] border-[#14110F]/20 hover:border-[#14110F]'
            }`}
          >
            <FolderKanban size={16} />
            <span>Manage Works ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider border-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#FF5A00] text-white border-[#14110F] shadow-brutal'
                : 'bg-white text-[#14110F] border-[#14110F]/20 hover:border-[#14110F]'
            }`}
          >
            <Star size={16} />
            <span>Client Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider border-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#FF5A00] text-white border-[#14110F] shadow-brutal'
                : 'bg-white text-[#14110F] border-[#14110F]/20 hover:border-[#14110F]'
            }`}
          >
            <Inbox size={16} />
            <span>Inquiries & Leads ({inquiries.length})</span>
          </button>
        </div>

        {/* ---------------- TAB 1: PROJECTS ---------------- */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#14110F]/10">
              <div>
                <h2 className="font-display font-black text-xl text-[#14110F]">
                  Selected Works & Case Studies ({projects.length})
                </h2>
                <p className="font-space text-xs sm:text-sm text-[#14110F]/70 mt-0.5">
                  Live portfolio sync. Export current works as a JSON file, or import JSON to update in bulk.
                </p>
              </div>

              {/* Action Buttons: Export JSON, Import JSON, Add Work */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Export Button */}
                <button
                  type="button"
                  onClick={handleExportWorks}
                  className="px-4 py-2.5 rounded-full bg-white border-2 border-[#14110F] text-[#14110F] hover:bg-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-brutal-sm hover:shadow-brutal cursor-pointer transition-all"
                  title="Download current works as JSON file"
                >
                  <Download size={15} className="text-[#FF5A00]" />
                  <span>Export JSON</span>
                </button>

                {/* Import Button */}
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="px-4 py-2.5 rounded-full bg-white border-2 border-[#14110F] text-[#14110F] hover:bg-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow-brutal-sm hover:shadow-brutal cursor-pointer transition-all"
                  title="Upload and import works from JSON file"
                >
                  <Upload size={15} className="text-[#6B4DFF]" />
                  <span>Import JSON</span>
                </button>

                {/* Add New Work */}
                <button
                  type="button"
                  onClick={handleOpenNewProject}
                  className="px-5 py-2.5 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-brutal hover:shadow-brutal-sm cursor-pointer transition-all hover:bg-[#FF5A00]"
                >
                  <Plus size={16} />
                  <span>Add New Work</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-[28px] bg-white border-3 border-[#14110F] p-5 shadow-brutal flex flex-col justify-between"
                >
                  <div>
                    {/* Desktop Mockup Preview */}
                    <div className="w-full aspect-[16/10] rounded-xl bg-[#14110F] overflow-hidden border border-[#14110F] mb-4 relative">
                      {proj.imageUrl ? (
                        <img
                          src={proj.imageUrl}
                          alt={proj.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs">
                          No Image
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#14110F]/80 text-[10px] font-mono text-white">
                        {proj.category}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] text-[#14110F]/60">
                          {proj.client} · {proj.year}
                        </span>
                        <h3 className="font-display font-black text-xl text-[#14110F]">
                          {proj.name}
                        </h3>
                      </div>
                    </div>

                    <p className="font-space text-xs text-[#14110F]/70 mt-2 line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#14110F]/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#14110F]/50 truncate max-w-[150px]">
                      {proj.liveUrl || 'No URL'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="p-2 rounded-lg bg-[#FFF4E6] border border-[#14110F] hover:bg-[#FF5A00] hover:text-white transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.name)}
                        className="p-2 rounded-lg bg-red-50 border border-red-400 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: REVIEWS ---------------- */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2">
              <p className="font-space text-sm text-[#14110F]/70">
                Manage WhatsApp / Instagram client testimonials shown in the "Straight from the DMs" section.
              </p>
              <button
                onClick={handleOpenNewReview}
                className="px-5 py-2.5 rounded-full bg-[#14110F] text-[#FFF4E6] font-display font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-brutal hover:shadow-brutal-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-[28px] bg-white border-3 border-[#14110F] p-6 shadow-brutal flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#14110F]/10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full text-white font-display font-bold flex items-center justify-center text-xs"
                          style={{ backgroundColor: rev.avatarColor || '#FF5A00' }}
                        >
                          {rev.clientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#14110F]">
                            {rev.clientName}
                          </h4>
                          <span className="font-mono text-[10px] text-[#14110F]/60">
                            {rev.role} · {rev.company}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#14110F]/5 font-bold">
                        {rev.channel}
                      </span>
                    </div>

                    <p className="font-space text-xs text-[#14110F]/80 leading-relaxed italic">
                      "{rev.message}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#14110F]/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#FF5A00] font-bold">
                      ★ {rev.rating || 5}.0 Stars
                    </span>
                    <button
                      onClick={() => handleDeleteReview(rev.id, rev.clientName)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: INQUIRIES / LEADS ---------------- */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col gap-6">
            <p className="font-space text-sm text-[#14110F]/70">
              Live inquiries submitted via the 4-step "Start a project" popup. Click the WhatsApp button to message them instantly!
            </p>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center rounded-[32px] bg-white border-2 border-dashed border-[#14110F]/30 font-mono text-sm text-[#14110F]/50">
                No inquiries submitted yet. When a visitor completes the 4-step brief, it will appear here instantly!
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {inquiries.map((inq) => {
                  const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(inq.name)}!%20This%20is%20Cretify%20following%20up%20on%20your%20project%20inquiry.`;

                  return (
                    <div
                      key={inq.id}
                      className="rounded-2xl bg-white border-2 border-[#14110F] p-6 shadow-brutal-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1.5 max-w-xl">
                        <div className="flex items-center gap-3">
                          <h4 className="font-display font-black text-lg text-[#14110F]">
                            {inq.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-[#FF5A00]">
                            {inq.phone}
                          </span>
                          <span className="font-mono text-[10px] text-[#14110F]/40">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-xs text-[#14110F]/60">Needs:</span>
                          {inq.services.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-full bg-[#14110F]/10 font-mono text-[11px] font-semibold text-[#14110F]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {inq.notes && (
                          <p className="font-space text-xs text-[#14110F]/80 mt-1 bg-[#FFF4E6] p-2 rounded-lg border border-[#14110F]/10">
                            <strong>Note:</strong> {inq.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-display font-bold text-xs uppercase tracking-wide flex items-center gap-2 shadow-brutal-sm hover:brightness-110"
                        >
                          <MessageCircle size={14} className="fill-white" />
                          <span>WhatsApp Lead</span>
                        </a>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------- PROJECT EDIT MODAL ---------------- */}
      <AnimatePresence>
        {isProjectModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="fixed inset-0 bg-[#14110F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#FFF4E6] border-4 border-[#14110F] p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-[#14110F] bg-white flex items-center justify-center hover:bg-[#FF5A00] hover:text-white cursor-pointer shadow-brutal-sm"
              >
                <X size={18} />
              </button>

              <h2 className="font-display font-black text-2xl text-[#14110F] uppercase mb-4">
                {editingProject.id ? 'Edit Project Details' : 'Add New Project'}
              </h2>

              <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.name || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      placeholder="e.g. Lumina Coffee"
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Category</label>
                    <select
                      value={editingProject.category || 'Web apps'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    >
                      <option value="Web apps">Web apps</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Branding">Branding</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Client / Company Name</label>
                    <input
                      type="text"
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      placeholder="e.g. Lumina Roasters Inc."
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Year</label>
                    <input
                      type="text"
                      value={editingProject.year || '2025'}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold">Desktop Screenshot Image URL (Replace with actual link)</label>
                  <input
                    type="url"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold">Live Website Link</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold">Short Tagline</label>
                  <input
                    type="text"
                    value={editingProject.tagline || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    placeholder="High-conversion e-commerce storefront"
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold">Full Project Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Challenge</label>
                    <textarea
                      rows={2}
                      value={editingProject.challenge || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#14110F] bg-white text-xs resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Solution</label>
                    <textarea
                      rows={2}
                      value={editingProject.solution || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#14110F] bg-white text-xs resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Outcome</label>
                    <textarea
                      rows={2}
                      value={editingProject.result || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, result: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-[#14110F] bg-white text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#14110F]/15">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#14110F] bg-white font-mono text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF5A00] text-white font-display font-bold text-xs uppercase tracking-wide border-2 border-[#14110F] shadow-brutal-sm hover:shadow-brutal cursor-pointer flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    <span>Save Project</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- REVIEW EDIT MODAL ---------------- */}
      <AnimatePresence>
        {isReviewModalOpen && editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 bg-[#14110F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-[32px] bg-[#FFF4E6] border-4 border-[#14110F] p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-[#14110F] bg-white flex items-center justify-center hover:bg-[#FF5A00] hover:text-white cursor-pointer shadow-brutal-sm"
              >
                <X size={18} />
              </button>

              <h2 className="font-display font-black text-2xl text-[#14110F] uppercase mb-4">
                Add Client Testimonial
              </h2>

              <form onSubmit={handleSaveReview} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={editingReview.clientName || ''}
                      onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                      placeholder="e.g. Swastik Pandey"
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Company</label>
                    <input
                      type="text"
                      value={editingReview.company || ''}
                      onChange={(e) => setEditingReview({ ...editingReview, company: e.target.value })}
                      placeholder="e.g. Growth Tribe"
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Role</label>
                    <input
                      type="text"
                      value={editingReview.role || 'Founder'}
                      onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                      placeholder="Founder / CEO"
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs font-bold">Channel</label>
                    <select
                      value={editingReview.channel || 'WhatsApp'}
                      onChange={(e) => setEditingReview({ ...editingReview, channel: e.target.value as any })}
                      className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Telegram">Telegram</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs font-bold">Testimonial Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingReview.message || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, message: e.target.value })}
                    placeholder="Real reaction from client DMs..."
                    className="px-3.5 py-2.5 rounded-xl border-2 border-[#14110F] bg-white font-space text-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#14110F]/15">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#14110F] bg-white font-mono text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FF5A00] text-white font-display font-bold text-xs uppercase tracking-wide border-2 border-[#14110F] shadow-brutal-sm hover:shadow-brutal cursor-pointer"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- WORKS JSON IMPORT MODAL ---------------- */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isImporting && setIsImportModalOpen(false)}
              className="fixed inset-0 bg-[#14110F]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-[32px] bg-[#FFF4E6] border-4 border-[#14110F] p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => !isImporting && setIsImportModalOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-[#14110F] bg-white flex items-center justify-center hover:bg-[#FF5A00] hover:text-white cursor-pointer shadow-brutal-sm"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#6B4DFF] text-white flex items-center justify-center border-2 border-[#14110F] shadow-brutal-sm">
                  <FileJson size={20} />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-[#14110F] uppercase">
                    Import Works (JSON)
                  </h2>
                  <span className="font-mono text-xs text-[#14110F]/60">
                    File: <span className="font-bold text-[#6B4DFF]">{importFileName}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-[#14110F] shadow-inner flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-[#14110F]">Detected Works in File:</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#27E3A4]/20 text-[#14110F] border border-[#27E3A4]">
                    {importPendingProjects.length} Projects Found
                  </span>
                </div>

                {/* Preview List */}
                <div className="max-h-40 overflow-y-auto divide-y divide-[#14110F]/10 pr-1 mt-1">
                  {importPendingProjects.map((p, i) => (
                    <div key={p.id || i} className="py-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[70%]">
                        <span className="font-mono font-bold text-[#FF5A00]">0{i + 1}</span>
                        <span className="font-bold text-[#14110F] truncate">{p.name}</span>
                        <span className="text-[11px] text-[#14110F]/50">({p.client || 'Client'})</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FFF4E6] rounded border border-[#14110F]/20">
                        {p.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import Mode Selection */}
              <div className="mt-5 flex flex-col gap-2.5">
                <span className="font-mono text-xs font-bold text-[#14110F]">
                  Select How to Apply this File:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setImportMode('replace')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
                      importMode === 'replace'
                        ? 'border-[#FF5A00] bg-[#FF5A00]/10 shadow-brutal-sm'
                        : 'border-[#14110F]/20 bg-white hover:border-[#14110F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="accent-[#FF5A00]"
                      />
                      <span className="font-display font-bold text-xs uppercase text-[#14110F]">
                        Replace All Works
                      </span>
                    </div>
                    <p className="font-space text-[11px] text-[#14110F]/70 pl-5">
                      Completely replaces existing works with this JSON file.
                    </p>
                  </label>

                  <label
                    onClick={() => setImportMode('merge')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
                      importMode === 'merge'
                        ? 'border-[#6B4DFF] bg-[#6B4DFF]/10 shadow-brutal-sm'
                        : 'border-[#14110F]/20 bg-white hover:border-[#14110F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="accent-[#6B4DFF]"
                      />
                      <span className="font-display font-bold text-xs uppercase text-[#14110F]">
                        Merge / Append
                      </span>
                    </div>
                    <p className="font-space text-[11px] text-[#14110F]/70 pl-5">
                      Keeps existing works and adds new ones from this JSON.
                    </p>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-[#14110F]/15">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#14110F] bg-white font-mono text-xs cursor-pointer hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={handleConfirmImport}
                  className="px-6 py-2.5 rounded-xl bg-[#14110F] text-white font-display font-bold text-xs uppercase tracking-wide border-2 border-[#14110F] shadow-brutal-sm hover:shadow-brutal hover:bg-[#FF5A00] cursor-pointer flex items-center gap-2"
                >
                  <Upload size={14} className={isImporting ? 'animate-spin' : ''} />
                  <span>{isImporting ? 'Importing & Syncing...' : `Confirm Import (${importPendingProjects.length} Works)`}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
