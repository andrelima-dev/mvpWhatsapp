'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSessionStore } from '@/stores/sessionStore';
import type { MessageDto } from '@/types/chat';

interface UseConversationSocketOptions {
  conversationId: string;
  onNewMessage?: (message: MessageDto) => void;
  onTyping?: (payload: { agentName: string; active: boolean }) => void;
}

export function useConversationSocket({ conversationId, onNewMessage, onTyping }: UseConversationSocketOptions) {
  const { accessToken } = useSessionStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3333/ws/conversations', {
      transports: ['websocket'],
      auth: { token: accessToken },
    });

    socket.emit('conversation.join', { conversationId });

    socket.on('message.new', message => {
      onNewMessage?.(message);
    });

    socket.on('typing.update', payload => {
      onTyping?.(payload);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [conversationId, accessToken, onNewMessage, onTyping]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current) return;
      socketRef.current.emit('message.send', { conversationId, content });
    },
    [conversationId],
  );

  const notifyTyping = useCallback(
    (active: boolean) => {
      if (!socketRef.current) return;
      socketRef.current.emit('typing', { conversationId, active });
    },
    [conversationId],
  );

  return useMemo(
    () => ({
      sendMessage,
      notifyTyping,
    }),
    [sendMessage, notifyTyping],
  );
}
