'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.js';
import type { MessageDto } from '@/types/chat';

interface ChatWindowProps {
  messages: MessageDto[];
  currentUserId: string;
}

export function ChatWindow({ messages, currentUserId }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex h-full flex-1 flex-col gap-3 overflow-y-auto p-6">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
