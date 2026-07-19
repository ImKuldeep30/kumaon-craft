import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Greetings! I am your Kumaon Craft Connect AI Assistant. How can I help you learn about our heritage crafts, wholesale orders, or platform dashboard today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messageEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat list on new messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text || text.trim() === '') return;

    // Clear input if sending from type box
    if (!textToSend) {
      setInput('');
    }

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      // Filter out the initial local welcome message to ensure history starts with a user query as required by Gemini API specs
      const chatHistory = messages
        .filter((_, idx) => idx > 0)
        .slice(-6)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch('http://localhost:5000/api/ai/chat', {
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
        setError(result.message || 'Failed to fetch AI response. Please try again.');
      }
    } catch (err) {
      setError('Cannot reach server. Make sure the backend service is running.');
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

  const sampleQuestions = [
    'Tell me about Almora copperware.',
    'What is Panchachuli Tweed?',
    'How do I register as a seller?',
    'What are wholesale shipping options?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans transition-theme">
      {/* 1. Chat Bubble Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-primary-400/20"
          aria-label="Open Chatbot"
        >
          {/* Chat Icon SVG */}
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {/* Unread dot indicator */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
        </button>
      )}

      {/* 2. Expanded Chat Card (Visible when open) */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-white/95 dark:bg-secondary-800/95 backdrop-blur-md border border-warm-200 dark:border-secondary-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-primary-500 dark:bg-secondary-900 px-4 py-3.5 flex justify-between items-center text-white border-b border-primary-600/20 dark:border-secondary-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-base">
                🏔️
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm font-bold tracking-wide">Kumaon Craft AI</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] tracking-wide text-white/80 font-semibold uppercase">Concierge</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Close Chat"
            >
              {/* Close Icon SVG */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-50/40 dark:bg-secondary-900/10">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none shadow-sm'
                      : 'bg-warm-100 dark:bg-secondary-800 text-secondary-800 dark:text-warm-100 rounded-bl-none border border-warm-200/50 dark:border-secondary-700/50 shadow-sm'
                  } transition-theme`}
                >
                  <p className="leading-relaxed text-left whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-warm-100 dark:bg-secondary-800 border border-warm-200/50 dark:border-secondary-700/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-warm-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-left shadow-sm space-y-2 w-[85%]">
                  <p className="font-semibold">⚠️ Connection Failure</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <span className="block text-[10px] uppercase tracking-wider font-bold text-secondary-500/80 dark:text-warm-400/80 text-left">
                  Suggested Queries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-xs text-left px-3 py-1.5 bg-white hover:bg-warm-100 border border-warm-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:border-secondary-700 text-secondary-700 dark:text-warm-200 rounded-lg cursor-pointer transition-all duration-200 hover:scale-102"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 bg-white dark:bg-secondary-800 border-t border-warm-200 dark:border-secondary-700/80 flex gap-2 items-center">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 resize-none bg-warm-50 dark:bg-secondary-900 border border-warm-200 dark:border-secondary-700 rounded-xl px-3 py-2 text-sm text-secondary-800 dark:text-warm-100 placeholder-secondary-400 dark:placeholder-warm-400 focus:outline-none focus:border-primary-400 dark:focus:border-primary-400 disabled:opacity-50 transition-theme"
              style={{ maxHeight: '60px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="h-[38px] w-[38px] flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white shadow-md cursor-pointer disabled:cursor-not-allowed transition-all duration-300 active:scale-95 focus:outline-none flex-shrink-0"
              aria-label="Send Message"
            >
              {/* Send Icon SVG */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
