import React, { useState } from 'react';
import { GeneratedKit, Slide, Flashcard } from '../types';
import { Layout, Presentation, FileText, StickyNote, Download, ChevronLeft, ChevronRight, FlipHorizontal, Maximize2, Edit2, X, Save, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';
import { jsPDF } from 'jspdf';

interface KitResultsProps {
  kit: GeneratedKit;
  onReset: () => void;
  onUpdateKit: (kit: GeneratedKit) => void;
}

interface SlideViewProps {
  slide: Slide;
  index: number;
  total: number;
  onEdit: () => void;
  direction: 'next' | 'prev';
  imageSeed: number;
  onRefreshImage: () => void;
}

// Helper to convert URL to Base64 for reliable PPTX embedding
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Failed to convert image to base64", error);
    return "";
  }
};

// Helper to strip markdown symbols for clean text output
const stripMarkdown = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/__(.*?)__/g, '$1')     // Bold
    .replace(/_(.*?)_/g, '$1')       // Italic
    .replace(/`([^`]+)`/g, '$1')     // Code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
};

const SlideView: React.FC<SlideViewProps> = ({ slide, index, total, onEdit, direction, imageSeed, onRefreshImage }) => {
  const [showNotes, setShowNotes] = useState(false);
  
  // Use the slide-specific visual search term if available, otherwise fallback to a generic term.
  const searchTerm = slide.visualSearchTerm || slide.title;
  // Append seed to force refresh when requested
  const bgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(searchTerm + " high quality professional corporate business stock photo unsplash pexels")}?width=1280&height=720&nologo=true&model=flux&seed=${index + imageSeed}`;

  const animationClass = direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <article 
      className={`bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 h-full flex flex-col relative group aspect-video ${animationClass}`}
      aria-label={`Slide ${index + 1}: ${slide.title}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-slate-800" aria-hidden="true">
         <img 
            src={bgUrl} 
            alt=""
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[30s] ease-linear"
            loading="lazy"
         />
         {/* Advanced Gradient Overlay for maximum readability */}
         <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
      </div>

      {/* Control Actions */}
      <div className="absolute top-4 right-4 z-30 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <button 
          onClick={(e) => { e.stopPropagation(); onRefreshImage(); }}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Regenerate Background Image"
          aria-label="Regenerate Background Image"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Edit Slide Content"
        >
          <Edit2 className="w-4 h-4" />
          <span className="text-xs font-medium hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex flex-col h-full p-8 md:p-12 lg:p-16">
        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight drop-shadow-xl max-w-4xl font-display">
                {slide.title}
            </h3>
            <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest bg-indigo-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-indigo-500/30 shrink-0 ml-4 shadow-inner" aria-hidden="true">
                {index + 1} / {total}
            </div>
        </div>
        
        <div className="flex-grow">
          <ul className="space-y-6">
            {slide.content.map((point, i) => (
              <li key={i} className="flex items-start group/item">
                <span 
                  className="flex-shrink-0 w-2.5 h-2.5 mt-3 rounded-full bg-indigo-400 mr-5 group-hover/item:bg-indigo-300 group-hover/item:shadow-[0_0_15px_rgba(129,140,248,0.6)] transition-all"
                  aria-hidden="true"
                ></span>
                <span className="text-xl md:text-2xl text-slate-100 font-light leading-relaxed tracking-wide shadow-black drop-shadow-md">
                    {/* Render stripped markdown for clean view if needed, but react-markdown is usually better for web. 
                        Here we keep it simple text as per the Slide interface, assuming content is plain strings mostly. 
                        If content has markdown, we strip it for the visual slide view to match the export style. */}
                    {stripMarkdown(point)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6 flex justify-between items-end opacity-80">
            <div className="flex items-center space-x-3">
              <div className="h-1 w-12 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">TrainerKit GenAI</div>
            </div>
            
            {/* Desktop Notes Toggle */}
            <button
               onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}
               className="hidden md:flex items-center text-xs text-slate-400 hover:text-white transition-colors bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               aria-expanded={showNotes}
               aria-label={showNotes ? "Hide Speaker Notes" : "Show Speaker Notes"}
            >
               {showNotes ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
               Speaker Notes
            </button>
        </div>
      </div>

      {/* Speaker Notes Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl p-8 border-t border-indigo-500/30 transition-all duration-300 transform z-20 ${showNotes ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        role="region"
        aria-label="Speaker Notes"
      >
        <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
              <StickyNote className="w-3 h-3 mr-2"/> 
              Speaker Notes
            </p>
            <button onClick={() => setShowNotes(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
            </button>
        </div>
        <p className="text-base text-slate-200 leading-relaxed font-light">{slide.speakerNotes}</p>
      </div>
    </article>
  );
};

const FlashcardView: React.FC<{ card: Flashcard; index: number }> = ({ card, index }) => {
  const [flipped, setFlipped] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped(!flipped);
    }
  };

  return (
    <div 
      className="perspective-1000 w-full h-64 cursor-pointer group focus:outline-none"
      onClick={() => setFlipped(!flipped)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`Flashcard ${index + 1}. Currently showing ${flipped ? 'Back' : 'Front'}. ${flipped ? 'Answer: ' + card.back : 'Question: ' + card.front}. Press Enter to flip.`}
    >
      <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md border border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:shadow-lg hover:border-indigo-300 transition-all"
          aria-hidden={flipped}
        >
            <div className="text-xs text-indigo-500 font-bold uppercase mb-4 tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Card {index + 1}</div>
            <h3 className="text-xl font-bold text-slate-800">{card.front}</h3>
            <div className="mt-4 text-xs text-slate-400 group-hover:text-indigo-500 flex items-center font-medium">
                <FlipHorizontal className="w-4 h-4 mr-1" />
                Click or Press Enter to flip
            </div>
        </div>
        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-center"
          aria-hidden={!flipped}
        >
            <p className="text-white font-medium text-lg leading-relaxed">{card.back}</p>
        </div>
      </div>
    </div>
  );
};

// Custom styles for Markdown components
const MarkdownComponents: any = {
  h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 print:text-black print:border-black" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3 print:text-black" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-xl font-bold text-slate-800 mt-5 mb-2 print:text-black" {...props} />,
  p: ({node, ...props}: any) => <p className="text-slate-700 leading-relaxed mb-4 print:text-black" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 print:text-black" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-700 print:text-black" {...props} />,
  li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-6 bg-slate-50 text-slate-700 italic rounded-r-lg print:border-black print:bg-transparent print:text-black" {...props} />,
  // Code block styling
  pre: ({node, ...props}: any) => (
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-6 shadow-inner border border-slate-700 print:bg-slate-100 print:text-black print:border-black" {...props} />
  ),
  code: ({node, inline, className, children, ...props}: any) => {
    if (inline) {
      return (
        <code 
          className="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 print:border-black print:text-black" 
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-sm leading-relaxed" {...props}>
        {children}
      </code>
    );
  },
  // Table styling
  table: ({node, ...props}: any) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-slate-200 shadow-sm print:border-black">
      <table className="min-w-full divide-y divide-slate-200 print:divide-black" {...props} />
    </div>
  ),
  thead: ({node, ...props}: any) => <thead className="bg-slate-50 print:bg-transparent" {...props} />,
  th: ({node, ...props}: any) => (
    <th 
      className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 print:text-black print:border-black print:bg-transparent" 
      {...props} 
    />
  ),
  tbody: ({node, ...props}: any) => <tbody className="bg-white divide-y divide-slate-200 print:divide-black" {...props} />,
  tr: ({node, ...props}: any) => <tr className="hover:bg-slate-50 transition-colors" {...props} />,
  td: ({node, ...props}: any) => <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 leading-normal print:text-black" {...props} />,
  a: ({node, ...props}: any) => <a className="text-indigo-600 hover:text-indigo-800 underline transition-colors print:text-black print:no-underline" {...props} />,
  hr: ({node, ...props}: any) => <hr className="my-8 border-slate-200 print:border-black" {...props} />,
};

// Enhanced PDF generation with branding and markdown cleanup
const createStyledPdf = (title: string, markdownContent: string): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;
  
  let y = 0;

  // Header Bar
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  // Header Text
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(title, margin, 17);

  y = 40;
  
  // Content Parser
  const lines = markdownContent.split('\n');
  
  lines.forEach(line => {
    // Check for page break
    if (y > pageHeight - margin) { 
      doc.addPage(); 
      // Add simplified header on subsequent pages
      doc.setFillColor(79, 70, 229); 
      doc.rect(0, 0, pageWidth, 10, 'F');
      y = 25; 
    }

    if (line.trim() === '') {
        y += 5;
        return;
    }

    // Helper to print text segments with bolding support
    const printFormattedLine = (text: string, x: number, currentY: number, fontSize: number, isHeader = false) => {
        // Simple parser for **bold** text
        const parts = text.split(/(\*\*.*?\*\*)/g);
        let currentX = x;
        let maxLineHeight = 0;

        // Note: This is a simplified line printer and doesn't fully handle wrapping mixed-style text perfectly.
        // For a robust solution, one would need to measure every token.
        // Here we default to stripping markdown for standard wrapped text to keep layout clean,
        // unless it's a header which we assume fits or we don't wrap.
        
        if (isHeader) {
            const cleanText = stripMarkdown(text);
            doc.setFontSize(fontSize);
            doc.setFont("helvetica", "bold");
            // Set text color based on header level logic from parent
            doc.text(cleanText, x, currentY);
            return 8; // approx header height
        }

        doc.setFontSize(fontSize);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42); // default text color
        
        const cleanText = stripMarkdown(text); // Remove stars for the PDF output
        const splitText = doc.splitTextToSize(cleanText, maxLineWidth);
        
        // Simple bold check: if the original line started with ** and ended with **, bold the whole thing
        // Otherwise just print clean text. Supporting inline bold in jsPDF splitTextToSize is non-trivial without a complex plugin.
        if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
           doc.setFont("helvetica", "bold");
        }

        doc.text(splitText, x, currentY);
        return splitText.length * 6; // return height used
    };

    if (line.startsWith('# ')) {
        doc.setTextColor(30, 41, 59);
        y += printFormattedLine(line.replace('# ', ''), margin, y, 20, true) + 4;
    } else if (line.startsWith('## ')) {
        doc.setTextColor(51, 65, 85);
        y += printFormattedLine(line.replace('## ', ''), margin, y, 16, true) + 2;
    } else if (line.startsWith('### ')) {
        doc.setTextColor(71, 85, 105);
        y += printFormattedLine(line.replace('### ', ''), margin, y, 14, true);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
        const bulletText = "• " + line.substring(2);
        y += printFormattedLine(bulletText, margin + 2, y, 11);
    } else {
        y += printFormattedLine(line, margin, y, 11);
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated by TrainerKit GenAI - Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  return doc.output('blob');
};

const generateFlashcardsPdfBlob = (flashcards: Flashcard[]): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header Bar
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Study Flashcards", margin, 17);
  
  let y = 40;
  const cardHeight = 60;
  
  flashcards.forEach((card, index) => {
     if (y + cardHeight > pageHeight - margin) {
         doc.addPage();
         // Header on new page
         doc.setFillColor(79, 70, 229); 
         doc.rect(0, 0, pageWidth, 10, 'F');
         y = 25;
     }

     // Card Container
     doc.setDrawColor(200, 200, 200);
     doc.setLineWidth(0.5);
     doc.rect(margin, y, pageWidth - (margin * 2), cardHeight);
     
     // Card Content
     doc.setFontSize(10);
     doc.setTextColor(100, 100, 100);
     doc.text(`Card ${index + 1} - Front`, margin + 5, y + 10);
     
     doc.setFontSize(14);
     doc.setTextColor(0, 0, 0);
     doc.setFont("helvetica", "bold");
     const frontLines = doc.splitTextToSize(stripMarkdown(card.front), pageWidth - (margin * 2) - 10);
     doc.text(frontLines, margin + 5, y + 20);
     
     // Divider
     doc.setDrawColor(240, 240, 240);
     doc.line(margin + 5, y + 35, pageWidth - margin - 5, y + 35);

     doc.setFontSize(10);
     doc.setTextColor(100, 100, 100);
     doc.setFont("helvetica", "normal");
     doc.text(`Back`, margin + 5, y + 45);

     doc.setFontSize(12);
     doc.setTextColor(50, 50, 50);
     const backLines = doc.splitTextToSize(stripMarkdown(card.back), pageWidth - (margin * 2) - 10);
     doc.text(backLines, margin + 5, y + 53);

     y += cardHeight + 10;
  });

  return doc.output('blob');
};


export const KitResults: React.FC<KitResultsProps> = ({ kit, onReset, onUpdateKit }) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'flashcards' | 'guide' | 'handout'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageSeeds, setImageSeeds] = useState<Record<number, number>>({});
  
  // Editing State
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlideData, setEditingSlideData] = useState<Slide | null>(null);

  const tabs = [
    { id: 'slides', label: 'Presentation', icon: Presentation },
    { id: 'flashcards', label: 'Flashcards', icon: StickyNote },
    { id: 'guide', label: 'Facilitator Guide', icon: Layout },
    { id: 'handout', label: 'Handout', icon: FileText },
  ];

  const handleEditClick = () => {
    setEditingSlideData({ ...kit.slides[currentSlide] });
    setIsEditingSlide(true);
  };

  const handleRefreshImage = () => {
    setImageSeeds(prev => ({
      ...prev,
      [currentSlide]: (prev[currentSlide] || 0) + 1
    }));
  };

  const handleSaveSlide = () => {
    if (!editingSlideData) return;

    // Create a new kit object with the updated slide
    const updatedSlides = [...kit.slides];
    updatedSlides[currentSlide] = editingSlideData;
    
    const updatedKit = {
      ...kit,
      slides: updatedSlides
    };

    onUpdateKit(updatedKit);
    setIsEditingSlide(false);
  };

  const handleNextSlide = () => {
    if (currentSlide < kit.slides.length - 1) {
      setSlideDirection('next');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('prev');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // @ts-ignore
      const zip = new JSZip();
      
      // 1. Generate PPTX with Full Visual Styling (Images + Transitions)
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';
      pptx.author = 'TrainerKit GenAI';
      pptx.company = 'TrainerKit';
      pptx.title = kit.slides[0]?.title || 'Training Presentation';

      // Prepare all slide images first
      const slideImages = await Promise.all(kit.slides.map(async (s, i) => {
         const seed = i + (imageSeeds[i] || 0);
         const searchTerm = s.visualSearchTerm || s.title;
         const bgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(searchTerm + " high quality professional corporate business stock photo")}?width=1280&height=720&nologo=true&model=flux&seed=${seed}`;
         return await urlToBase64(bgUrl);
      }));

      // Build slides manually to ensure layer order (Image -> Overlay -> Text)
      kit.slides.forEach((s, i) => {
         const slide = pptx.addSlide();
         
         // A. Background Image (Matches Web View)
         // Use the pre-fetched base64 data to avoid "Picture can't be displayed" in PowerPoint
         const bgData = slideImages[i];
         if (bgData) {
            slide.addImage({ 
                data: bgData, 
                x: 0, y: 0, w: '100%', h: '100%',
                sizing: { type: 'cover', w: '100%', h: '100%' }
            });
         } else {
             // Fallback gradient if image fails
             slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:'100%', h:'100%', fill:{color:'1E293B'} });
         }

         // B. Dark Overlay for Readability
         slide.addShape(pptx.ShapeType.rect, { 
            x: 0, y: 0, w: '100%', h: '100%', 
            fill: { color: '0F172A', transparency: 30 } // 70% opacity black/slate overlay
         });
         
         // C. Slide Transition (Fade)
         // @ts-ignore - transition property exists in newer pptxgenjs types
         slide.transition = { type: 'fade', duration: 800 };

         // D. Content Layers
         if (i === 0) {
             // Title Slide
             slide.addText(stripMarkdown(s.title), { 
                 x: 0.5, y: 2.5, w: '90%', h: 2, 
                 fontSize: 48, fontFace: 'Arial', bold: true, color: 'FFFFFF', align: 'center',
                 shadow: { type: 'outer', color: '000000', blur: 3, offset: 2, opacity: 0.5 }
             });
             slide.addText("Generated Training Module", {
                 x: 0.5, y: 4.5, w: '90%', h: 1,
                 fontSize: 20, fontFace: 'Arial', color: 'CBD5E1', align: 'center'
             });
         } else {
             // Content Slide
             slide.addText(stripMarkdown(s.title), { 
                 x: 0.5, y: 0.5, w: '90%', h: 1, 
                 fontSize: 36, fontFace: 'Arial', bold: true, color: 'FFFFFF',
                 shadow: { type: 'outer', color: '000000', blur: 2, offset: 1, opacity: 0.4 }
             });
             
             // Divider Accent
             slide.addShape(pptx.ShapeType.line, { x:0.5, y:1.4, w:9, h:0, line:{color:'6366F1', width:3} }); 

             // Bullets - Strip markdown from content points
             const bulletItems = s.content.map(c => ({ 
                 text: stripMarkdown(c), 
                 options: { 
                     fontSize: 20, 
                     color: 'E2E8F0', 
                     breakLine: true, 
                     bullet: { type: 'bullet' as const, characterCode: '2022' }, 
                     paraSpaceAfter: 15 
                 } 
             }));
             
             slide.addText(bulletItems, { x: 0.5, y: 1.8, w: '90%', h: 4.8, margin: 0.1, valign: 'top' });
             
             // Slide Number
             slide.addText(`${i + 1}`, { x: 12.5, y: 7, w: 0.5, h: 0.3, fontSize: 12, color: '94A3B8' });
         }

         // Speaker Notes
         slide.addNotes(stripMarkdown(s.speakerNotes));
      });

      const pptxBlob = await pptx.write({ outputType: 'blob' }) as Blob;
      zip.file("Training_Presentation.pptx", pptxBlob);
      
      // 2. Generate Professional PDFs
      const guideBlob = createStyledPdf("Facilitator Guide", kit.facilitatorGuideMarkdown);
      zip.file("Facilitator_Guide.pdf", guideBlob);

      const handoutBlob = createStyledPdf("Participant Handout", kit.handoutMarkdown);
      zip.file("Participant_Handout.pdf", handoutBlob);
      
      const flashcardsBlob = generateFlashcardsPdfBlob(kit.flashcards);
      zip.file("Flashcards.pdf", flashcardsBlob);

      // Generate zip blob
      const content = await zip.generateAsync({ type: "blob" });
      
      // Trigger download
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = kit.slides[0]?.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30) || 'TrainerKit';
      link.download = `TrainerKit_${safeTitle}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to create download package. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 print:space-y-0 print:max-w-none print:w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Trainer Kit</h2>
          <p className="text-slate-500">Ready for download and delivery.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm hover:shadow transition-all"
          >
            New Kit
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
          >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Bundling..." : "Download Package"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="flex overflow-x-auto pb-2 border-b border-slate-200 space-x-1 print:hidden"
        role="tablist"
        aria-label="Content Views"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 rounded-t-lg font-medium transition-all text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isActive 
                  ? 'bg-white border-x border-t border-slate-200 text-indigo-600 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] translate-y-[1px]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[600px] mt-6 print:mt-0 print:min-h-0" role="tabpanel" id={`${activeTab}-panel`}>
        {/* SLIDES TAB */}
        {activeTab === 'slides' && (
          <div className="space-y-6 print:hidden">
            <div className="flex justify-center items-center space-x-6 mb-4">
              <button 
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                aria-label="Previous Slide"
                className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-600 shadow-md border border-slate-100 disabled:opacity-30 transition-all hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-center" aria-live="polite">
                 <span className="block text-xl font-bold text-slate-800 tabular-nums">
                   {currentSlide + 1} <span className="text-slate-300 font-light mx-1">/</span> {kit.slides.length}
                 </span>
                 <span className="text-xs text-slate-400 uppercase tracking-widest">Slide</span>
              </div>
              <button 
                onClick={handleNextSlide}
                disabled={currentSlide === kit.slides.length - 1}
                aria-label="Next Slide"
                className="p-3 rounded-full bg-white hover:bg-slate-50 text-slate-600 shadow-md border border-slate-100 disabled:opacity-30 transition-all hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="max-w-5xl mx-auto w-full">
               <SlideView 
                  key={currentSlide}
                  slide={kit.slides[currentSlide]} 
                  index={currentSlide} 
                  total={kit.slides.length}
                  onEdit={handleEditClick}
                  direction={slideDirection}
                  imageSeed={imageSeeds[currentSlide] || 0}
                  onRefreshImage={handleRefreshImage}
               />
               
               {/* Mobile Speaker Notes (Visible below slide on small screens) */}
               <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm md:hidden">
                  <p className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center">
                    <StickyNote className="w-4 h-4 mr-2"/> Speaker Notes
                  </p>
                  <p className="text-sm text-slate-600 italic leading-relaxed">{kit.slides[currentSlide].speakerNotes}</p>
               </div>
            </div>
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:hidden">
            {kit.flashcards.map((card, i) => (
              <FlashcardView key={i} card={card} index={i} />
            ))}
          </div>
        )}

        {/* GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100 print:hidden animate-in fade-in slide-in-from-bottom-2">
             <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {kit.facilitatorGuideMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* HANDOUT TAB */}
        {activeTab === 'handout' && (
          <div className="bg-white p-12 rounded-xl shadow-lg border border-slate-100 mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none max-w-[210mm] min-h-[297mm] animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-end mb-8 no-print border-b border-slate-100 pb-4 print:hidden">
               <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center transition-colors">
                 <Download className="w-4 h-4 mr-2"/> Print Handout
               </button>
            </div>
             <div className="prose prose-indigo max-w-none prose-headings:font-bold">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {kit.handoutMarkdown}
              </ReactMarkdown>
            </div>
            {/* Print Styles */}
            <style>{`
              @media print {
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  background-color: white;
                }
              }
              
              @keyframes slideInFromRight {
                0% { opacity: 0; transform: translateX(40px) scale(0.95); }
                100% { opacity: 1; transform: translateX(0) scale(1); }
              }
              @keyframes slideInFromLeft {
                0% { opacity: 0; transform: translateX(-40px) scale(0.95); }
                100% { opacity: 1; transform: translateX(0) scale(1); }
              }
              .animate-slide-in-right {
                animation: slideInFromRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              }
              .animate-slide-in-left {
                animation: slideInFromLeft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Edit Slide Modal */}
      {isEditingSlide && editingSlideData && (
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
                onClick={() => setIsEditingSlide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  value={editingSlideData.title}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bullet Points <span className="text-slate-400 font-normal ml-1">(One per line)</span>
                </label>
                <textarea
                  value={editingSlideData.content.join('\n')}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, content: e.target.value.split('\n') })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Speaker Notes</label>
                <textarea
                  value={editingSlideData.speakerNotes}
                  onChange={(e) => setEditingSlideData({ ...editingSlideData, speakerNotes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y bg-amber-50/50 border-amber-200"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsEditingSlide(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlide}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for card flip effect */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};