import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { client, SiteSetting } from '@/lib/api';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.entities.site_settings.query({
          query: { category: 'contact' },
          limit: 20,
        });
        const items: SiteSetting[] = res.data?.items || [];
        const map: Record<string, string> = {};
        items.forEach((s) => { map[s.setting_key] = s.setting_value; });
        setSettings(map);
      } catch {
        // defaults
      }
    };
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'my' ? 'မက်ဆေ့ချ်ပို့ပြီးပါပြီ' : language === 'zh' ? '消息已发送' : 'Message Sent',
      description: language === 'my' ? 'ကျွန်ုပ်တို့ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်' : language === 'zh' ? '我们会尽快回复您' : 'We will get back to you soon.',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const getAddress = () => {
    if (language === 'my') return settings.contact_address_my || settings.contact_address_en || '';
    if (language === 'zh') return settings.contact_address_zh || settings.contact_address_en || '';
    return settings.contact_address_en || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">{t('contact')}</h1>
          <p className="text-green-200">
            {language === 'my'
              ? 'ကျွန်ုပ်တို့နှင့် ဆက်သွယ်ပါ'
              : language === 'zh'
              ? '联系我们'
              : 'Get in touch with us'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {language === 'my' ? 'ဆက်သွယ်ရန် အချက်အလက်' : language === 'zh' ? '联系信息' : 'Contact Information'}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {language === 'my' ? 'လိပ်စာ' : language === 'zh' ? '地址' : 'Address'}
                    </h3>
                    <p className="text-gray-600">{getAddress() || 'Nyaung Na Pin Farming Zone, Yangon, Myanmar'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {language === 'my' ? 'ဖုန်း' : language === 'zh' ? '电话' : 'Phone'}
                    </h3>
                    <p className="text-gray-600">{settings.contact_phone || '+95 9 123 456 789'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {language === 'my' ? 'အီးမေးလ်' : language === 'zh' ? '邮箱' : 'Email'}
                    </h3>
                    <p className="text-gray-600">{settings.contact_email || 'office@msl.com.mm'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('send_message')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_name')}</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_email')}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                  <Textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  {t('send_message')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;