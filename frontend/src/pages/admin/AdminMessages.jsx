import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, AlertCircle, X, Reply, MailCheck } from 'lucide-react';
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
        setNotification({ type: 'success', message: 'Message deleted.' });
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
      await messageAPI.toggleRead(msg._id, true);
      fetchMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Messages</h1>
        <p className="text-xs text-zinc-500 mt-1">Inquiries received via the contact form</p>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Messages List */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-400">
            No messages yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                  !msg.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div
                  onClick={() => openMessageModal(msg)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                      {msg.name}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      &lt;{msg.email}&gt;
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 ml-auto">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">
                    {msg.subject}
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                    title="Reply via Email"
                  >
                    <Reply className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg._id, msg.read)}
                    type="button"
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      msg.read
                        ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600'
                        : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    }`}
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <MailCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    type="button"
                    className="p-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedMsg(null)}
              type="button"
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span className="font-mono text-xs text-blue-600">Message</span>
              <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white mt-1">
                {selectedMsg.subject}
              </h3>
              <div className="mt-2 text-xs text-zinc-500 space-y-0.5">
                <p>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">From: </span>
                  {selectedMsg.name} ({selectedMsg.email})
                </p>
                <p>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Date: </span>
                  {new Date(selectedMsg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto mb-6">
              {selectedMsg.message}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
              >
                <Reply className="w-4 h-4" />
                <span>Reply to Sender</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
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
