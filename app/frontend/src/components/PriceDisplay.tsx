import React, { useState, useEffect } from 'react';
import { useLanguage, getLocalizedNotes } from '@/lib/i18n';
import { client, PigPrice, SiteSetting } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

const PriceDisplay: React.FC = () => {
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState<PigPrice[]>([]);
  const [showPrices, setShowPrices] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if prices should be displayed
        const settingsRes = await client.entities.site_settings.query({
          query: { setting_key: 'show_prices' },
          limit: 1,
        });
        const settings: SiteSetting[] = settingsRes.data?.items || [];
        const showSetting = settings.find((s) => s.setting_key === 'show_prices');
        if (showSetting && showSetting.setting_value === 'false') {
          setShowPrices(false);
          setLoading(false);
          return;
        }

        // Load active prices
        const pricesRes = await client.entities.pig_prices.query({
          query: { is_active: true },
          sort: 'price_per_kg',
          limit: 10,
        });
        setPrices(pricesRes.data?.items || []);
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !showPrices || prices.length === 0) return null;

  const priceTypeLabels: Record<string, string> = {
    commercial: t('commercial'),
    parent_stock: t('parent_stock'),
    grandparent_stock: t('grandparent_stock'),
  };

  return (
    <section className="py-12 bg-white">
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
            <div
              key={price.id}
              className="border border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-green-50"
            >
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {priceTypeLabels[price.price_type] || price.price_type}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{t('price_per_kg')}</span>
                  <span className="text-xl font-bold text-green-700">
                    {price.price_per_kg?.toLocaleString()} {t('mmk')}
                  </span>
                </div>
                {price.price_per_head > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">{t('price_per_head')}</span>
                    <span className="text-lg font-semibold text-gray-700">
                      {price.price_per_head?.toLocaleString()} {t('mmk')}
                    </span>
                  </div>
                )}
              </div>
              {getLocalizedNotes(price, language) && (
                <p className="mt-4 text-xs text-gray-500 border-t pt-3">
                  {getLocalizedNotes(price, language)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceDisplay;