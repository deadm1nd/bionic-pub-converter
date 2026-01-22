import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react';

const UploadZone = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const validateAndPassFile = (file) => {
        setError(null);
        if (file && file.name.endsWith('.epub')) {
            onFileSelect(file);
        } else {
            setError('Пожалуйста, загрузите файл с расширением .epub');
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndPassFile(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndPassFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto group">
            <div
                className={`relative glass-panel rounded-3xl p-12 transition-all duration-500 ease-out cursor-pointer
          ${isDragging
                        ? 'border-indigo-500 bg-indigo-50/80 scale-[1.02] shadow-indigo-500/20'
                        : 'hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1'
                    }
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".epub"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center text-center space-y-6 pointer-events-none">
                    <div className={`relative p-6 rounded-2xl transition-all duration-500 ${isDragging ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-gradient-to-br from-indigo-50 to-white text-indigo-600 shadow-sm group-hover:scale-110 group-hover:rotate-3'}`}>
                        <Upload size={40} strokeWidth={1.5} className="relative z-10" />
                        <div className="absolute inset-0 bg-indigo-200 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Загрузите вашу книгу
                        </h3>
                        <p className="text-base text-slate-500 font-medium max-w-xs mx-auto">
                            Перетащите EPUB файл сюда или кликните для выбора
                        </p>
                    </div>

                    <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-100/50 border border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span>Поддерживается только EPUB</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50/80 backdrop-blur-md border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-red-500/5">
                    <div className="bg-red-100 p-1.5 rounded-full">
                        <AlertCircle size={18} />
                    </div>
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadZone;
