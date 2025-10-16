// src/components/ContactDock.jsx
export default function ContactDock() {
  const items = [
    { key: "wa", label: "WA", href: "https://wa.me/51983454837" },
    { key: "tg", label: "TG", href: "https://t.me/kidstore.peru" },
    { key: "fb", label: "FB", href: "https://www.facebook.com/kidstore.gg" },
    { key: "dc", label: "DC", href: "https://discord.gg/kidstore" },
  ];

  return (
    <div className="fixed right-3 md:right-4 bottom-4 z-50 flex flex-col gap-2">
      {items.map((b) => (
        <a
          key={b.key}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-white/10 hover:bg-white/20 text-white rounded-full
            w-10 h-10 flex items-center justify-center
            border border-white/15 shadow-lg backdrop-blur
          "
          title={b.label}
        >
          <span className="text-xs font-semibold">{b.label}</span>
        </a>
      ))}
    </div>
  );
}
