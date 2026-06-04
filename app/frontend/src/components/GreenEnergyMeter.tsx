import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Leaf, Sun, Zap } from 'lucide-react';

const GreenEnergyMeter: React.FC = () => {
  const { t } = useLanguage();
  const [animatedCO2, setAnimatedCO2] = useState(0);
  const [animatedTrees, setAnimatedTrees] = useState(0);

  // Calculation: 2000 kWh/day, Myanmar grid emission factor ~0.7 kg CO2/kWh
  // Operation start: Jan 1, 2023
  const startDate = new Date('2023-01-01');
  const now = new Date();
  const daysOperating = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const dailyKWh = 2000;
  const emissionFactor = 0.7; // kg CO2/kWh
  const dailyCO2Saved = (dailyKWh * emissionFactor) / 1000; // tonnes per day
  const totalCO2Saved = Math.round(daysOperating * dailyCO2Saved);
  
  // Average tree absorbs ~22 kg CO2 per year
  const treesEquivalent = Math.round((totalCO2Saved * 1000) / 22);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const co2Step = totalCO2Saved / steps;
    const treeStep = treesEquivalent / steps;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setAnimatedCO2(Math.min(Math.round(co2Step * current), totalCO2Saved));
      setAnimatedTrees(Math.min(Math.round(treeStep * current), treesEquivalent));
      if (current >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [totalCO2Saved, treesEquivalent]);

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-green-800 mb-2">{t('green_energy')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('zero_grid')} — {t('power_dependency')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CO2 Reduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">
              {animatedCO2.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">{t('tonnes')}</div>
            <div className="text-lg font-medium text-gray-700 mt-2">{t('co2_reduction')}</div>
          </div>

          {/* Trees Saved */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22V8M12 8C12 8 8 12 5 10C2 8 4 4 7 4C9 4 11 6 12 8ZM12 8C12 8 16 12 19 10C22 8 20 4 17 4C15 4 13 6 12 8Z" />
              </svg>
            </div>
            <div className="text-4xl font-bold text-emerald-700 mb-2">
              {animatedTrees.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">{t('trees_saved')}</div>
            <div className="text-lg font-medium text-gray-700 mt-2">🌳</div>
          </div>

          {/* Daily Generation */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sun className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-4xl font-bold text-yellow-700 mb-2">
              {dailyKWh.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">{t('kwh_per_day')}</div>
            <div className="text-lg font-medium text-gray-700 mt-2">{t('daily_generation')}</div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Zap className="h-3 w-3" />
              <span>Solar + Biogas</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Operating since January 2023 • {daysOperating} days of clean energy</p>
        </div>
      </div>
    </section>
  );
};

export default GreenEnergyMeter;