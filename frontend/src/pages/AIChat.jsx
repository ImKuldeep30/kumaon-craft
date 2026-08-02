import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { API_BASE_URL } from '../config';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Welcome to the full-screen Kumaon Craft Connect AI Concierge! I can answer wholesale procurement questions, list craft categories, explain shipment processes, or walk you through the artisan dashboard. Ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messageEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text || text.trim() === '') return;

    if (!textToSend) {
      setInput('');
    }

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      // Package conversation history (Gemini spec compliant, ignores welcome ai message)
      const chatHistory = messages
        .filter((_, idx) => idx > 0)
        .slice(-6)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessages((prev) => [...prev, { role: 'ai', content: result.reply }]);
      } else {
        setError(result.message || 'Failed to fetch response. Please try again.');
      }
    } catch (err) {
      setError('Cannot reach server. Verify that the backend service is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to a specific message index when clicked in the sidebar
  const scrollToMessage = (index) => {
    const element = document.getElementById(`msg-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief glow effect to highlight the target message bubble
      element.classList.add('ring-2', 'ring-primary-500', 'scale-[1.02]');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary-500', 'scale-[1.02]');
      }, 1500);
    }
  };

  // Extract all user prompts submitted during the current session
  const userPrompts = messages
    .map((msg, idx) => ({ ...msg, index: idx }))
    .filter((msg) => msg.role === 'user');

  const suggestedQuestions = [
    'Tell me about Almora copperware.',
    'What is Panchachuli Tweed?',
    'How do I register as a seller?',
    'What are wholesale shipping options?',
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 dark:bg-secondary-900 transition-theme">
      <Navbar />

      {/* Main Container taking up full-height viewport area under Navbar */}
      <div className="flex-grow flex h-[calc(100vh-80px)] overflow-hidden max-w-8xl mx-auto w-full border-x border-warm-200/50 dark:border-secondary-800/50">
        
        {/* LEFT SIDEBAR: Session Prompts History */}
        <aside className="w-80 bg-white/70 dark:bg-secondary-850/60 backdrop-blur-md border-r border-warm-200 dark:border-secondary-800 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-warm-200 dark:border-secondary-800">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-secondary-800 dark:text-warm-100 text-left flex items-center gap-2">
              <span>💬</span> Session Prompts
            </h3>
            <span className="text-[10px] text-secondary-500 dark:text-warm-400 block text-left mt-1 font-semibold uppercase tracking-wider">
              Click to jump to message
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {userPrompts.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-xs text-secondary-400 dark:text-warm-400 italic">
                  No prompts sent yet. Start typing to see your session logs.
                </p>
              </div>
            ) : (
              userPrompts.map((prompt) => (
                <button
                  key={prompt.index}
                  onClick={() => scrollToMessage(prompt.index)}
                  className="w-full text-left p-3 rounded-xl border border-warm-200 dark:border-secondary-750 bg-white dark:bg-secondary-800 hover:bg-warm-100 dark:hover:bg-secondary-700/60 hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-200 flex items-start gap-2.5 shadow-sm group cursor-pointer"
                >
                  <span className="text-xs mt-0.5">🏔️</span>
                  <p className="text-xs font-semibold text-secondary-700 dark:text-warm-200 line-clamp-2 leading-relaxed group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {prompt.content}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-warm-200 dark:border-secondary-800 text-center">
            <span className="text-[10px] font-bold tracking-wider text-secondary-500 dark:text-warm-400 uppercase">
              Kumaon Craft Connect v1.2
            </span>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex-1 flex flex-col justify-between bg-warm-50/30 dark:bg-secondary-900/10 overflow-hidden relative">
          
          {/* Scrollable Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {messages.map((msg, index) => (
                <div
                  key={index}
                  id={`msg-${index}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-300`}
                >
                  <div className={`flex items-start gap-3.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Avatar Icon */}
                    <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-warm-200 dark:bg-secondary-800 text-secondary-800 dark:text-warm-100 border border-warm-300 dark:border-secondary-700'
                    }`}>
                      {msg.role === 'user' ? '👤' : '🏔️'}
                    </div>

                    {/* Text Bubble */}
                    <div
                      className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed border transition-all duration-300 ${
                        msg.role === 'user'
                          ? 'bg-primary-500 text-white border-primary-600 rounded-tr-none shadow-sm text-left'
                          : 'bg-white dark:bg-secondary-850 text-secondary-800 dark:text-warm-100 border-warm-200 dark:border-secondary-750 rounded-tl-none shadow-sm text-left'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3.5 max-w-[85%]">
                    <div className="w-8.5 h-8.5 rounded-full bg-warm-200 dark:bg-secondary-800 text-secondary-800 dark:text-warm-100 border border-warm-300 dark:border-secondary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      🏔️
                    </div>
                    <div className="bg-white dark:bg-secondary-850 border border-warm-200 dark:border-secondary-750 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error indicator */}
              {error && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3.5 max-w-[85%] w-full">
                    <div className="w-8.5 h-8.5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ⚠️
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-2xl rounded-tl-none px-5 py-4 text-xs text-left shadow-sm space-y-2 w-full">
                      <p className="font-bold text-sm">Connection Refused</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick suggestions on empty conversation */}
              {messages.length === 1 && !isLoading && (
                <div className="space-y-3 pt-4 border-t border-warm-200/80 dark:border-secondary-800/80">
                  <span className="block text-xs uppercase tracking-wider font-bold text-secondary-500/85 dark:text-warm-400/85 text-left">
                    Explore craft options:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-xs text-left p-3.5 bg-white hover:bg-warm-100 border border-warm-200 dark:bg-secondary-850 dark:hover:bg-secondary-800 dark:border-secondary-750 text-secondary-700 dark:text-warm-200 rounded-xl cursor-pointer shadow-sm hover:shadow transition-all duration-200 hover:scale-[1.01]"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>
          </div>

          {/* Sticky Chat Input Footer */}
          <div className="p-4 bg-white dark:bg-secondary-850 border-t border-warm-200 dark:border-secondary-800 flex justify-center items-center">
            <div className="max-w-3xl w-full flex gap-3 items-center">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question about Himalayan crafts, orders, or platform..."
                disabled={isLoading}
                className="flex-1 resize-none bg-warm-50 dark:bg-secondary-900 border border-warm-200 dark:border-secondary-700 rounded-xl px-4 py-3 text-sm text-secondary-800 dark:text-warm-100 placeholder-secondary-400 dark:placeholder-warm-400 focus:outline-none focus:border-primary-400 dark:focus:border-primary-400 disabled:opacity-50 transition-theme"
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="h-[46px] w-[46px] flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white shadow-md cursor-pointer disabled:cursor-not-allowed transition-all duration-300 active:scale-95 focus:outline-none flex-shrink-0"
                aria-label="Send Message"
              >
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AIChat;
