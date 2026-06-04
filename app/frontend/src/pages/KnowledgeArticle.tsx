import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage, getLocalizedTitle, getLocalizedContent } from '@/lib/i18n';
import { client, KnowledgeArticle as ArticleType } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KnowledgeArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.entities.knowledge_articles.query({
          query: { slug },
          limit: 1,
        });
        const items = res.data?.items || [];
        if (items.length > 0) setArticle(items[0]);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Article not found</p>
        <Link to="/knowledge">
          <Button>{t('back_to_articles')}</Button>
        </Link>
      </div>
    );
  }

  const content = getLocalizedContent(article, language);
  const title = getLocalizedTitle(article, language);

  // Simple markdown renderer
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1 mb-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, i) => {
      if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="text-2xl font-bold text-gray-800 mt-8 mb-4">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="text-xl font-semibold text-gray-800 mt-6 mb-3">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        elements.push(<p key={i} className="font-semibold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</p>);
      } else if (line.startsWith('- ')) {
        inList = true;
        listItems.push(line.replace(/^- \*\*(.+?)\*\*:?\s*/, '$1: ').replace('- ', ''));
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        elements.push(<p key={i} className="text-gray-700 mb-3 leading-relaxed">{line}</p>);
      }
    });
    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/knowledge" className="inline-flex items-center text-green-600 hover:text-green-700 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('back_to_articles')}
        </Link>

        <article>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          {article.category && (
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mb-6">
              {article.category}
            </span>
          )}
          <div className="prose max-w-none">
            {renderMarkdown(content)}
          </div>
        </article>
      </div>
    </div>
  );
};

export default KnowledgeArticlePage;