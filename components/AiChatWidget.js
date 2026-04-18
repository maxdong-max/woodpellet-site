import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

const translations = {
  en: {
    title: 'AI Assistant',
    placeholder: 'Ask about products, prices, delivery...',
    send: 'Send',
    thinking: 'Thinking...'
  },
  zh: {
    title: '智能客服',
    placeholder: '咨询产品、价格、物流...',
    send: '发送',
    thinking: '思考中...'
  },
  id: {
    title: 'Asisten AI',
    placeholder: 'Tanyakan produk, harga, pengiriman...',
    send: 'Kirim',
    thinking: 'Memikirkan...'
  }
};

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  // 检测语言
  useEffect(() => {
    const browserLang = navigator.language?.split('-')[0] || 'en';
    if (['en', 'zh', 'id'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  // 初始欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const t = translations[language];
      setMessages([{
        type: 'system',
        content: language === 'zh' 
          ? '您好！我是Macreat智能助手，请问有什么可以帮您？' 
          : language === 'id'
          ? 'Halo! Saya asisten Macreat. Ada yang bisa saya bantu?'
          : 'Hello! I\'m Macreat AI assistant. How can I help you?'
      }]);
    }
  }, [isOpen, language]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          language 
        })
      });
      
      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { type: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { type: 'system', content: 'Sorry, something went wrong. Please try again.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'system', content: 'Connection error. Please try again.' }]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const t = translations[language];

  return (
    <>
      {/* 悬浮按钮 */}
      <button 
        className="ai-chat-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
          zIndex: 9999,
          transition: 'transform 0.3s'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          height: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* 头部 */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={20} />
              <span style={{ fontWeight: '600' }}>{t.title}</span>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="id">ID</option>
            </select>
          </div>

          {/* 消息列表 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.type === 'user' ? '#4f46e5' : '#f3f4f6',
                  color: msg.type === 'user' ? 'white' : '#1a1a2e',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                background: '#f3f4f6',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                {t.thinking} <Loader size={14} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.placeholder}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '24px',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: input.trim() && !loading ? '#4f46e5' : '#9ca3af',
                border: 'none',
                color: 'white',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}