import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Eye, MailCheck, AlertCircle, X, Reply } from 'lucide-react';
import { messageAPI } from '../../services/api';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await messageAPI.getAll();
      if (res.data?.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to fetch messages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await messageAPI.toggleRead(id, !currentRead);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await messageAPI.delete(id);
        setNotification({ type: 'success', message: 'Message deleted successfully!' });
        if (selectedMsg?._id === id) setSelectedMsg(null);
        fetchMessages();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete message.' });
      }
    }
  };

  const openMessageModal = async (msg) => {
    setSelectedMsg(msg);
    if (!msg.read) {
      // Mark as read automatically when opening
      await messageAPI.toggleRead(msg._id, true);
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Contact Messages Inbox</h1>
          <p className="text-xs text-slate-500">Inquiries and messages received via the public contact form</p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Messages List */}
      <div className="rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400">
            Loading inquiries...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400">
            No contact messages received yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 ${
                  !msg.read ? 'bg-aurora-cyan/5' : ''
                }`}
              >
                <div
                  onClick={() => openMessageModal(msg)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                    )}
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {msg.name}
                    </span>
                    <span className="font-mono text-xs text-aurora-cyan">
                      &lt;{msg.email}&gt;
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 ml-auto sm:ml-2">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-aurora-cyan text-slate-600 dark:text-slate-400 hover:text-aurora-cyan"
                    title="Reply via Email"
                  >
                    <Reply className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg._id, msg.read)}
                    type="button"
                    className={`p-2 rounded-lg border text-xs ${
                      msg.read
                        ? 'border-slate-200 dark:border-white/10 text-slate-400'
                        : 'border-aurora-cyan/40 bg-aurora-cyan/10 text-aurora-cyan'
                    }`}
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <MailCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    type="button"
                    className="p-2 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-nebula-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedMsg(null)}
              type="button"
              className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-nebula-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-4 border-b border-slate-100 dark:border-white/10">
              <span className="font-mono text-xs text-aurora-cyan">Inquiry Details</span>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1">
                {selectedMsg.subject}
              </h3>
              <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">From:</strong> {selectedMsg.name} ({selectedMsg.email})
                </p>
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Date:</strong> {new Date(selectedMsg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto mb-6">
              {selectedMsg.message}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-aurora-cyan hover:opacity-90 transition-opacity"
              >
                <Reply className="w-4 h-4" />
                <span>Reply to Sender</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
