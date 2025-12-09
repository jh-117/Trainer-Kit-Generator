import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { PlanReview } from './components/PlanReview';
import { KitResults } from './components/KitResults';
import { LandingPage } from './components/LandingPage';
import { generateTrainingPlan, generateFullKit } from './services/geminiService';
import { AppState, TrainingInput, TrainingPlan, GeneratedKit } from './types';
import { Layers } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [kit, setKit] = useState<GeneratedKit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputTab, setInputTab] = useState<'create' | 'library'>('create');

  const handleStart = () => {
    setInputTab('create');
    setState(AppState.INPUT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseTemplates = () => {
    setInputTab('library');
    setState(AppState.INPUT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputSubmit = async (input: TrainingInput) => {
    try {
      setState(AppState.ANALYZING);
      setError(null);
      const generatedPlan = await generateTrainingPlan(input);
      setPlan(generatedPlan);
      setState(AppState.REVIEW);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze input. Please try again.");
      setState(AppState.INPUT);
    }
  };

  const handleGenerateKit = async () => {
    if (!plan) return;
    try {
      setState(AppState.GENERATING);
      setError(null);
      const generatedKit = await generateFullKit(plan);
      setKit(generatedKit);
      setState(AppState.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate kit content.");
      setState(AppState.REVIEW);
    }
  };

  const handleKitSelected = (selectedKit: GeneratedKit) => {
    setKit(selectedKit);
    // Directly go to results as the kit is already "generated"
    setState(AppState.RESULTS);
    setError(null);
  };

  const handleReset = () => {
    setState(AppState.INPUT);
    setPlan(null);
    setKit(null);
    setError(null);
  };

  const handleHomeClick = () => {
    setState(AppState.LANDING);
    setPlan(null);
    setKit(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">TrainerKit GenAI</span>
          </div>
        
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 print:p-0 w-full relative overflow-hidden">
        {/* Decorative Background Elements */}
        {state === AppState.LANDING && (
           <>
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[100px]" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
             </div>
           </>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md w-full text-center relative z-10">
            {error}
          </div>
        )}

        <div className="w-full relative z-10">
          {state === AppState.LANDING && (
            <LandingPage onStart={handleStart} onBrowseTemplates={handleBrowseTemplates} />
          )}

          {state === AppState.INPUT || state === AppState.ANALYZING ? (
            <InputSection 
              onSubmit={handleInputSubmit}
              onKitSelect={handleKitSelected}
              isProcessing={state === AppState.ANALYZING} 
              initialTab={inputTab}
            />
          ) : null}

          {state === AppState.REVIEW || state === AppState.GENERATING ? (
            plan && (
              <PlanReview 
                plan={plan} 
                onConfirm={handleGenerateKit} 
                onCancel={handleReset}
                isGenerating={state === AppState.GENERATING}
              />
            )
          ) : null}

          {state === AppState.RESULTS && kit ? (
            <KitResults 
              kit={kit} 
              onReset={handleReset} 
              onUpdateKit={setKit}
            />
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto print:hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} TrainerKit GenAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;