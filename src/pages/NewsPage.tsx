import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { getBlogs, Blog, client, Category } from '../lib/microcms';
import { PageHero } from '../components/PageHero';

export const NewsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // カテゴリ取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.get({ endpoint: 'categories' });
        // 「事例」または「実績」を含まないカテゴリのみを抽出
        const filtered = response.contents.filter((cat: Category) => 
          !cat.name.includes('事例') && !cat.name.includes('実績')
        );
        setCategories(filtered);
      } catch (e) {
        console.warn('Categories endpoint not found or error, using defaults');
        setCategories([
           { id: 'event', name: 'EVENT' },
           { id: 'press', name: 'PRESS' },
           { id: 'info', name: 'INFO' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // ブログ取得
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await getBlogs(100, undefined, {
          year: selectedYear,
          keyword: searchQuery
        });
        
        let filtered = response.contents || [];

        // カテゴリフィルタリング
        if (selectedCategory) {
          filtered = filtered.filter(b => b.category?.id === selectedCategory);
        } else {
          // 「すべて」の場合：「実績」「事例」を含むカテゴリを除外
          filtered = filtered.filter(b => {
            const catName = b.category?.name || '';
            return !catName.includes('事例') && !catName.includes('実績');
          });
        }

        setBlogs(filtered);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedYear, searchQuery, categories.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i + 1).toString());

  return (
    <div className="min-h-screen bg-white">
      <PageHero 
        titleEn="NEWS" 
        titleJa="ニュース"
      />
      
      <div className="container mx-auto px-4 sm:px-8 pb-32">
                {/* Filter Section */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-100 pb-12 max-w-7xl mx-auto">
                    {/* Filter Group */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Category Select */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
                            >
                                <option value="">CATEGORY: ALL</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
        
                        {/* Year Select */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full appearance-none px-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer pr-12"
                            >
                                <option value="">YEAR</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        </div>
                    </div>
        
                    {/* Search Input */}
                    <div className="relative flex-grow lg:w-72 w-full">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-sm text-xs font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    </div>
                </div>

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
             <div className="flex justify-center items-center py-32">
               <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-100 border-t-blue-600"></div>
             </div>
          ) : blogs.length === 0 ? (
             <div className="text-center py-32">
               <p className="text-gray-300 font-black text-sm tracking-[0.2em] uppercase">No articles found.</p>
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              {blogs.map((item) => (
                <Link key={item.id} to={`/blog/${item.id}`} className="group flex flex-col h-full">
                  {/* Eyecatch */}
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 mb-6 shadow-sm border border-gray-50">
                    <img 
                      src={item.eyecatch?.url || '/assets/top/business_bg.png'} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-gray-900/90 backdrop-blur-sm text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-sm">
                          {item.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 rounded-full border border-blue-200 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-blue-500 group-hover:text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                      <time className="text-[10px] font-black text-gray-400 tracking-[0.2em] font-mono">
                        {formatDate(item.publishedAt)}
                      </time>
                    </div>
                    
                    <h3 className="text-base font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 tracking-tight leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};