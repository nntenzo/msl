import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, getLocalizedContent } from '@/lib/i18n';
import { client, PageContent } from '@/lib/api';
import PriceDisplay from '@/components/PriceDisplay';
import GreenEnergyMeter from '@/components/GreenEnergyMeter';
import { ArrowRight, Shield, Leaf, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hhelqaahua/hero-banner-modern-pig-farm.png';

const Index: React.FC = () => {
  const { language, t } = useLanguage();
  const [pageContents, setPageContents] = useState<PageContent[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await client.entities.page_contents.query({
          query: { page_key: 'home' },
          sort: 'sort_order',
          limit: 20,
        });
        setPageContents(res.data?.items || []);
      } catch {
        // Use defaults
      }
    };
    loadContent();
  }, []);

  const getSection = (key: string) => pageContents.find((p) => p.section_key === key);

  const heroContent = getSection('hero');
  const introContent = getSection('intro');
  const missionContent = getSection('mission');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Myanmar Swine Livestock Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-800/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {heroContent ? getLocalizedContent(heroContent, language) : t('first_in_myanmar') + ' ' + t('gp_producer')}
            </h1>
            <p className="text-lg text-green-100 mb-8">
              {introContent
                ? getLocalizedContent(introContent, language).substring(0, 200) + '...'
                : t('protein_for_people')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  {t('our_products')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sustainability">
                <Button size="lg" variant="outline" className="!bg-transparent border-white text-white !hover:bg-transparent hover:border-green-300">
                  {t('sustainability')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-green-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
            <div>
              <div className="text-3xl font-bold">3,800+</div>
              <div className="text-green-200 text-sm">{t('annual_production')} ({t('pigs_per_year')})</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{t('first_in_myanmar')}</div>
              <div className="text-green-200 text-sm">{t('gp_producer')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{t('zero_grid')}</div>
              <div className="text-green-200 text-sm">{t('power_dependency')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('our_mission')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {missionContent ? getLocalizedContent(missionContent, language) : ''}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('food_security')}</h4>
                    <p className="text-sm text-gray-500">{t('protein_for_people')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('sustainability')}</h4>
                    <p className="text-sm text-gray-500">{t('zero_grid')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('first_in_myanmar')}</h4>
                    <p className="text-sm text-gray-500">{t('gp_producer')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hgckiaahuq/products-commercial-pigs.png"
                alt="Commercial Pigs"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pig Prices */}
      <PriceDisplay />

      {/* Green Energy Meter */}
      <GreenEnergyMeter />

      {/* CTA Section */}
      <section className="py-16 bg-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t('knowledge')}</h2>
          <p className="text-green-100 mb-8 text-lg">
            {language === 'my'
              ? 'ဝက်မွေးမြူရေးဆိုင်ရာ ဗဟုသုတများကို လေ့လာပါ'
              : language === 'zh'
              ? '了解养猪相关知识'
              : 'Explore our swine livestock knowledge resources'}
          </p>
          <Link to="/knowledge">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
              {t('learn_more')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;