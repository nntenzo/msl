import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, Language } from '@/lib/i18n';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const langLabels: Record<Language, string> = {
  my: 'မြန်မာ',
  en: 'English',
  zh: '中文',
};

const Header: React.FC = () => {
  const { language, setLanguage, t, enabledLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const navItems = isHomePage
    ? [
        { href: '#home', label: t('home') },
        { href: '#products', label: t('products') },
        { href: '#sustainability', label: t('sustainability') },
        { href: '#knowledge', label: t('knowledge') },
        { href: '#contact', label: t('contact') },
      ]
    : [
        { href: '/', label: t('home') },
        { href: '/#products', label: t('products') },
        { href: '/#sustainability', label: t('sustainability') },
        { href: '/#knowledge', label: t('knowledge') },
        { href: '/#contact', label: t('contact') },
      ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MSL</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-green-800 text-sm leading-tight block">Myanmar Swine</span>
              <span className="text-xs text-gray-500 leading-tight block">Livestock Co., Ltd.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">{langLabels[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {enabledLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={language === lang ? 'bg-green-50' : ''}
                  >
                    {langLabels[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-gray-500 text-xs">
                {t('admin')}
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {enabledLanguages.map((lang) => (
                  <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)}>
                    {langLabels[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block py-2 px-3 rounded text-sm text-gray-700 hover:bg-green-50"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded text-sm text-gray-700 hover:bg-green-50"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded text-sm text-gray-500"
            >
              {t('admin')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;