import React, { createContext, useContext, useState, useEffect } from 'react';
import { client, SiteSetting } from './api';

export type Language = 'my' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, my?: string, zh?: string) => string;
  enabledLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'my',
  setLanguage: () => {},
  t: (en) => en,
  enabledLanguages: ['my', 'en', 'zh'],
});

export const useLanguage = () => useContext(LanguageContext);

const translations: Record<string, Record<Language, string>> = {
  home: { en: 'Home', my: 'ပင်မ', zh: '首页' },
  products: { en: 'Products', my: 'ထုတ်ကုန်များ', zh: '产品' },
  sustainability: { en: 'Sustainability', my: 'ရေရှည်တည်တံ့မှု', zh: '可持续发展' },
  knowledge: { en: 'Knowledge Hub', my: 'ဗဟုသုတဌာန', zh: '知识中心' },
  contact: { en: 'Contact', my: 'ဆက်သွယ်ရန်', zh: '联系我们' },
  admin: { en: 'Admin', my: 'စီမံခန့်ခွဲမှု', zh: '管理' },
  current_prices: { en: 'Current Pig Prices', my: 'လက်ရှိဝက်စျေးနှုန်းများ', zh: '当前猪价' },
  price_per_kg: { en: 'Price per kg', my: 'တစ်ကီလိုဂရမ်စျေး', zh: '每公斤价格' },
  price_per_head: { en: 'Price per head', my: 'တစ်ကောင်စျေး', zh: '每头价格' },
  commercial: { en: 'Commercial Pigs', my: 'ကုန်သွယ်ရေးဝက်', zh: '商品猪' },
  parent_stock: { en: 'Parent Stock', my: 'Parent Stock', zh: '父母代种猪' },
  grandparent_stock: { en: 'Grandparent Stock', my: 'Grandparent Stock', zh: '祖代种猪' },
  co2_reduction: { en: 'CO₂ Reduction', my: 'CO₂ လျှော့ချမှု', zh: 'CO₂减排' },
  trees_saved: { en: 'Trees Equivalent Saved', my: 'သစ်ပင်ညီမျှ ကယ်တင်မှု', zh: '相当于节省的树木' },
  tonnes: { en: 'tonnes', my: 'တန်', zh: '吨' },
  mmk: { en: 'MMK', my: 'ကျပ်', zh: '缅币' },
  green_energy: { en: 'Green Energy Impact', my: 'စိမ်းလန်းစွမ်းအင် သက်ရောက်မှု', zh: '绿色能源影响' },
  learn_more: { en: 'Learn More', my: 'ပိုမိုလေ့လာရန်', zh: '了解更多' },
  our_products: { en: 'Our Products', my: 'ကျွန်ုပ်တို့၏ ထုတ်ကုန်များ', zh: '我们的产品' },
  our_mission: { en: 'Our Mission', my: 'ကျွန်ုပ်တို့၏ ရည်မှန်းချက်', zh: '我们的使命' },
  food_security: { en: 'Food Security & Safety', my: 'စားနပ်ရိက္ခာဖူလုံရေးနှင့် ဘေးကင်းရေး', zh: '食品安全与保障' },
  protein_for_people: { en: 'Protein for People', my: 'လူတို့အတွက် ပရိုတင်း', zh: '为人民提供蛋白质' },
  annual_production: { en: 'Annual Production', my: 'နှစ်စဉ်ထုတ်လုပ်မှု', zh: '年产量' },
  scroll_to_top: { en: 'Back to Top', my: 'ထိပ်သို့ပြန်သွားရန်', zh: '回到顶部' },
  pigs_per_year: { en: 'pigs/year', my: 'ကောင်/နှစ်', zh: '头/年' },
  first_in_myanmar: { en: 'First in Myanmar', my: 'မြန်မာနိုင်ငံတွင် ပထမဆုံး', zh: '缅甸首家' },
  gp_producer: { en: 'GP Breeder', my: 'GP မွေးမြူသူ', zh: 'GP育种商' },
  zero_grid: { en: 'Near Zero Grid', my: 'ဓာတ်အားလိုင်း သုံးစွဲမှုနီးပါးသုည', zh: '近零电网依赖' },
  power_dependency: { en: 'Power Dependency', my: 'ဓာတ်အားမှီခိုမှု', zh: '电力依赖' },
  read_article: { en: 'Read Article', my: 'ဆောင်းပါးဖတ်ရန်', zh: '阅读文章' },
  all_articles: { en: 'All Articles', my: 'ဆောင်းပါးအားလုံး', zh: '所有文章' },
  back_to_articles: { en: 'Back to Articles', my: 'ဆောင်းပါးများသို့ ပြန်သွားရန်', zh: '返回文章列表' },
  send_message: { en: 'Send Message', my: 'မက်ဆေ့ချ်ပို့ရန်', zh: '发送消息' },
  your_name: { en: 'Your Name', my: 'သင့်အမည်', zh: '您的姓名' },
  your_email: { en: 'Your Email', my: 'သင့်အီးမေးလ်', zh: '您的邮箱' },
  message: { en: 'Message', my: 'မက်ဆေ့ချ်', zh: '留言' },
  kwh_per_day: { en: 'kWh/day', my: 'kWh/ရက်', zh: 'kWh/天' },
  daily_generation: { en: 'Daily Generation', my: 'နေ့စဉ်ထုတ်လုပ်မှု', zh: '日发电量' },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [enabledLanguages, setEnabledLanguages] = useState<Language[]>(['my', 'en', 'zh']);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await client.entities.site_settings.query({
          query: { category: 'language' },
          limit: 10,
        });
        const settings: SiteSetting[] = response.data?.items || [];
        const enabled: Language[] = [];
        let defaultLang: Language = 'my';

        settings.forEach((s) => {
          if (s.setting_key === 'lang_en_enabled' && s.setting_value === 'true') enabled.push('en');
          if (s.setting_key === 'lang_my_enabled' && s.setting_value === 'true') enabled.push('my');
          if (s.setting_key === 'lang_zh_enabled' && s.setting_value === 'true') enabled.push('zh');
          if (s.setting_key === 'default_language') defaultLang = s.setting_value as Language;
        });

        if (enabled.length > 0) setEnabledLanguages(enabled);
        if (enabled.includes(defaultLang)) setLanguage(defaultLang);
      } catch {
        // Use defaults
      }
    };
    loadSettings();
  }, []);

  const t = (key: string, fallbackMy?: string, fallbackZh?: string): string => {
    const entry = translations[key];
    if (entry) return entry[language] || entry['en'];
    if (language === 'my' && fallbackMy) return fallbackMy;
    if (language === 'zh' && fallbackZh) return fallbackZh;
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, enabledLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const getLocalizedContent = (item: { content_en?: string; content_my?: string; content_zh?: string }, lang: Language): string => {
  if (lang === 'my' && item.content_my) return item.content_my;
  if (lang === 'zh' && item.content_zh) return item.content_zh;
  return item.content_en || '';
};

export const getLocalizedTitle = (item: { title_en?: string; title_my?: string; title_zh?: string }, lang: Language): string => {
  if (lang === 'my' && item.title_my) return item.title_my;
  if (lang === 'zh' && item.title_zh) return item.title_zh;
  return item.title_en || '';
};

export const getLocalizedNotes = (item: { notes_en?: string; notes_my?: string; notes_zh?: string }, lang: Language): string => {
  if (lang === 'my' && item.notes_my) return item.notes_my;
  if (lang === 'zh' && item.notes_zh) return item.notes_zh;
  return item.notes_en || '';
};