import { useState, useRef } from "react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Привет! Я ваш AI-ассистент Teyra. Я могу помочь вам с анализом документов, ответами на вопросы о клиентах, созданием заметок и многим другим. Загрузите файл или задайте вопрос!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const avatarUrl = "/avatars/teyra-assistant.png";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);

    // Имитация ответа AI (здесь будет интеграция с GPT)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Я получил ваше сообщение${attachments.length > 0 ? ` и ${attachments.length} файл(ов)` : ''}. В будущем здесь будет интеграция с GPT для анализа и ответов.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть AI-ассистент Teyra"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,.9)",
          padding: 0,
          overflow: "hidden",
          background: "transparent",
          boxShadow: "0 10px 24px rgba(0,0,0,.25)",
          cursor: "pointer",
          zIndex: 50,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,.25)";
        }}
      >
        <img
          src={avatarUrl}
          alt="TEYRA AI Assistant"
          onError={(e) => {
            e.currentTarget.src = "/teyra-logo.png";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </button>
    );
  }

  return (
    <>
      {/* Затемненный фон */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setOpen(false)}
      />

      {/* Окно AI-ассистента */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "800px",
          height: "80%",
          maxHeight: "700px",
          background: "linear-gradient(135deg, #004AAD 0%, #0099FF 100%)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1001,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Заголовок */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
          }}
        >
          <img
            src={avatarUrl}
            alt="TEYRA AI Assistant"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255, 255, 255, 0.3)",
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "18px" }}>TEYRA AI Assistant</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Готов помочь с анализом и вопросами</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Закрыть AI-ассистент"
            style={{
              marginLeft: "auto",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Область сообщений */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                gap: 8,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px 16px",
                  borderRadius: message.type === 'user' ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: message.type === 'user' 
                    ? "rgba(255, 255, 255, 0.9)" 
                    : "rgba(255, 255, 255, 0.15)",
                  color: message.type === 'user' ? "#333" : "white",
                  fontSize: "14px",
                  lineHeight: 1.4,
                  wordWrap: "break-word",
                }}
              >
                {message.content}
              </div>
              
              {/* Вложения */}
              {message.attachments && message.attachments.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {message.attachments.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      📎 {file.name} ({formatFileSize(file.size)})
                    </div>
                  ))}
                </div>
              )}
              
              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.6,
                  color: "white",
                }}
              >
                {message.timestamp.toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {/* Индикатор печати */}
          {isTyping && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "white",
                opacity: 0.7,
              }}
            >
              <img
                src={avatarUrl}
                alt="TEYRA"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ fontSize: "14px" }}>AI печатает...</div>
              <div style={{ display: "flex", gap: 2 }}>
                <div style={{ width: 4, height: 4, background: "white", borderRadius: "50%", animation: "pulse 1.4s infinite" }} />
                <div style={{ width: 4, height: 4, background: "white", borderRadius: "50%", animation: "pulse 1.4s infinite 0.2s" }} />
                <div style={{ width: 4, height: 4, background: "white", borderRadius: "50%", animation: "pulse 1.4s infinite 0.4s" }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Область ввода */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "0 0 20px 20px",
          }}
        >
          {/* Вложения */}
          {attachments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {attachments.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    background: "#f0f0f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#333",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  📎 {file.name}
                  <button
                    onClick={() => removeAttachment(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: 0,
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff4444";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "#666";
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Форма ввода */}
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Задайте вопрос или опишите задачу..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "20px",
                  border: "2px solid #e0e0e0",
                  background: "white",
                  color: "#333",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0099FF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 153, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
            </div>
            
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: "12px",
                  borderRadius: "50%",
                  border: "2px solid #4ecdc4",
                  background: "white",
                  color: "#4ecdc4",
                  cursor: "pointer",
                  fontSize: "16px",
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(78, 205, 196, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4ecdc4";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "scale(1.05) rotate(-5deg)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(78, 205, 196, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#4ecdc4";
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(78, 205, 196, 0.2)";
                }}
                title="Прикрепить файл"
              >
                📎
              </button>
              
              <button
                type="submit"
                disabled={!inputValue.trim() && attachments.length === 0}
                style={{
                  padding: "12px",
                  borderRadius: "50%",
                  border: "none",
                  background: (!inputValue.trim() && attachments.length === 0) 
                    ? "#e0e0e0" 
                    : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  color: (!inputValue.trim() && attachments.length === 0) 
                    ? "#999" 
                    : "white",
                  cursor: (!inputValue.trim() && attachments.length === 0) ? "not-allowed" : "pointer",
                  fontSize: "18px",
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: (!inputValue.trim() && attachments.length === 0) 
                    ? "none" 
                    : "0 4px 15px rgba(255, 107, 107, 0.4)",
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim() || attachments.length > 0) {
                    e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.6)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (inputValue.trim() || attachments.length > 0) {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.4)";
                  }
                }}
                title="Отправить сообщение"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
