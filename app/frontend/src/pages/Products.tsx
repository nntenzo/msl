import React, { useState, useEffect } from 'react';
import { useLanguage, getLocalizedContent } from '@/lib/i18n';
import { client, PageContent } from '@/lib/api';
import { CheckCircle } from 'lucide-react';

const PRODUCTS_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hgckiaahuq/products-commercial-pigs.png';

const Products: React.FC = () => {
  const { language, t } = useLanguage();
  const [sections, setSections] = useState<PageContent[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.entities.page_contents.query({
          query: { page_key: 'products' },
          sort: 'sort_order',
          limit: 20,
        });
        setSections(res.data?.items || []);
      } catch {
        // Use defaults
      }
    };
    load();
  }, []);

  const getSection = (key: string) => sections.find((s) => s.section_key === key);

  const gpFeatures = [
    { en: 'Superior growth rates and feed efficiency', my: 'ထူးချွန်သော ကြီးထွားမှုနှုန်းနှင့် အစာကျွေးရေးထိရောက်မှု', zh: '优越的生长速度和饲料效率' },
    { en: 'Excellent reproductive performance', my: 'ထူးချွန်သော မျိုးပွားစွမ်းဆောင်ရည်', zh: '出色的繁殖性能' },
    { en: 'Disease resistance and robustness', my: 'ရောဂါခံနိုင်ရည်နှင့် ခိုင်မာမှု', zh: '抗病性和健壮性' },
    { en: 'Optimal carcass quality', my: 'အကောင်းဆုံး အသားအရည်အသွေး', zh: '最佳胴体品质' },
  ];

  const psFeatures = [
    { en: 'High litter sizes (12-14 piglets born alive)', my: 'မွေးဖွားမှုနှုန်းမြင့် (၁၂-၁၄ ကောင်)', zh: '高产仔数（12-14头活产仔猪）' },
    { en: 'Excellent mothering ability', my: 'ထူးချွန်သော မိခင်စောင့်ရှောက်မှုစွမ်းရည်', zh: '出色的母性能力' },
    { en: 'Strong milking capacity', my: 'နို့ထွက်နှုန်းမြင့်', zh: '强大的泌乳能力' },
    { en: 'Consistent performance across environments', my: 'ပတ်ဝန်းကျင်အမျိုးမျိုးတွင် တသမတ်တည်း စွမ်းဆောင်ရည်', zh: '在各种环境中表现稳定' },
  ];

  const commercialFeatures = [
    { en: 'Fast growth (market weight in 150-170 days)', my: 'မြန်ဆန်သော ကြီးထွားမှု (ရက် ၁၅၀-၁၇၀ တွင် ဈေးကွက်အလေးချိန်)', zh: '快速生长（150-170天达到上市体重）' },
    { en: 'Excellent feed conversion (2.5-2.8 FCR)', my: 'ထူးချွန်သော အစာပြောင်းလဲမှု (FCR 2.5-2.8)', zh: '出色的饲料转化率（2.5-2.8 FCR）' },
    { en: 'Lean, high-quality carcasses', my: 'အဆီနည်း၊ အရည်အသွေးမြင့် အသား', zh: '瘦肉型、高品质胴体' },
    { en: 'Full traceability from birth to market', my: 'မွေးဖွားမှုမှ ဈေးကွက်အထိ ခြေရာခံနိုင်မှု', zh: '从出生到上市的全程可追溯' },
  ];

  const getFeatureText = (feature: { en: string; my: string; zh: string }) => {
    if (language === 'my') return feature.my;
    if (language === 'zh') return feature.zh;
    return feature.en;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[300px] overflow-hidden">
        <img src={PRODUCTS_IMAGE} alt="Products" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{t('our_products')}</h1>
        </div>
      </section>

      {/* GP Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {t('first_in_myanmar')}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Grandparent Stock (GP)</h2>
              <p className="text-gray-600 mb-6">
                {getSection('gp')
                  ? getLocalizedContent(getSection('gp')!, language).replace(/^## .+\n\n/, '')
                  : 'As Myanmar\'s first and only GP producer, we maintain the highest genetic lines imported from world-renowned breeding companies.'}
              </p>
              <ul className="space-y-3">
                {gpFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{getFeatureText(f)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🧬</div>
              <h3 className="text-xl font-bold text-green-800">Elite Genetics</h3>
              <p className="text-gray-600 mt-2">World-class breeding lines for Myanmar</p>
            </div>
          </div>
        </div>
      </section>

      {/* PS Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 text-center order-2 lg:order-1">
              <div className="text-6xl mb-4">🐷</div>
              <h3 className="text-xl font-bold text-green-800">Multiplication Program</h3>
              <p className="text-gray-600 mt-2">Elevating national herd genetics</p>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Parent Stock (PS)</h2>
              <p className="text-gray-600 mb-6">
                {getSection('ps')
                  ? getLocalizedContent(getSection('ps')!, language).replace(/^## .+\n\n/, '')
                  : 'Our Parent Stock program multiplies the superior genetics from our GP herd to produce high-performing breeding animals.'}
              </p>
              <ul className="space-y-3">
                {psFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{getFeatureText(f)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                ~3,800 {t('pigs_per_year')}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('commercial')}</h2>
              <p className="text-gray-600 mb-6">
                {getSection('commercial')
                  ? getLocalizedContent(getSection('commercial')!, language).replace(/^## .+\n\n/, '')
                  : 'Our commercial pigs are the result of carefully planned crossbreeding programs that maximize hybrid vigor.'}
              </p>
              <ul className="space-y-3">
                {commercialFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{getFeatureText(f)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={PRODUCTS_IMAGE}
                alt="Commercial Pigs"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;