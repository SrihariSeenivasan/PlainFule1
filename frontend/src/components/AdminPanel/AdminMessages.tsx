'use client';

import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCircle, Clock, Eye, X, Filter, RefreshCw, ChevronRight, User, Phone, Tag } from 'lucide-react';
import { contactAPI, ContactMessage } from '@/lib/api';

const FONT = "'Segoe UI', 'Roboto', sans-serif";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'REPLIED'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await contactAPI.getMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: ContactMessage['status']) => {
    try {
      await contactAPI.updateStatus(id, status);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactAPI.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && m.status === filter;
  });

  const getStatusStyle = (status: ContactMessage['status']) => {
    switch (status) {
      case 'UNREAD': return { bg: 'rgba(248,113,113,0.1)', color: '#f87171', icon: Clock, border: 'rgba(248,113,113,0.2)' };
      case 'READ': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: Eye, border: 'rgba(245,158,11,0.2)' };
      case 'REPLIED': return { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', icon: CheckCircle, border: 'rgba(74,222,128,0.2)' };
      case 'ARCHIVED': return { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', icon: Tag, border: 'rgba(156,163,175,0.2)' };
      default: return { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', icon: Clock, border: 'rgba(156,163,175,0.2)' };
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0f172a', color: '#e5e7eb',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
    fontFamily: FONT,
  };

  return (
    <div style={{ fontFamily: FONT, color: '#f3f4f6', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Inbox</p>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#f9fafb' }}>Messages</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Respond to your customers and manage inquiries</p>
        </div>
        <button 
          onClick={() => fetchMessages(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: '#1f2937', color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> 
          Refresh
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, minHeight: 'calc(100vh - 220px)', flexWrap: 'wrap' }}>
        {/* Sidebar List */}
        <div style={{ flex: '1 1 380px', maxWidth: 450, display: 'flex', flexDirection: 'column', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          {/* Controls */}
          <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
              <input 
                type="text" 
                placeholder="Search by name, email, subject..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ ...inp, paddingLeft: 40 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['ALL', 'UNREAD', 'READ', 'REPLIED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, 
                    border: '1px solid',
                    cursor: 'pointer', 
                    background: filter === f ? 'rgba(74,222,128,0.12)' : 'transparent',
                    borderColor: filter === f ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)',
                    color: filter === f ? '#4ade80' : '#6b7280',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scroll">
            {loading && messages.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: '#4b5563', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Loading messages...</span>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', color: '#4b5563' }}>No messages found</div>
            ) : (
              filteredMessages.map(m => {
                const style = getStatusStyle(m.status);
                const Icon = style.icon;
                const isSelected = selectedMessage?.id === m.id;
                return (
                  <div 
                    key={m.id}
                    onClick={() => {
                      setSelectedMessage(m);
                      if (m.status === 'UNREAD') handleUpdateStatus(m.id, 'READ');
                    }}
                    style={{
                      padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                      background: isSelected ? 'rgba(74,222,128,0.04)' : 'transparent',
                      borderLeft: isSelected ? '4px solid #4ade80' : '4px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#4ade80' : '#e5e7eb' }}>{m.name}</span>
                      <span style={{ fontSize: 10, color: '#4b5563' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || '(No Subject)'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                        <Icon size={10} /> {m.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Content */}
        <div style={{ flex: '2 1 500px', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedMessage ? (
            <>
              {/* Toolbar */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleUpdateStatus(selectedMessage.id, 'REPLIED')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#15803d', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <CheckCircle size={14} /> Mark Replied
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedMessage.id, 'ARCHIVED')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1f2937', color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    <Tag size={14} /> Archive
                  </button>
                </div>
                <button onClick={() => handleDelete(selectedMessage.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              {/* Content Area */}
              <div style={{ padding: 'clamp(20px, 5vw, 40px)', flex: 1, overflowY: 'auto' }} className="custom-scroll">
                <div style={{ display: 'flex', gap: 20, marginBottom: 40, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <User size={32} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em', color: '#f9fafb' }}>{selectedMessage.name}</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 13 }}>
                        <Mail size={14} style={{ color: '#4b5563' }} /> {selectedMessage.email}
                      </div>
                      {selectedMessage.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 13 }}>
                          <Phone size={14} style={{ color: '#4b5563' }} /> {selectedMessage.phone}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 13 }}>
                        <Clock size={14} style={{ color: '#4b5563' }} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 30 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Subject</p>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f3f4f6', marginBottom: 24 }}>{selectedMessage.subject || '(No Subject)'}</h4>
                  
                  <div style={{ background: '#0f172a', padding: '24px 28px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', minHeight: 180, fontSize: 15, lineHeight: 1.7, color: '#d1d5db', whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4b5563', textAlign: 'center', padding: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Mail size={32} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#9ca3af', margin: '0 0 8px' }}>No message selected</h3>
              <p style={{ maxWidth: 260, fontSize: 13 }}>Select an inquiry from the inbox to view details and response options.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
      `}</style>
    </div>
  );
}

