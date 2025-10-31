'use client';

import { useCallback, useRef, useState } from 'react';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setLoading(true);

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(nextMessages);
    setInput('');

    try {
      // If user asks for a quote (명언 조회), call our API and show it directly
      if (trimmed.includes('명언 조회')) {
        const quoteRes = await fetch('/api/famoussaying');
        if (!quoteRes.ok) {
          throw new Error(`Failed to fetch quote: ${quoteRes.status}`);
        }
        const quoteData = await quoteRes.json();
        const text = quoteData?.contents || quoteData?.content || '';
        const name = quoteData?.name ? ` — ${quoteData.name}` : '';
        const display = text ? `${text}${name}` : '명언을 가져오지 못했습니다.';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: display },
        ]);
        return;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, model: 'gpt-4o-mini' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      const assistantReply: string = data?.choices?.[0]?.message?.content || '';
      if (assistantReply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantReply },
        ]);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${message}` },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4">GPT Chat</h1>
          <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto bg-white">
            {messages
              .filter((m) => m.role !== 'system')
              .map((m, idx) => (
                <div
                  key={idx}
                  className={m.role === 'user' ? 'text-right mb-3' : 'text-left mb-3'}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'inline-block bg-blue-600 text-white px-3 py-2 rounded-lg'
                        : 'inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg'
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            {loading && (
              <div className="text-left text-gray-500">Thinking…</div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message and press Enter"
              className="flex-1 border rounded-lg px-3 py-2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
