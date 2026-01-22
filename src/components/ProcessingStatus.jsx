import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const ProcessingStatus = ({ status, fileName }) => {
    if (status === 'idle') return null;

    return (
        <div className="w-full max-w-xl mx-auto mt-8 perspective-[1000px]">
            {status === 'processing' && (
                <div className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                        <Loader2 className="relative z-10 animate-spin text-indigo-600" size={48} />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            Магия в процессе...
                        </h3>
                        <p className="text-slate-500 font-medium">
                            Применяем бионическое чтение к<br />
                            <span className="text-slate-800 font-semibold">{fileName}</span>
                        </p>
                    </div>
                </div>
            )}

            {status === 'completed' && (
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 border-l-4 border-l-green-500 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-green-100 p-3 rounded-full shadow-inner ring-4 ring-green-50">
                        <CheckCircle2 size={24} className="text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Обработка завершена</h4>
                        <p className="text-sm text-slate-500 font-medium">Ваш файл готов к скачиванию</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessingStatus;
