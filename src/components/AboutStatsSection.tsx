import React from 'react';

export const AboutStatsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase block mb-2">
              META HEROES BY THE NUMBERS
            </span>
            <div className="flex flex-col items-start">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-3">
                数字で見るMeta Heroes
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
            </div>
          </div>
          <span className="text-[10px] md:text-xs text-gray-400 font-bold tracking-widest">
            2026年1月時点 実績
          </span>
        </div>

        {/* Stats Grid - Compact & Stylish */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Large Items (User Stats) - Span 2 cols on desktop */}
          {[
            { label: 'メタバース\nプレイ数', value: '27', suffix: '万名', icon: '/assets/about/stats_metaverse_icon.png' },
            { label: 'イベント\n来場者数', value: '13', suffix: '万名', icon: '/assets/about/stats_event_icon.png' },
            { label: 'AI/DX人材育成\n研修受講者数', value: '1.5', suffix: '万名', icon: '/assets/about/stats_ai_icon.png' },
          ].map((item, idx) => (
            <div key={idx} className="col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-row items-center justify-between gap-4 relative overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="relative z-10">
                <p className="text-xs font-bold text-gray-500 mb-1 whitespace-pre-line leading-tight">{item.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter">{item.value}</span>
                  <span className="text-sm font-bold text-gray-400">{item.suffix}</span>
                </div>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                <img src={item.icon} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {/* Small Items (Company Stats) - Span 1 col on desktop if possible, here span 2 for balance in 6-grid */}
          {[
            { label: '設立年', value: '2021', suffix: '年', icon: '/assets/about/stats_year_icon.png' },
            { label: '従業員数', value: '17', suffix: '名', icon: '/assets/about/stats_employees_icon.png' },
            { label: '平均年齢', value: '29.1', suffix: '歳', icon: '/assets/about/stats_age_icon.png' },
          ].map((item, idx) => (
            <div key={`small-${idx}`} className="col-span-1 md:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center text-center gap-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
              <div className="w-8 h-8 mb-1 opacity-40">
                <img src={item.icon} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-3xl font-black text-gray-800 tracking-tighter">{item.value}</span>
                <span className="text-xs font-bold text-gray-400 ml-1">{item.suffix}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};