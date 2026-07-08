import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const TypingIndicator = () => (
    <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <Bot size={14} className="text-green-600" />
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    </div>
);

const Message = ({ msg }) => {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-start gap-2 px-4 py-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-green-600' : 'bg-green-100'}`}>
                {isUser
                    ? <User size={14} className="text-white" />
                    : <Bot size={14} className="text-green-600" />
                }
            </div>
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser
                    ? 'bg-green-600 text-white rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}>
                {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

const WELCOME_MESSAGE = {
    role: 'model',
    content: `👋 Hi! I'm your **PantryPro Assistant**.\n\nI can help you with:\n- Checking stock levels\n- Finding low stock items\n- Searching for specific items\n- Inventory summaries\n- Category breakdowns\n\nWhat would you like to know?`,
};

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const allMessages = messages.filter((m) => m.role === 'user' || m.role === 'model');

            const firstUserIndex = allMessages.findIndex((m) => m.role === 'user');
            const history = firstUserIndex === -1
                ? []
                : allMessages.slice(firstUserIndex);

            const { data } = await api.post('/chat', {
                message: text,
                history,
            });

            setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.message || 'Unknown error';
            setMessages((prev) => [
                ...prev,
                {
                    role: 'model',
                    content: `Sorry, I ran into an error: **${errMsg}**. Please try again.`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickPrompts = [
        'Give me a summary',
        'What needs restocking?',
        'Low stock items',
    ];

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
                {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] bg-gray-50 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">PantryPro Assistant</p>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                                Online
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-auto text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto py-3">
                        {messages.map((msg, i) => (
                            <Message key={i} msg={msg} />
                        ))}
                        {loading && <TypingIndicator />}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick prompts */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex gap-2 flex-wrap">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => {
                                        setInput(prompt);
                                        inputRef.current?.focus();
                                    }}
                                    className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full hover:bg-green-100 transition"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your inventory..."
                            rows={1}
                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 max-h-28 overflow-y-auto"
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-9 h-9 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shrink-0"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatAssistant;