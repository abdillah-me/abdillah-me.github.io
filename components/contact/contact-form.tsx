'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { data } from '@/lib/data';
import { buildMailtoHref } from '@/lib/build-mailto-href';

// The site is fully static, so there is no endpoint to post to. Rather than
// pretend a message was delivered, submitting hands the composed message to the
// visitor's own mail client. `onOpenMailClient` is injectable so tests can
// observe the handoff without jsdom attempting a real navigation.
export function ContactForm({
  onOpenMailClient = (href: string) => {
    window.location.href = href;
  },
}: {
  onOpenMailClient?: (href: string) => void;
} = {}) {
  const { profile } = data;
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [handedOff, setHandedOff] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  useEffect(() => {
    if (handedOff) statusRef.current?.focus();
  }, [handedOff]);

  const mailtoHref = buildMailtoHref({ to: profile.email, ...fields });

  if (handedOff) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="px-6 py-10 text-center font-mono text-accent-green-soft"
      >
        <div className="text-3xl mb-3">✓</div>
        <div className="font-bold mb-1.5">aplikasi email dibuka</div>
        <div className="text-sm opacity-70 leading-relaxed">
          Pesanmu sudah disiapkan di aplikasi email — tinggal tekan kirim di sana.
        </div>
        <a
          href={mailtoHref}
          className="inline-block mt-4 text-sm underline decoration-dotted underline-offset-4"
        >
          tidak terbuka? buka manual
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onOpenMailClient(mailtoHref);
        setHandedOff(true);
      }}
      className="px-5 pt-5.5 pb-6.5 flex flex-col gap-3.5"
    >
      <div>
        <label htmlFor={nameId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          name --value
        </label>
        <input
          id={nameId}
          name="name"
          required
          type="text"
          placeholder="nama kamu"
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={emailId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          email --value
        </label>
        <input
          id={emailId}
          name="email"
          required
          type="email"
          placeholder="kamu@email.com"
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
          className="w-full box-border px-3 py-2.5 rounded-md border-none bg-ink/60 text-cream text-sm"
        />
      </div>
      <div>
        <label htmlFor={messageId} className="font-mono text-xs text-accent-green-soft block mb-1.5">
          message --value
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          placeholder="ceritakan proyek atau idemu..."
          rows={4}
          value={fields.message}
          onChange={(e) => setFields({ ...fields, message: e.target.value })}
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
