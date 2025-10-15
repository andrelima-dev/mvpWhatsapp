'use client';

import { useEffect, useState } from 'react';
import api from '@/services/apiClient';
import type { ConversationDto, MessageDto } from '@/types/chat';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useConversationSocket } from '@/hooks/useConversationSocket';
import { useSessionStore } from '@/stores/sessionStore';

export default function DashboardPage() {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    const loadConversations = async () => {
      const { data } = await api.get('/conversations');
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    };

    loadConversations().catch(console.error);
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      const { data } = await api.get(`/conversations/${selectedConversation.id}/messages`);
      setMessages(data);
    };
    loadMessages().catch(console.error);
  }, [selectedConversation]);

  const { sendMessage } = useConversationSocket({
    conversationId: selectedConversation?.id ?? '',
    onNewMessage: (message: MessageDto) => {
      setMessages(prev => (prev.some(item => item.id === message.id) ? prev : [...prev, message]));
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;
    sendMessage(content);
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[320px_1fr]">
      <aside className="border-r border-slate-200 bg-white">
        <header className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Conectado como</p>
            <p className="text-base font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </header>
        <nav className="flex flex-col">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              className={`flex flex-col gap-1 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedConversation?.id === conversation.id ? 'bg-slate-100' : ''}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <span className="text-sm font-semibold text-slate-900">{conversation.clientName}</span>
              <span className="text-xs text-slate-500">
                {conversation.level} • {conversation.unreadCount} novas
              </span>
              <span className="line-clamp-1 text-xs text-slate-400">
                {conversation.lastMessage?.content ?? 'Sem mensagens'}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex flex-col bg-slate-50">
        <header className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedConversation?.clientName ?? 'Selecione uma conversa'}
            </h2>
            <p className="text-xs text-slate-500">
              {selectedConversation?.clientPhone ?? ''}
            </p>
          </div>
        </header>

        {selectedConversation ? (
          <div className="flex flex-1 flex-col">
            <ChatWindow messages={messages} currentUserId={user?.id ?? ''} />
            <footer className="border-t border-slate-200 bg-white p-4">
              <form
                onSubmit={event => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const content = String(formData.get('message') ?? '').trim();
                  if (content) {
                    handleSendMessage(content);
                    event.currentTarget.reset();
                  }
                }}
                className="flex gap-3"
              >
                <input
                  name="message"
                  placeholder="Digite uma mensagem"
                  className="flex-1 rounded-md border border-slate-200 p-3 focus:border-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-slate-900 px-6 py-2 text-white hover:bg-slate-700"
                >
                  Enviar
                </button>
              </form>
            </footer>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-slate-500">
            Selecione uma conversa para começar o atendimento.
          </div>
        )}
      </section>
    </main>
  );
}
