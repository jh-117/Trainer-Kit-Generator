import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Briefcase, BookOpen, ArrowRight, Wand2, LayoutTemplate } from 'lucide-react';
import { TrainingInput, GeneratedKit } from '../types';
import { LibrarySelector } from './LibrarySelector';
import { getPreGeneratedKit } from '../utils/aiGenerator';


interface InputSectionProps {
  onSubmit: (input: TrainingInput) => void;
  onKitSelect: (kit: GeneratedKit) => void;
  isProcessing: boolean;
  initialTab?: 'create' | 'library';
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, onKitSelect, isProcessing, initialTab = 'create' }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'library'>(initialTab);
  const [industry, setIndustry] = useState('');
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleLibrarySelect = async (selectedIndustry: string, selectedTopic: string) => {
    setIsLoadingLibrary(true);
    // Simulate a brief network delay for UX
    setTimeout(() => {
        const kit = getPreGeneratedKit(selectedIndustry, selectedTopic);
        onKitSelect(kit);
        setIsLoadingLibrary(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ industry, topic, file });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Trainer Kit <span className="text-indigo-600">Generator</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Turn any topic into a professional training package. Start from scratch, upload a doc, or choose a ready-made kit.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
        {(isProcessing || isLoadingLibrary) && (
            <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-slate-700">
                        {isLoadingLibrary ? "Retrieving Kit..." : "Analyzing Content..."}
                    </span>
                </div>
            </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Custom Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${
              activeTab === 'library'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Template Library</span>
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700">
                    <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                    Industry
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Healthcare, Tech, Retail"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-700">
                    <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                    Training Topic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cybersecurity Basics"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Reference Material (Optional)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    file ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  {file ? (
                    <div className="flex items-center justify-center space-x-3 text-indigo-700">
                      <FileText className="w-8 h-8" />
                      <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="p-1 hover:bg-indigo-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-slate-500">
                      <Upload className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs">PDF, DOCX, or TXT (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!industry || !topic || isProcessing}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/25"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Content...
                  </span>
                ) : (
                  <>
                    <span>Generate Training Plan</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <LibrarySelector onSelect={handleLibrarySelect} />
          )}
        </div>
      </div>
    </div>
  );
};