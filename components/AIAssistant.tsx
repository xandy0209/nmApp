import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageCircle, MoreVertical, Trash2, Plus, ChevronLeft, Calendar, Pin, Edit2, AlertCircle, Mic, Paperclip, Image as ImageIcon, File as FileIcon, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  isPinned?: boolean;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [contextMenuSessionId, setContextMenuSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [isConfirmingDeleteId, setIsConfirmingDeleteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sorting sessions: Pinned first, then by updatedAt
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Convert string dates back to Date objects
        const hydrated = parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(hydrated);
      } catch (e) {
        console.error('Failed to load sessions', e);
      }
    }
  }, []);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll and focus input
  useEffect(() => {
    if (isOpen && view === 'chat') {
      scrollToBottom();
      
      // Multi-attempt focus for mobile browsers and animation delays
      const attempts = [50, 150, 400, 800];
      const timers = attempts.map(delay => 
        setTimeout(() => {
          if (chatInputRef.current && document.activeElement !== chatInputRef.current) {
            chatInputRef.current.focus();
            // On some mobile browsers, clicking/tapping is needed to show keyboard if focus() fails
            // select() can sometimes force the keyboard on iOS
            chatInputRef.current.setSelectionRange(
              chatInputRef.current.value.length, 
              chatInputRef.current.value.length
            );
          }
        }, delay)
      );

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isOpen, view]);

  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新记录 ' + (sessions.length + 1),
      messages: [],
      updatedAt: new Date(),
      isPinned: false
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setView('chat');
  };

  const sampleQuestions = [
    "查询呼和浩特的金牌客户信息",
    "查询209834专线的运行质量",
    "查询AAA的质差互联网专线",
    "查询20984736专线的时延"
  ];

  const handleSendMessage = async (textOverride?: string) => {
    const msgText = textOverride || inputValue;
    if (!msgText.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    const currentInputValue = msgText;
    if (!textOverride) setInputValue('');
    setAttachments([]);
    setIsLoading(true);

    // Update session title if it's the first message from user
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const updatedMessages = [...s.messages, userMessage];
        let newTitle = s.title;
        if (s.messages.length === 0) { // Only assistant welcome message was there
          newTitle = currentInputValue.slice(0, 15) + (currentInputValue.length > 15 ? '...' : '');
        }
        return {
          ...s,
          messages: updatedMessages,
          title: newTitle,
          updatedAt: new Date()
        };
      }
      return s;
    }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInputValue,
          history: activeSession?.messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
        }),
      });

      if (!response.ok) throw new Error('网络请求失败');
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
      };
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMessage],
            updatedAt: new Date()
          };
        }
        return s;
      }));
    } catch (error) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              role: 'assistant',
              content: '抱歉，系统繁忙，请稍后再试。',
              timestamp: new Date(),
            }],
            updatedAt: new Date()
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setIsConfirmingDeleteId(sessionId);
    setContextMenuSessionId(null);
  };

  const handleDeleteConfirm = () => {
    if (isConfirmingDeleteId) {
      setSessions(prev => prev.filter(s => s.id !== isConfirmingDeleteId));
      if (activeSessionId === isConfirmingDeleteId) {
        setActiveSessionId(null);
        setView('list');
      }
      setIsConfirmingDeleteId(null);
    }
  };

  const togglePin = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
    ));
    setContextMenuSessionId(null);
  };

  const startRenaming = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
    setContextMenuSessionId(null);
  };

  const saveRename = () => {
    if (editingSessionId && editTitle.trim()) {
      setSessions(prev => prev.map(s => 
        s.id === editingSessionId ? { ...s, title: editTitle.trim() } : s
      ));
    }
    setEditingSessionId(null);
  };

  const handleLongPress = (sessionId: string) => {
    setContextMenuSessionId(sessionId);
  };

  const onTouchStart = (sessionId: string) => {
    longPressTimerRef.current = setTimeout(() => handleLongPress(sessionId), 600);
  };

  const onTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleVoiceInput = () => {
    // In a real app, this would use Web Speech API
    // For now, we'll just toggle the UI state
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <>
      <style>{`
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content ul, .markdown-content ol { padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .markdown-content li { margin-bottom: 0.25rem; list-style-type: disc; }
        .markdown-content code { background: rgba(0,0,0,0.05); padding: 0.1rem 0.3rem; rounded: 0.25rem; font-family: monospace; }
        .markdown-content pre { background: rgba(0,0,0,0.05); padding: 0.5rem; rounded: 0.5rem; overflow-x: auto; margin: 0.5rem 0; }
      `}</style>
      {/* Floating Button */}
      <motion.button
        id="ai-assistant-trigger"
        drag="y"
        dragConstraints={{ top: -500, bottom: 50 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          // Small delay to ensure click event is blocked
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 100);
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!isDraggingRef.current) {
            setIsOpen(true);
          }
        }}
        className="absolute bottom-16 right-0 w-10 h-14 bg-[#2ea2e6] text-white rounded-l-2xl flex items-center justify-center shadow-[-4px_0_12px_rgba(46,162,230,0.3)] z-[100] border-y border-l border-white/30 touch-none"
      >
        <Bot size={20} />
      </motion.button>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 z-[110] flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="bg-[#2ea2e6] h-14 px-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {view === 'chat' && (
                    <button 
                      onClick={() => setView('list')}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h3 className="font-bold text-lg leading-tight">
                    {view === 'list' ? '政企智能助手' : '会话详情'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {view === 'list' && (
                    <button 
                      onClick={handleCreateSession}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-sm bg-white/10"
                    >
                      <Plus size={18} />
                      新建
                    </button>
                  )}
                  {view === 'list' && (
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors border-l border-white/20 ml-1"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {view === 'list' ? (
                /* Sessions List View */
                <div className="flex-1 overflow-y-auto bg-gray-50/50 relative">
                  {sessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={32} />
                      </div>
                      <p className="text-sm mb-6">暂无历史记录，开始新的探索吧</p>
                      <button 
                        onClick={handleCreateSession}
                        className="bg-[#2ea2e6] text-white px-6 py-2 rounded-xl text-sm font-medium shadow-lg active:scale-95 transition-all"
                      >
                        开启新对话
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {sortedSessions.map(session => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onTouchStart={() => onTouchStart(session.id)}
                          onTouchEnd={onTouchEnd}
                          onMouseDown={() => onTouchStart(session.id)}
                          onMouseUp={onTouchEnd}
                          onMouseLeave={onTouchEnd}
                          onClick={() => {
                            if (!contextMenuSessionId) {
                              setActiveSessionId(session.id);
                              setView('chat');
                            }
                          }}
                          className={`bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
                            session.isPinned ? 'border-amber-200 bg-amber-50/20' : 'border-gray-100'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {session.isPinned && <Pin size={12} className="text-amber-500 fill-amber-500" />}
                                <h4 className="font-medium text-gray-800 text-sm truncate pr-8">
                                  {session.title}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                                {session.messages[session.messages.length - 1]?.content.slice(0, 50)}...
                              </p>
                              <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-300">
                                <Calendar size={10} />
                                {session.updatedAt.toLocaleString()}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setContextMenuSessionId(session.id);
                              }}
                              className="p-2 text-gray-300 hover:text-[#2ea2e6] hover:bg-gray-50 rounded-lg transition-all"
                            >
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Context Menu Overlay */}
                  <AnimatePresence>
                    {contextMenuSessionId && (
                      <div className="absolute inset-x-0 bottom-0 top-0 z-[120] flex items-end justify-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setContextMenuSessionId(null)}
                          className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                        />
                        <motion.div
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          className="relative w-full bg-white rounded-t-3xl shadow-2xl p-6 space-y-1 z-[130]"
                        >
                          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">会话操作</p>
                          
                          <button 
                            onClick={() => togglePin(contextMenuSessionId)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all"
                          >
                            <span className="font-medium text-gray-700">
                              {sessions.find(s => s.id === contextMenuSessionId)?.isPinned ? '取消置顶' : '置顶会话'}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                              <Pin size={18} className={sessions.find(s => s.id === contextMenuSessionId)?.isPinned ? 'fill-amber-500' : ''} />
                            </div>
                          </button>

                          <button 
                            onClick={() => {
                              const s = sessions.find(s => s.id === contextMenuSessionId);
                              if (s) startRenaming(s);
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all"
                          >
                            <span className="font-medium text-gray-700">编辑名称</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                              <Edit2 size={18} />
                            </div>
                          </button>

                          <button 
                            onClick={() => deleteSession(contextMenuSessionId)}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-600 rounded-2xl transition-all"
                          >
                            <span className="font-medium">删除会话</span>
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                              <Trash2 size={18} />
                            </div>
                          </button>

                          <button 
                            onClick={() => setContextMenuSessionId(null)}
                            className="w-full p-4 mt-2 text-gray-400 font-medium hover:text-gray-600"
                          >
                            取消
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Rename Modal */}
                  <AnimatePresence>
                    {editingSessionId && (
                      <div className="absolute inset-0 z-[140] flex items-center justify-center p-6">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setEditingSessionId(null)}
                          className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl"
                        >
                          <h3 className="font-bold text-gray-800 mb-4">修改会话名称</h3>
                          <input 
                            autoFocus
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#2ea2e6] transition-all mb-4"
                          />
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setEditingSessionId(null)}
                              className="flex-1 py-2 text-gray-500 font-medium"
                            >
                              取 消
                            </button>
                            <button 
                              onClick={saveRename}
                              className="flex-1 py-2 bg-[#2ea2e6] text-white rounded-xl font-medium shadow-md active:scale-95 transition-all"
                            >
                              保 存
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Delete Confirmation Modal */}
                  <AnimatePresence>
                    {isConfirmingDeleteId && (
                      <div className="absolute inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsConfirmingDeleteId(null)}
                          className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl text-center"
                        >
                          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg mb-2">确定删除会话？</h3>
                          <p className="text-sm text-gray-400 mb-6">删除后，该会话的所有聊天记录将无法找回。</p>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setIsConfirmingDeleteId(null)}
                              className="flex-1 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                            >
                              取消
                            </button>
                            <button 
                              onClick={handleDeleteConfirm}
                              className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
                            >
                              确定删除
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Chat View */
                <>
                  {/* Messages Area / Welcome Screen */}
                  <div className="flex-1 overflow-y-auto bg-gray-50/80 flex flex-col">
                    {activeSession && activeSession.messages.length === 0 ? (
                      /* Welcome Screen */
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-800 text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-md w-full space-y-8"
                        >
                          <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-[#2ea2e6]">您好，吴军校</h2>
                            <p className="text-gray-600 leading-relaxed text-sm px-4">
                              我是中国移动政企业务信息查询助手。专注于集团客户信息、专线\企宽\千里眼\云视讯等业务信息以及相关业务运行数据、运行情况的精准查询及分析，通过高效检索帮助您快速获取客户业务信息及业务运行情况，是政企客户业务管理的轻量查询工具。
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-gray-400 text-xs font-medium text-left px-2">您可参照以下样例输入提问（用户提示词）：</p>
                            <div className="grid gap-3">
                              {sampleQuestions.map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSendMessage(q)}
                                  className="w-full text-left p-4 rounded-xl border border-gray-100 bg-white hover:bg-[#2ea2e6]/5 hover:border-[#2ea2e6]/30 transition-all text-sm font-medium shadow-sm"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      /* Chat Messages */
                      <div className="p-4 space-y-4 flex-1">
                        {activeSession?.messages.map((msg, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                          >
                            <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                msg.role === 'user' ? 'bg-[#2ea2e6] text-white' : 'bg-white border border-gray-200 text-gray-500'
                              }`}>
                                {msg.role === 'user' ? <MessageCircle size={12} /> : <Bot size={12} />}
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`max-w-[95%] p-3 rounded-2xl text-sm shadow-sm markdown-content ${
                              msg.role === 'user' 
                                ? 'bg-[#2ea2e6] text-white rounded-tr-none' 
                                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                            }`}>
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          </motion.div>
                        ))}
                        {isLoading && (
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center">
                                <Bot size={12} className="animate-pulse" />
                              </div>
                            </div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    {attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2 px-2">
                        {attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-xs text-gray-600">
                            {file.type.startsWith('image/') ? <ImageIcon size={14} /> : <FileIcon size={14} />}
                            <span className="max-w-[100px] truncate">{file.name}</span>
                            <button onClick={() => removeAttachment(i)} className="text-gray-400 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      onClick={() => {
                        chatInputRef.current?.focus();
                        setShowAttachmentMenu(false);
                      }}
                      className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 px-3 rounded-[28px] shadow-sm transition-all focus-within:border-[#2ea2e6] focus-within:ring-1 focus-within:ring-[#2ea2e6]/20 cursor-text relative"
                    >
                      <div className="relative">
                        <AnimatePresence>
                          {showAttachmentMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              className="absolute bottom-full left-0 mb-3 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 p-2 min-w-[120px] z-50 overflow-hidden"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (fileInputRef.current) {
                                    fileInputRef.current.accept = "image/*";
                                    fileInputRef.current.click();
                                  }
                                  setShowAttachmentMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm text-gray-700"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                                  <ImageIcon size={18} />
                                </div>
                                <span>图片</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (fileInputRef.current) {
                                    fileInputRef.current.accept = "*/*";
                                    fileInputRef.current.click();
                                  }
                                  setShowAttachmentMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors text-sm text-gray-700"
                              >
                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                                  <FileIcon size={18} />
                                </div>
                                <span>文件</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAttachmentMenu(!showAttachmentMenu);
                          }}
                          className={`p-2 rounded-full transition-colors flex-shrink-0 ${showAttachmentMenu ? 'text-[#2ea2e6] bg-blue-50' : 'text-gray-800 hover:bg-gray-100'}`}
                        >
                          <Paperclip size={24} strokeWidth={1.5} />
                        </button>
                      </div>

                      <input
                        ref={chatInputRef}
                        type="text"
                        inputMode="text"
                        autoCapitalize="off"
                        autoComplete="off"
                        autoFocus
                        enterKeyHint="send"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="发消息或按住说话..."
                        className="flex-1 bg-transparent border-none outline-none text-[15px] px-2 py-2 text-gray-700 placeholder-gray-400"
                      />

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVoiceInput();
                          }}
                          className={`p-1.5 border-2 rounded-full transition-all flex-shrink-0 ${
                            isListening 
                              ? 'border-[#2ea2e6] text-[#2ea2e6] bg-blue-50 animate-pulse' 
                              : 'border-gray-800 text-gray-800 hover:bg-gray-100'
                          }`}
                        >
                          <Mic size={18} strokeWidth={2} />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendMessage();
                          }}
                          disabled={!inputValue.trim() && attachments.length === 0}
                          className={`p-2 rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                            inputValue.trim() || attachments.length > 0
                              ? 'bg-[#2ea2e6] text-white shadow-md'
                              : 'text-gray-400'
                          }`}
                        >
                          <Send size={18} />
                        </button>
                      </div>

                      <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
