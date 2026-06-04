import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { client, SiteSetting, PigPrice, KnowledgeArticle, PageContent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, DollarSign, FileText, Layout, LogIn } from 'lucide-react';

type Tab = 'settings' | 'prices' | 'articles' | 'pages';

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [prices, setPrices] = useState<PigPrice[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await client.auth.me();
        if (res?.data) setUser(res.data);
      } catch {
        // not logged in
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'settings') {
        const res = await client.entities.site_settings.query({ query: {}, limit: 50 });
        setSettings(res.data?.items || []);
      } else if (activeTab === 'prices') {
        const res = await client.entities.pig_prices.query({ query: {}, limit: 20 });
        setPrices(res.data?.items || []);
      } else if (activeTab === 'articles') {
        const res = await client.entities.knowledge_articles.query({ query: {}, sort: 'sort_order', limit: 20 });
        setArticles(res.data?.items || []);
      } else if (activeTab === 'pages') {
        const res = await client.entities.page_contents.query({ query: {}, sort: 'sort_order', limit: 50 });
        setPages(res.data?.items || []);
      }
    } catch {
      // handle error
    }
  };

  const handleLogin = () => {
    client.auth.toLogin();
  };

  const updateSetting = async (id: number, value: string) => {
    try {
      await client.entities.site_settings.update({ id: String(id), data: { setting_value: value } });
      toast({ title: 'Setting updated' });
      loadData();
    } catch {
      toast({ title: 'Error updating setting', variant: 'destructive' });
    }
  };

  const updatePrice = async (id: number, data: Partial<PigPrice>) => {
    try {
      await client.entities.pig_prices.update({ id: String(id), data });
      toast({ title: 'Price updated' });
      loadData();
    } catch {
      toast({ title: 'Error updating price', variant: 'destructive' });
    }
  };

  const updateArticle = async (id: number, data: Partial<KnowledgeArticle>) => {
    try {
      await client.entities.knowledge_articles.update({ id: String(id), data });
      toast({ title: 'Article updated' });
      loadData();
    } catch {
      toast({ title: 'Error updating article', variant: 'destructive' });
    }
  };

  const updatePage = async (id: number, data: Partial<PageContent>) => {
    try {
      await client.entities.page_contents.update({ id: String(id), data });
      toast({ title: 'Content updated' });
      loadData();
    } catch {
      toast({ title: 'Error updating content', variant: 'destructive' });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <LogIn className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
          <p className="text-gray-600 mb-6">Please log in to manage website content</p>
          <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700 text-white w-full">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'prices', label: 'Pig Prices', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'articles', label: 'Articles', icon: <FileText className="h-4 w-4" /> },
    { id: 'pages', label: 'Page Content', icon: <Layout className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <Button variant="outline" onClick={() => client.auth.logout()}>Logout</Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={activeTab === tab.id ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Site Settings</h2>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">{setting.setting_key}</label>
                    <span className="text-xs text-gray-400 ml-2">({setting.category})</span>
                  </div>
                  {setting.setting_value === 'true' || setting.setting_value === 'false' ? (
                    <Switch
                      checked={setting.setting_value === 'true'}
                      onCheckedChange={(checked) => updateSetting(setting.id, String(checked))}
                    />
                  ) : (
                    <Input
                      className="max-w-xs"
                      defaultValue={setting.setting_value}
                      onBlur={(e) => {
                        if (e.target.value !== setting.setting_value) {
                          updateSetting(setting.id, e.target.value);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prices Tab */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Pig Prices</h2>
            <div className="space-y-6">
              {prices.map((price) => (
                <div key={price.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 capitalize">{price.price_type.replace('_', ' ')}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Active</span>
                      <Switch
                        checked={price.is_active}
                        onCheckedChange={(checked) => updatePrice(price.id, { is_active: checked })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Price per kg (MMK)</label>
                      <Input
                        type="number"
                        defaultValue={price.price_per_kg}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== price.price_per_kg) updatePrice(price.id, { price_per_kg: val });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Price per head (MMK)</label>
                      <Input
                        type="number"
                        defaultValue={price.price_per_head}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== price.price_per_head) updatePrice(price.id, { price_per_head: val });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Knowledge Articles</h2>
            <div className="space-y-6">
              {articles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{article.title_en}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Published</span>
                      <Switch
                        checked={article.is_published}
                        onCheckedChange={(checked) => updateArticle(article.id, { is_published: checked })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Title (English)</label>
                      <Input
                        defaultValue={article.title_en}
                        onBlur={(e) => {
                          if (e.target.value !== article.title_en) updateArticle(article.id, { title_en: e.target.value });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Title (Burmese)</label>
                      <Input
                        defaultValue={article.title_my || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (article.title_my || '')) updateArticle(article.id, { title_my: e.target.value });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Content (English)</label>
                      <Textarea
                        rows={4}
                        defaultValue={article.content_en || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (article.content_en || '')) updateArticle(article.id, { content_en: e.target.value });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Page Contents</h2>
            <div className="space-y-6">
              {pages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{page.page_key}</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded ml-2">{page.section_key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Visible</span>
                      <Switch
                        checked={page.is_visible}
                        onCheckedChange={(checked) => updatePage(page.id, { is_visible: checked })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Content (English)</label>
                      <Textarea
                        rows={3}
                        defaultValue={page.content_en || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (page.content_en || '')) updatePage(page.id, { content_en: e.target.value });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Content (Burmese)</label>
                      <Textarea
                        rows={3}
                        defaultValue={page.content_my || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (page.content_my || '')) updatePage(page.id, { content_my: e.target.value });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Image URL</label>
                      <Input
                        defaultValue={page.image_url || ''}
                        onBlur={(e) => {
                          if (e.target.value !== (page.image_url || '')) updatePage(page.id, { image_url: e.target.value });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;