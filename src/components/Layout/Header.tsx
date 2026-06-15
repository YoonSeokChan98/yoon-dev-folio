import { useEffect, useState } from 'react';

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Proposal', href: '#proposal' },
  { label: 'Contact', href: '#contact' },
];

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${
        scrolled
          ? 'bg-[#f5f5f0]/85 backdrop-blur-xl border-b border-slate-200/60'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-black tracking-tighter text-[#1a1a2e] hover:text-indigo-600 transition-colors">
          YOON.LOG
        </a>
        <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-[#1a1a2e] transition-colors">
              {item.label}
            </a>
          ))}
          <a
            href="mailto:shift71895@gmail.com"
            className="px-4 py-2 rounded-full bg-[#1a1a2e] text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
