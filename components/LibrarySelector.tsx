import React, { useState } from 'react';
import { 
  Search, Shield, MessageSquare, Users, Heart, TrendingUp, Globe, Code, Lock, Zap, Download,
  Scale, DollarSign, HardHat, Lightbulb, Briefcase, Megaphone, CheckSquare, ClipboardCheck, 
  Truck, Clock, Palette, Star, Smile, Box, BookOpen
} from 'lucide-react';

interface LibraryItem {
  industry: string;
  topic: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const LIBRARY_ITEMS: LibraryItem[] = [
  { 
    industry: 'Technology', 
    topic: 'Agile Methodology', 
    description: 'Mastering Scrum, Kanban, and iterative development for faster delivery.', 
    icon: Zap, 
    color: 'bg-blue-100 text-blue-600 border-blue-200' 
  },
  { 
    industry: 'Corporate', 
    topic: 'Business Ethics & Compliance', 
    description: 'Navigating ethical dilemmas and maintaining integrity in the workplace.', 
    icon: Scale, 
    color: 'bg-slate-100 text-slate-600 border-slate-200' 
  },
  { 
    industry: 'Technology', 
    topic: 'Cybersecurity Fundamentals', 
    description: 'Essential security practices, phishing awareness, and data protection.', 
    icon: Shield, 
    color: 'bg-red-100 text-red-600 border-red-200' 
  },
  { 
    industry: 'HR', 
    topic: 'Diversity & Inclusion', 
    description: 'Building a respectful, inclusive workplace culture and understanding bias.', 
    icon: Globe, 
    color: 'bg-teal-100 text-teal-600 border-teal-200' 
  },
  { 
    industry: 'Soft Skills', 
    topic: 'Emotional Intelligence', 
    description: 'Developing self-awareness and empathy to improve team dynamics.', 
    icon: Heart, 
    color: 'bg-rose-100 text-rose-600 border-rose-200' 
  },
  { 
    industry: 'Finance', 
    topic: 'Financial Literacy 101', 
    description: 'Understanding P&L, balance sheets, and corporate finance basics.', 
    icon: DollarSign, 
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200' 
  },
  { 
    industry: 'Legal', 
    topic: 'GDPR & Data Privacy', 
    description: 'Ensuring compliance with global data protection regulations.', 
    icon: Lock, 
    color: 'bg-orange-100 text-orange-600 border-orange-200' 
  },
  { 
    industry: 'Manufacturing', 
    topic: 'Health & Safety (OSHA)', 
    description: 'Hazard recognition, PPE usage, and maintaining a safe shop floor.', 
    icon: HardHat, 
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200' 
  },
  { 
    industry: 'Strategy', 
    topic: 'Innovation Management', 
    description: 'Fostering creativity and managing the product innovation lifecycle.', 
    icon: Lightbulb, 
    color: 'bg-amber-100 text-amber-600 border-amber-200' 
  },
  { 
    industry: 'Technology', 
    topic: 'JavaScript Basics', 
    description: 'Introduction to web development logic and syntax for beginners.', 
    icon: Code, 
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200' 
  },
  { 
    industry: 'Sales', 
    topic: 'Key Account Management', 
    description: 'Strategies for retaining and growing your most valuable client relationships.', 
    icon: Briefcase, 
    color: 'bg-violet-100 text-violet-600 border-violet-200' 
  },
  { 
    industry: 'Management', 
    topic: 'Leadership Essentials', 
    description: 'Transitioning from individual contributor to effective team leader.', 
    icon: Users, 
    color: 'bg-purple-100 text-purple-600 border-purple-200' 
  },
  { 
    industry: 'Marketing', 
    topic: 'Marketing Fundamentals', 
    description: 'Core concepts of the 4Ps, digital channels, and brand positioning.', 
    icon: Megaphone, 
    color: 'bg-pink-100 text-pink-600 border-pink-200' 
  },
  { 
    industry: 'Sales', 
    topic: 'Negotiation Tactics', 
    description: 'Closing deals with win-win outcomes and overcoming objections.', 
    icon: TrendingUp, 
    color: 'bg-green-100 text-green-600 border-green-200' 
  },
  { 
    industry: 'HR', 
    topic: 'Onboarding Excellence', 
    description: 'Structuring the first 90 days for new hire success and retention.', 
    icon: BookOpen, 
    color: 'bg-cyan-100 text-cyan-600 border-cyan-200' 
  },
  { 
    industry: 'Operations', 
    topic: 'Project Management (PMP)', 
    description: 'Initiating, planning, executing, and closing projects successfully.', 
    icon: CheckSquare, 
    color: 'bg-blue-50 text-blue-600 border-blue-200' 
  },
  { 
    industry: 'Manufacturing', 
    topic: 'Quality Assurance (QA)', 
    description: 'Implementing ISO standards and continuous improvement cycles.', 
    icon: ClipboardCheck, 
    color: 'bg-slate-200 text-slate-700 border-slate-300' 
  },
  { 
    industry: 'Management', 
    topic: 'Remote Team Management', 
    description: 'Building culture and productivity in distributed workforces.', 
    icon: Globe, 
    color: 'bg-sky-100 text-sky-600 border-sky-200' 
  },
  { 
    industry: 'Logistics', 
    topic: 'Supply Chain Basics', 
    description: 'Understanding logistics, inventory, and distribution networks.', 
    icon: Truck, 
    color: 'bg-stone-100 text-stone-600 border-stone-200' 
  },
  { 
    industry: 'Productivity', 
    topic: 'Time Management', 
    description: 'Prioritization techniques like Eisenhower Matrix and Pomodoro.', 
    icon: Clock, 
    color: 'bg-lime-100 text-lime-600 border-lime-200' 
  },
  { 
    industry: 'Design', 
    topic: 'User Experience (UX)', 
    description: 'Designing intuitive products with a user-centered approach.', 
    icon: Palette, 
    color: 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200' 
  },
  { 
    industry: 'Corporate', 
    topic: 'Values & Company Culture', 
    description: 'Aligning employee behavior with organizational mission and vision.', 
    icon: Star, 
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200' 
  },
  { 
    industry: 'HR', 
    topic: 'Workplace Wellness', 
    description: 'Promoting mental health, stress management, and work-life balance.', 
    icon: Smile, 
    color: 'bg-green-50 text-green-600 border-green-200' 
  },
  { 
    industry: 'Global', 
    topic: 'Cross-Cultural Comm', 
    description: 'Navigating cultural differences in international business.', 
    icon: Globe, 
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200' 
  },
  { 
    industry: 'Logistics', 
    topic: 'Yield Management', 
    description: 'Optimizing inventory and pricing for maximum profitability.', 
    icon: Box, 
    color: 'bg-orange-50 text-orange-600 border-orange-200' 
  },
  { 
    industry: 'Technology', 
    topic: 'Zero Trust Architecture', 
    description: 'Modern security framework: never trust, always verify.', 
    icon: Lock, 
    color: 'bg-red-50 text-red-600 border-red-200' 
  },
];

interface LibrarySelectorProps {
  onSelect: (industry: string, topic: string) => void;
}

export const LibrarySelector: React.FC<LibrarySelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(LIBRARY_ITEMS.map(item => item.industry))).sort()];

  const filteredItems = LIBRARY_ITEMS.filter(item => {
    const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || item.industry === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ready-made kits..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === cat 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(item.industry, item.topic)}
              className="group flex flex-col items-start p-5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative overflow-hidden"
            >
              <div className="flex justify-between w-full">
                <div className={`p-3 rounded-lg mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider h-fit flex items-center">
                  <Download className="w-3 h-3 mr-1" />
                  Ready
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 mb-1">{item.topic}</h3>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{item.industry}</p>
              <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
            </button>
          );
        })}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            <p>No templates found matching your search.</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
