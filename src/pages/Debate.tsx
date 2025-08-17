import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { generateCloneResponse } from '@/utils/clone';

interface Message {
  sender: 'user' | 'clone';
  text: string;
}

export default function Debate() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    const cloneMsg: Message = { sender: 'clone', text: generateCloneResponse(input) };
    setMessages(prev => [...prev, userMsg, cloneMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto p-4">
        <div className="mb-4 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.sender === 'user' ? 'text-right' : 'text-left'}>
              <span className="inline-block rounded px-3 py-2 bg-secondary">
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
            placeholder="Argue with yourself..."
          />
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
