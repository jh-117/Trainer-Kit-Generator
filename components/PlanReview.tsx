import React from 'react';
import { TrainingPlan } from '../types';
import { Clock, Target, Lightbulb, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';

interface PlanReviewProps {
  plan: TrainingPlan;
  onConfirm: () => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const PlanReview: React.FC<PlanReviewProps> = ({ plan, onConfirm, onCancel, isGenerating }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Review Training Plan</h2>
          <p className="text-slate-500 mt-1">We've structured your topic. Ready to generate assets?</p>
        </div>
        <button
          onClick={onCancel}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
            <div className="flex items-center text-sm text-slate-500 mb-6">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                Target: {plan.targetAudience}
              </span>
            </div>

            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
              Learning Objectives
            </h4>
            <ul className="space-y-2 mb-8">
              {plan.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start text-slate-600 text-sm">
                  <span className="mr-2">•</span>
                  {obj}
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Course Modules
            </h4>
            <div className="space-y-4">
              {plan.modules.map((mod, i) => (
                <div key={i} className="border-l-4 border-indigo-500 pl-4 py-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-slate-900">{mod.title}</h5>
                    <span className="text-xs font-semibold text-slate-400">{mod.durationMinutes} min</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <h4 className="font-semibold text-amber-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-amber-600" />
              AI Suggestions
            </h4>
            <ul className="space-y-3">
              {plan.suggestedEnhancements.map((sugg, i) => (
                <li key={i} className="text-sm text-amber-800 bg-white/60 p-3 rounded-lg border border-amber-100/50">
                  {sugg}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
             <h4 className="font-semibold text-slate-900 mb-2">Assets to Generate</h4>
             <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>PowerPoint Slide Content</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Interactive Flashcards</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Facilitator Guide</li>
                <li className="flex items-center"><div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>Participant Handout</li>
             </ul>
          </div>

          <button
            onClick={onConfirm}
            disabled={isGenerating}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                 <Wand2 className="w-5 h-5 animate-spin" />
                 <span>Generating Assets...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Full Kit</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
