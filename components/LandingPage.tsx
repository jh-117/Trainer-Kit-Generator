import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Presentation, FileText, Zap, Download, Layers, Users } from 'lucide-react';
import kadoshLogo from '../assets/kadoshAI.png';
import BackgroundMusic from './BackgroundMusic';
import themeMusic from '../assets/trainer-theme.mp3';

interface LandingPageProps {
  onStart: () => void;
  onBrowseTemplates: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBrowseTemplates }) => {
  const navigate = useNavigate();

  const handlePrivacyPolicyClick = () => {
    navigate('/privacy-policy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <BackgroundMusic src={themeMusic} />

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Layers className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">TrainerKit GenAI</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onBrowseTemplates}
                className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium"
              >
                Templates
              </button>
              <button
                onClick={onStart}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Start Generating
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create Corporate Training,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                In Seconds, Not Days
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Instantly generate professional slide decks, facilitator guides, participant handouts, 
              and flashcards from a simple topic or document upload.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onStart}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all group flex items-center"
              >
                Start Generating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Presentation className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Slide Decks</h3>
              <p className="text-gray-600">
                Get professionally structured presentations with speaker notes and AI-curated 
                background imagery ready for PowerPoint.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Guides</h3>
              <p className="text-gray-600">
                Generate detailed Facilitator Guides with timelines and Participant Handouts 
                in clean Markdown or PDF formats.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Learning</h3>
              <p className="text-gray-600">
                Reinforce learning with automatically generated flashcards and role-playing 
                scenarios tailored to your industry.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Topic</h3>
                <p className="text-gray-600">Describe your training topic or upload a document</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Plan</h3>
                <p className="text-gray-600">AI generates a comprehensive training outline for your approval</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Kit</h3>
                <p className="text-gray-600">Create full training materials with one click</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Download & Use</h3>
                <p className="text-gray-600">Export to PPTX, PDF, or Markdown and start training</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 border-t border-gray-200 pt-16 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Industries Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">10x</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Faster Creation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">PPTX</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Native Export</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">4.0</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Model Capabilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Updated to match the image */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Privacy Policy Link */}
            <div className="text-center">
              <button 
                onClick={handlePrivacyPolicyClick}
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors text-base"
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

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Knowledge Librarian. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};