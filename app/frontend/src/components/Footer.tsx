import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold text-lg">MS</span>
              </div>
              <span className="font-bold text-lg">Myanmar Swine Livestock</span>
            </div>
            <p className="text-green-200 text-sm">
              {t('first_in_myanmar')} {t('gp_producer')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-green-200 hover:text-white text-sm">{t('home')}</Link>
              <Link to="/products" className="block text-green-200 hover:text-white text-sm">{t('products')}</Link>
              <Link to="/sustainability" className="block text-green-200 hover:text-white text-sm">{t('sustainability')}</Link>
              <Link to="/knowledge" className="block text-green-200 hover:text-white text-sm">{t('knowledge')}</Link>
              <Link to="/contact" className="block text-green-200 hover:text-white text-sm">{t('contact')}</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-green-200 text-sm">
              <p>+95 9 123 456 789</p>
              <p>info@myanmarswine.com</p>
              <p>Industrial Zone, Yangon Region, Myanmar</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-300 text-sm">
          <p>© 2024 Myanmar Swine Livestock Co., Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;