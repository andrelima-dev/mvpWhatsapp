'use client';

import clsx from 'clsx';
import type { MessageDto } from '@/types/chat';

interface MessageBubbleProps {
  message: MessageDto;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isMine = message.senderType === 'AGENT' && message.senderId === currentUserId;

  return (
    <div className={clsx('flex w-full flex-col', isMine ? 'items-end' : 'items-start')}>
      <div
        className={clsx(
          'max-w-[75%] rounded-lg px-4 py-2 text-sm shadow-sm',
          isMine ? 'bg-slate-900 text-white' : 'bg-white text-slate-800',
        )}
      >
        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
        <span className="mt-2 block text-xs text-slate-400">
          {message.senderLabel} • {new Date(message.sentAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
