import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
  title: string;
  showPrintButton?: boolean;
}

const MarkdownComponents: any = {
  h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-2 print:text-black print:border-black" {...props} />,
  h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold text-slate-800 mt-6 mb-3 print:text-black" {...props} />,
  h3: ({node, ...props}: any) => <h3 className="text-xl font-bold text-slate-800 mt-5 mb-2 print:text-black" {...props} />,
  p: ({node, ...props}: any) => <p className="text-slate-700 leading-relaxed mb-4 print:text-black" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 print:text-black" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-700 print:text-black" {...props} />,
  li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-6 bg-slate-50 text-slate-700 italic rounded-r-lg print:border-black print:bg-transparent print:text-black" {...props} />,
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
    return <code className="font-mono text-sm leading-relaxed" {...props}>{children}</code>;
  },
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

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, title, showPrintButton }) => {
  return (
    <div className="bg-white p-12 rounded-xl shadow-lg border border-slate-100 mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none max-w-[210mm] min-h-[297mm] animate-in fade-in slide-in-from-bottom-2">
      {showPrintButton && (
        <div className="flex justify-end mb-8 border-b border-slate-100 pb-4 print:hidden">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2"/> Print {title}
          </button>
        </div>
      )}
      
      <div className="prose prose-indigo max-w-none prose-headings:font-bold">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={MarkdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
      
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
      `}</style>
    </div>
  );
};