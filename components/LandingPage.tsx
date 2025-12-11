import React from 'react';
import { Sparkles, ArrowRight, Presentation, FileText, Zap, Download, Layers, Users } from 'lucide-react';
import kadoshLogo from '../assets/kadoshAI.png';
import BackgroundMusic from './BackgroundMusic';
import themeMusic from '../assets/trainer-theme.mp3';

interface LandingPageProps {
  onStart: () => void;
  onBrowseTemplates: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseTemplates }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700">
      <BackgroundMusic src={themeMusic} />
      {/* Hero Section */}
      <div className="text-center space-y-8 pt-10 pb-10">
       
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight animate-in fade-in slide-in-from-bottom-6 delay-200">
          Create Corporate Training <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
            In Seconds, Not Days
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-300">
          Instantly generate professional slide decks, facilitator guides, participant handouts, and flashcards from a simple topic or document upload.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 delay-500">
          <button 
            onClick={onStart}
            className="group px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 flex items-center"
          >
            Start Generating Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onBrowseTemplates}
            className="px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Browse Templates
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Presentation className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Slide Decks</h3>
          <p className="text-slate-500 leading-relaxed">
            Get professionally structured presentations with speaker notes and AI-curated background imagery ready for PowerPoint.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Comprehensive Guides</h3>
          <p className="text-slate-500 leading-relaxed">
            Generate detailed Facilitator Guides with timelines and Participant Handouts in clean Markdown or PDF formats.
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Learning</h3>
          <p className="text-slate-500 leading-relaxed">
            Reinforce learning with automatically generated flashcards and role-playing scenarios tailored to your industry.
          </p>
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="border-t border-slate-200 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">100+</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Industries Supported</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">10x</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Faster Creation</div>
            </div>
             <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">PPTX</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Native Export</div>
            </div>
             <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">4.0</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Model Capabilities</div>
            </div>
        </div>


        <div className="flex space-x-6 text-sm text-gray-600">
              <button 
                onClick={() => navigate('/privacy')} 
                className="hover:text-blue-600 font-medium transition-colors"
              >
                Privacy Policy
              </button>
            </div>

            {/* Powered By Section */}
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Powered by</p>
              <img
                src={kadoshLogo}
                alt="Kadosh AI"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
      </div>
    </div>
  );
};