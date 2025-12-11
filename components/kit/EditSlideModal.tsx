import React from 'react';
import { Slide } from '../../types';
import { Edit2, X, Save } from 'lucide-react';

interface EditSlideModalProps {
  slideData: Slide;
  onSave: () => void;
  onClose: () => void;
  onChange: (data: Slide) => void;
}

export const EditSlideModal: React.FC<EditSlideModalProps> = ({
  slideData,
  onSave,
  onClose,
  onChange
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-slide-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 id="edit-slide-title" className="text-lg font-bold text-slate-900 flex items-center">
            <Edit2 className="w-4 h-4 mr-2 text-indigo-600" />
            Edit Slide Content
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slide Title</label>
            <input
              type="text"
              value={slideData.title}
              onChange={(e) => onChange({ ...slideData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bullet Points <span className="text-slate-400 font-normal ml-1">(One per line)</span>
            </label>
            <textarea
              value={slideData.content.join('\n')}
              onChange={(e) => onChange({ ...slideData, content: e.target.value.split('\n') })}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Speaker Notes</label>
            <textarea
              value={slideData.speakerNotes}
              onChange={(e) => onChange({ ...slideData, speakerNotes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y bg-amber-50/50 border-amber-200"
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};