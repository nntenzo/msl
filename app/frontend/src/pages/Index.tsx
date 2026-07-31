import React, { useState, useEffect } from 'react';
import { useLanguage, getLocalizedContent, getLocalizedTitle, getLocalizedNotes } from '@/lib/i18n';
import { client, PageContent, PigPrice, KnowledgeArticle, SiteSetting } from '@/lib/api';
import GreenEnergyMeter from '@/components/GreenEnergyMeter';
import { ArrowRight, Shield, Leaf, Award, CheckCircle, Sun, Flame, Wind, BookOpen, MapPin, Phone, Mail, Send, TrendingUp, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const HERO_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hhelqaahua/hero-banner-modern-pig-farm.png';
const PRODUCTS_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hgckiaahuq/products-commercial-pigs.png';
const SOLAR_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3hewhqaahwq/sustainability-solar-biogas.png';
const BIOSECURITY_IMAGE = 'https://mgx-backend-cdn.metadl.com/generate/images/1077780/2026-06-03/p3he26iaahvq/biosecurity-entrance-station.png';

const Index: React.FC = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [homeContents, setHomeContents] = useState<PageContent[]>([]);
  const [productContents, setProductContents] = useState<PageContent[]>([]);
  const [sustainContents, setSustainContents] = useState<PageContent[]>([]);
  const [prices, setPrices] = useState<PigPrice[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [showPrices, setShowPrices] = useState(true);
  const [contactSettings, setContactSettings] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [homeRes, prodRes, susRes, priceSettingRes, pricesRes, articlesRes, contactRes] = await Promise.all([
          client.entities.page_contents.query({ query: { page_key: 'home' }, sort: 'sort_order', limit: 20 }),
          client.entities.page_contents.query({ query: { page_key: 'products' }, sort: 'sort_order', limit: 20 }),
          client.entities.page_contents.query({ query: { page_key: 'sustainability' }, sort: 'sort_order', limit: 20 }),
          client.entities.site_settings.query({ query: { setting_key: 'show_prices' }, limit: 1 }),
          client.entities.pig_prices.query({ query: { is_active: true }, sort: 'price_per_kg', limit: 10 }),
          client.entities.knowledge_articles.query({ query: { is_published: true }, sort: 'sort_order', limit: 20 }),
          client.entities.site_settings.query({ query: { category: 'contact' }, limit: 20 }),
        ]);
        setHomeContents(homeRes.data?.items || []);
        setProductContents(prodRes.data?.items || []);
        setSustainContents(susRes.data?.items || []);
        const showSetting = (priceSettingRes.data?.items || []).find((s: SiteSetting) => s.setting_key === 'show_prices');
        if (showSetting && showSetting.setting_value === 'false') setShowPrices(false);
        setPrices(pricesRes.data?.items || []);
        setArticles(articlesRes.data?.items || []);
        const map: Record<string, string> = {};
        (contactRes.data?.items || []).forEach((s: SiteSetting) => { map[s.setting_key] = s.setting_value; });
        setContactSettings(map);
      } catch {
        // use defaults
      }
    };
    loadAll();
  }, []);

  const getHomeSection = (key: string) => homeContents.find((p) => p.section_key === key);
  const getProductSection = (key: string) => productContents.find((p) => p.section_key === key);
  const getSustainSection = (key: string) => sustainContents.find((p) => p.section_key === key);

  const heroContent = getHomeSection('hero');
  const introContent = getHomeSection('intro');
  const missionContent = getHomeSection('mission');

  const priceTypeLabels: Record<string, string> = {
    commercial: t('commercial'),
    parent_stock: t('parent_stock'),
    grandparent_stock: t('grandparent_stock'),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'my' ? 'မက်ဆေ့ချ်ပို့ပြီးပါပြီ' : language === 'zh' ? '消息已发送' : 'Message Sent',
      description: language === 'my' ? 'ကျွန်ုပ်တို့ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်' : language === 'zh' ? '我们会尽快回复您' : 'We will get back to you soon.',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const getAddress = () => {
    if (language === 'my') return contactSettings.contact_address_my || contactSettings.contact_address_en || 'Industrial Zone, Yangon Region, Myanmar';
    if (language === 'zh') return contactSettings.contact_address_zh || contactSettings.contact_address_en || 'Industrial Zone, Yangon Region, Myanmar';
    return contactSettings.contact_address_en || 'Industrial Zone, Yangon Region, Myanmar';
  };

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

  const categoryColors: Record<string, string> = {
    nutrition: 'bg-orange-100 text-orange-800',
    breeding: 'bg-pink-100 text-pink-800',
    health: 'bg-red-100 text-red-800',
    management: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Myanmar Swine Livestock Farm" className="w-full h-full object-cover" />
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
              <a href="#products">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  {t('our_products')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="#sustainability">
                <Button size="lg" variant="outline" className="!bg-transparent border-white text-white !hover:bg-transparent hover:border-green-300">
                  {t('sustainability')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-green-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
            <div>
              <div className="text-3xl font-bold">38,000+</div>
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

      {/* ===== COMPANY INTRO / MISSION ===== */}
      <section id="about" className="py-16 bg-white">
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
              <img src={PRODUCTS_IMAGE} alt="Commercial Pigs" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PIG PRICES ===== */}
      {showPrices && prices.length > 0 && (
        <section id="prices" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">{t('current_prices')}</h2>
              </div>
              <p className="text-sm text-gray-500">Updated regularly</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prices.map((price) => (
                <div key={price.id} className="border border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-green-50">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    {priceTypeLabels[price.price_type] || price.price_type}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{t('price_per_kg')}</span>
                      <span className="text-xl font-bold text-green-700">{price.price_per_kg?.toLocaleString()} {t('mmk')}</span>
                    </div>
                    {price.price_per_head > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{t('price_per_head')}</span>
                        <span className="text-lg font-semibold text-gray-700">{price.price_per_head?.toLocaleString()} {t('mmk')}</span>
                      </div>
                    )}
                  </div>
                  {getLocalizedNotes(price, language) && (
                    <p className="mt-4 text-xs text-gray-500 border-t pt-3">{getLocalizedNotes(price, language)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('our_products')}</h2>

          {/* GP */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {t('first_in_myanmar')}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Grandparent Stock (GP)</h3>
              <p className="text-gray-600 mb-6">
                {getProductSection('gp')
                  ? getLocalizedContent(getProductSection('gp')!, language).replace(/^## .+\n\n/, '')
                  : "As Myanmar's first and only GP breeder, we maintain the highest genetic lines imported from world-renowned breeding companies."}
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

          {/* PS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 text-center order-2 lg:order-1">
              <div className="text-6xl mb-4">🐷</div>
              <h3 className="text-xl font-bold text-green-800">Multiplication Program</h3>
              <p className="text-gray-600 mt-2">Elevating national herd genetics</p>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Parent Stock (PS)</h3>
              <p className="text-gray-600 mb-6">
                {getProductSection('ps')
                  ? getLocalizedContent(getProductSection('ps')!, language).replace(/^## .+\n\n/, '')
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

          {/* Commercial */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                ~38,000 {t('pigs_per_year')}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('commercial')}</h3>
              <p className="text-gray-600 mb-6">
                {getProductSection('commercial')
                  ? getLocalizedContent(getProductSection('commercial')!, language).replace(/^## .+\n\n/, '')
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
              <img src={PRODUCTS_IMAGE} alt="Commercial Pigs" className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== GREEN ENERGY METER ===== */}
      <section id="sustainability">
        <GreenEnergyMeter />
      </section>

      {/* ===== SUSTAINABILITY DETAILS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('sustainability')}</h2>

          {/* Solar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Sun className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဆိုလာစွမ်းအင်စနစ်' : language === 'zh' ? '太阳能系统' : 'Solar Energy System'}
                </h3>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSustainSection('solar')
                  ? getLocalizedContent(getSustainSection('solar')!, language).replace(/^## .+\n\n/, '')
                  : 'Our farm operates a comprehensive solar panel installation that generates clean electricity for daily operations.'}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={SOLAR_IMAGE} alt="Solar Panels" className="w-full h-72 object-cover" />
            </div>
          </div>

          {/* Biogas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 text-center order-2 lg:order-1">
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
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဇီဝဓာတ်ငွေ့ ထုတ်လုပ်ခြင်း' : language === 'zh' ? '沼气发电' : 'Biogas Generation'}
                </h3>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSustainSection('biogas')
                  ? getLocalizedContent(getSustainSection('biogas')!, language).replace(/^## .+\n\n/, '')
                  : 'We convert pig waste into valuable biogas through anaerobic digestion.'}
              </div>
            </div>
          </div>

          {/* Odor */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wind className="h-8 w-8 text-teal-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                {language === 'my' ? 'အနံ့စီမံခန့်ခွဲမှု' : language === 'zh' ? '气味管理' : 'Odor Management'}
              </h3>
            </div>
            <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed whitespace-pre-line">
              {getSustainSection('odor')
                ? getLocalizedContent(getSustainSection('odor')!, language).replace(/^## .+\n\n/, '')
                : 'We employ advanced odor control technologies to ensure our farm is a good neighbor.'}
            </div>
          </div>

          {/* Biosecurity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {language === 'my' ? 'ဇီဝလုံခြုံရေး ထူးချွန်မှု' : language === 'zh' ? '卓越的生物安全' : 'Biosecurity Excellence'}
                </h3>
              </div>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {getSustainSection('biosecurity')
                  ? getLocalizedContent(getSustainSection('biosecurity')!, language).replace(/^## .+\n\n/, '')
                  : 'Biosecurity is the cornerstone of our operations. We implement multi-layered protection.'}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={BIOSECURITY_IMAGE} alt="Biosecurity" className="w-full h-72 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KNOWLEDGE HUB ===== */}
      <section id="knowledge" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <BookOpen className="h-10 w-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('knowledge')}</h2>
            <p className="text-gray-600">
              {language === 'my' ? 'ဝက်မွေးမြူရေးဆိုင်ရာ အသိပညာများ' : language === 'zh' ? '养猪相关知识' : 'Swine livestock knowledge and best practices'}
            </p>
          </div>
          {articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.category && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-800'}`}>
                        {article.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {getLocalizedTitle(article, language)}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {getLocalizedContent(article, language).replace(/^#+\s.+\n\n/, '').substring(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('contact')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{language === 'my' ? 'လိပ်စာ' : language === 'zh' ? '地址' : 'Address'}</h3>
                    <p className="text-gray-600">{getAddress()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{language === 'my' ? 'ဖုန်း' : language === 'zh' ? '电话' : 'Phone'}</h3>
                    <p className="text-gray-600">{contactSettings.contact_phone || '+95 9 123 456 789'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{language === 'my' ? 'အီးမေးလ်' : language === 'zh' ? '邮箱' : 'Email'}</h3>
                    <p className="text-gray-600">{contactSettings.contact_email || 'info@myanmarswine.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t('send_message')}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_name')}</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_email')}</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                  <Textarea rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4 mr-2" /> {t('send_message')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;