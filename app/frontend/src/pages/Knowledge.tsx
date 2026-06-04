import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, getLocalizedTitle, getLocalizedContent } from '@/lib/i18n';
import { client, KnowledgeArticle } from '@/lib/api';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Knowledge: React.FC = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.entities.knowledge_articles.query({
          query: { is_published: true },
          sort: 'sort_order',
          limit: 20,
        });
        setArticles(res.data?.items || []);
      } catch {
        // defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryColors: Record<string, string> = {
    nutrition: 'bg-orange-100 text-orange-800',
    breeding: 'bg-pink-100 text-pink-800',
    health: 'bg-red-100 text-red-800',
    management: 'bg-blue-100 text-blue-800',
  };

  const categoryLabels: Record<string, Record<string, string>> = {
    nutrition: { en: 'Nutrition', my: 'အာဟာရ', zh: '营养' },
    breeding: { en: 'Breeding', my: 'မျိုးပွားရေး', zh: '育种' },
    health: { en: 'Health', my: 'ကျန်းမာရေး', zh: '健康' },
    management: { en: 'Management', my: 'စီမံခန့်ခွဲမှု', zh: '管理' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-12 w-12 text-green-200 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">{t('knowledge')}</h1>
          <p className="text-green-200 max-w-2xl mx-auto">
            {language === 'my'
              ? 'ဝက်မွေးမြူရေးဆိုင်ရာ အသိပညာများနှင့် အကောင်းဆုံးအလေ့အကျင့်များ'
              : language === 'zh'
              ? '养猪相关知识和最佳实践'
              : 'Swine livestock knowledge and best practices for modern farming'}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No articles available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/knowledge/${article.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {article.category && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[article.category] || 'bg-gray-100 text-gray-800'}`}>
                          {categoryLabels[article.category]?.[language] || article.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                      {getLocalizedTitle(article, language)}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {getLocalizedContent(article, language).replace(/^#+\s.+\n\n/, '').substring(0, 200)}...
                    </p>
                    <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                      {t('read_article')} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Knowledge;