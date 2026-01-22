import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import UploadZone from './components/UploadZone.jsx';
import ProcessingStatus from './components/ProcessingStatus.jsx';
import DownloadArea from './components/DownloadArea.jsx';
import { processEpub } from './utils/bionic.js';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [processedBlob, setProcessedBlob] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setStatus('processing');

    try {
      const blob = await processEpub(selectedFile);
      setProcessedBlob(blob);
      setStatus('completed');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!processedBlob || !file) return;

    const url = URL.createObjectURL(processedBlob);
    const link = document.createElement('a');
    link.href = url;
    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    const name = nameParts.join('.');
    link.download = `${name}-bionic.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    // The centering is now handled by #root in index.css
    // We just provide the card
    <main className="w-full max-w-xl mx-4 my-8 bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl shadow-indigo-500/10 rounded-[2rem] p-8 md:p-12 overflow-hidden animate-in fade-in zoom-in-95 duration-700">

      {/* Header Section */}
      <header className="text-center space-y-6 mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-md ring-1 ring-black/5 mb-2">
          <BookOpen className="text-indigo-600 h-8 w-8" strokeWidth={2} />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800">
            Bionic Reader
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto">
            Умное форматирование книг для <span className="text-indigo-600 font-bold">скорочтения</span>
          </p>
        </div>
      </header>

      {/* Dynamic Content Area */}
      <div className="relative">
        {status === 'idle' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {(status === 'processing' || status === 'completed') && (
          <ProcessingStatus status={status} fileName={file?.name} />
        )}

        {status === 'completed' && (
          <DownloadArea onDownload={handleDownload} />
        )}

        {/* Reset Action */}
        {status === 'completed' && (
          <div className="mt-8 text-center animate-in fade-in duration-700 delay-200">
            <button
              onClick={() => {
                setStatus('idle');
                setFile(null);
                setProcessedBlob(null);
              }}
              className="text-sm text-slate-400 hover:text-indigo-600 font-medium transition-colors"
            >
              Обработать другой файл
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-medium text-slate-400 opacity-50">
          © {new Date().getFullYear()} Bionic Reader. Deadmind.
        </p>
      </div>
    </main>
  );
}

export default App;
