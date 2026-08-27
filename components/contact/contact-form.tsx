'use client';

import { useId, useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  if (submitted) {
    return (
      <div className="px-6 py-10 text-center font-mono text-accent-green-soft">
        <div className="text-3xl mb-3">✓</div>
        <div className="font-bold mb-1.5">pesan terkirim!</div>
        <div className="text-sm opacity-70">Terima kasih, saya akan balas secepatnya.</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="px-5 pt-5.5 pb-6.5 flex flex-col gap-3.5"
    >
      <div>
        <label htmlFor={nameId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          name --value
        </label>
        <input
          id={nameId}
          required
          type="text"
          placeholder="nama kamu"
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={emailId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          email --value
        </label>
        <input
          id={emailId}
          required
          type="email"
          placeholder="kamu@email.com"
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={messageId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          message --value
        </label>
        <textarea
          id={messageId}
          required
          placeholder="ceritakan proyek atau idemu..."
          rows={4}
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm resize-y font-sans"
        />
      </div>
      <button
        type="submit"
        className="mt-1 font-mono font-bold text-sm p-3 rounded-md border-none bg-accent-green text-ink cursor-pointer hover:brightness-105 transition"
      >
        ./kirim-pesan
      </button>
    </form>
  );
}
