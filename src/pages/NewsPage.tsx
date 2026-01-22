import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, Blog, Category, client } from '../lib/microcms';
import { Search, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop';

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
        setCategories(response.contents);
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
          categoryId: selectedCategory,
          year: selectedYear,
          keyword: searchQuery
        });
        setBlogs(response.contents);
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
  }, [selectedCategory, selectedYear, searchQuery]);

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
        {/* News List (Table Style) */}
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
              className="divide-y divide-gray-100 border-t border-gray-100"
            >
              {blogs.map((item) => (
                <Link key={item.id} to={`/blog/${item.id}`} className="group flex flex-col md:flex-row md:items-center gap-6 md:gap-12 py-10 hover:bg-gray-50/50 transition-all px-6 -mx-6">
                  <div className="flex items-center gap-10 flex-shrink-0 min-w-[300px]">
                    <time className="text-sm md:text-base font-black text-gray-900 font-mono tracking-wider">
                      {formatDate(item.publishedAt)}
                    </time>
                    {item.category && (
                      <span className="px-5 py-2 bg-gray-900 text-[10px] font-black text-white uppercase tracking-[0.2em] text-center min-w-[120px]">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base md:text-xl font-black text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2 flex-grow tracking-tight">
                    {item.title}
                  </h3>
                  <div className="hidden md:block">
                    <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
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
