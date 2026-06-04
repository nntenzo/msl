import React, { useState, useEffect } from 'react';
import { useLanguage, getLocalizedContent } from '@/lib/i18n';
import { client, PageContent } from '@/lib/api';
import GreenEnergyMeter from '@/components/GreenEnergyMeter';
import { Sun, Flame, Wind, Shield } from 'lucide-react';

const SOLAR_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hewhqaahwq/sustainability-solar-biogas.png';
const BIOSECURITY_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3he26iaahvq/biosecurity-entrance-station.png';

const Sustainability: React.FC = () => {
  const { language, t } = useLanguage();
  const [sections, setSections] = useState<PageContent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.entities.page_contents.query({
          query: { page_key: 'sustainability' },
          sort: 'sort_order',
          limit: 20,
        });
        setSections(res.data?.items || []);
      } catch {
        // defaults
      }
    };
    load();
  }, []);

  const getSection = (key: string) => sections.find((s) => s.section_key === key);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[300px] overflow-hidden">
        <img src={SOLAR_IMAGE} alt="Sustainability" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{t('sustainability')}</h1>
        </div>
      </section>

      {/* Green Energy Meter */}
      <GreenEnergyMeter />

      {/* Solar Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sun className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဆိုလာစွမ်းအင်စနစ်' : language === 'zh' ? '太阳能系统' : 'Solar Energy System'}
                </h2>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSection('solar')
                  ? getLocalizedContent(getSection('solar')!, language).replace(/^## .+\n\n/, '')
                  : 'Our farm operates a comprehensive solar panel installation that generates clean electricity for daily operations.'}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={SOLAR_IMAGE} alt="Solar Panels" className="w-full h-72 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Biogas Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 text-center">
              <Flame className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800">Biogas Generation</h3>
              <p className="text-gray-600 mt-2">Converting waste into clean energy</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-xs text-gray-500">Power Supply</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">0%</div>
                  <div className="text-xs text-gray-500">Waste to Landfill</div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဇီဝဓာတ်ငွေ့ ထုတ်လုပ်ခြင်း' : language === 'zh' ? '沼气发电' : 'Biogas Generation'}
                </h2>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSection('biogas')
                  ? getLocalizedContent(getSection('biogas')!, language).replace(/^## .+\n\n/, '')
                  : 'We convert pig waste into valuable biogas through anaerobic digestion.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Odor Management */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wind className="h-8 w-8 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'my' ? 'အနံ့စီမံခန့်ခွဲမှု' : language === 'zh' ? '气味管理' : 'Odor Management'}
              </h2>
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed whitespace-pre-line">
            {getSection('odor')
              ? getLocalizedContent(getSection('odor')!, language).replace(/^## .+\n\n/, '')
              : 'We employ advanced odor control technologies to ensure our farm is a good neighbor.'}
          </div>
        </div>
      </section>

      {/* Biosecurity */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဇီဝလုံခြုံရေး ထူးချွန်မှု' : language === 'zh' ? '卓越的生物安全' : 'Biosecurity Excellence'}
                </h2>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSection('biosecurity')
                  ? getLocalizedContent(getSection('biosecurity')!, language).replace(/^## .+\n\n/, '')
                  : 'Biosecurity is the cornerstone of our operations. We implement multi-layered protection.'}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={BIOSECURITY_IMAGE} alt="Biosecurity" className="w-full h-72 object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;