export default function SiteFooter({ variant = 'light' }) {
  const isDark = variant === 'dark';

  return (
    <footer className={`border-t ${isDark ? 'border-white/10 bg-black/10' : 'border-stone-200 bg-white/70 backdrop-blur'}`}>
      <div className={`mx-auto max-w-7xl px-4 py-4 text-center text-sm font-medium ${isDark ? 'text-white/80' : 'text-stone-500'}`}>
        Developed by Our Identity Group
      </div>
    </footer>
  );
}
