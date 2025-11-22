
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Phone, User } from 'lucide-react';
import { ChatMessage, UserRole } from '../../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentUserRole: UserRole;
  otherUserName: string;
  otherUserAvatar?: string;
  onSend: (text: string) => void;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUserRole,
  otherUserName,
  otherUserAvatar,
  onSend,
  onClose
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white md:relative md:h-[600px] md:w-96 md:rounded-2xl md:shadow-2xl flex flex-col animate-slide-up">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-green-500 overflow-hidden flex items-center justify-center">
                {otherUserAvatar ? (
                    <img src={otherUserAvatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                    <User size={20} />
                )}
            </div>
            <div>
                <h3 className="font-bold text-sm">{otherUserName}</h3>
                <span className="text-green-400 text-xs font-bold flex items-center">● Online</span>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-green-600 transition-colors">
                <Phone size={18} />
            </button>
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 bg-slate-50 space-y-4">
        <div className="text-center text-xs text-gray-400 my-4">
            Chat is encrypted and monitored for safety.
        </div>
        
        {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
                <p>Send a message to start the conversation.</p>
            </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderRole === currentUserRole;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 mt-2 flex-shrink-0 overflow-hidden">
                         {otherUserAvatar && <img src={otherUserAvatar} className="w-full h-full object-cover"/>}
                    </div>
                )}
                <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                    isMe
                        ? 'bg-black text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                    }`}
                >
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow bg-gray-100 text-gray-900 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-black transition-all"
        />
        <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-green-500 text-black p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 hover:scale-105 transition-all shadow-lg"
        >
          <Send size={20} className="ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
