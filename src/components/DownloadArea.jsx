import React from 'react';
import { Download } from 'lucide-react';

const DownloadArea = ({ onDownload }) => {
    return (
        <div className="w-full max-w-xl mx-auto mt-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Книга готова!</h3>
                <p className="text-slate-500 mb-8">Ваш файл успешно обработан и готов к загрузке.</p>

                <button
                    onClick={onDownload}
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                    <Download size={24} className="relative z-10 transition-transform group-hover:-translate-y-1" />
                    <span className="relative z-10 text-lg">Скачать (Bionic)</span>
                </button>

                <p className="mt-6 text-xs font-medium text-slate-400 uppercase tracking-widest opacity-60">
                    Обработка выполнена локально
                </p>
            </div>
        </div>
    );
};

export default DownloadArea;
