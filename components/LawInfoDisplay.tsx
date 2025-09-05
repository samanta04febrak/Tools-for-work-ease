import React, { useState, useMemo, useEffect } from 'react';
import jsPDF from 'jspdf';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import DownloadIcon from './icons/DownloadIcon';

interface LawInfoDisplayProps {
  isLoading: boolean;
  error: string | null;
  lawInfo: string | null;
  hasSelectedLaw: boolean;
  selectedLaw: string;
}

interface LawSection {
  title: string;
  content: string;
}

const parseMarkdownSections = (markdown: string): LawSection[] => {
    if (!markdown) return [];
    const sections: LawSection[] = [];
    const lines = markdown.split('\n');
    let currentSection: LawSection | null = null;

    for (const line of lines) {
        if (line.trim().startsWith('## ')) {
            if (currentSection) {
                sections.push({ ...currentSection, content: currentSection.content.trim() });
            }
            currentSection = {
                title: line.replace('## ', '').trim(),
                content: '',
            };
        } else if (currentSection) {
            currentSection.content += line + '\n';
        }
    }
    if (currentSection) {
        sections.push({ ...currentSection, content: currentSection.content.trim() });
    }
    return sections;
};

const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const lines = content.split('\n');

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-2 mb-4">{listItems}</ul>);
            listItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('* ')) {
            listItems.push(<li key={`li-${i}`} className="text-gray-600 marker:text-indigo-500">{line.substring(2)}</li>);
        } else {
            flushList();
            if (line) {
                 const parts = line.split(/(\*\*.*?\*\*)/g);
                 elements.push(
                     <p key={`p-${i}`} className="text-gray-600 mb-4">
                         {parts.map((part, j) => {
                             if (part.startsWith('**') && part.endsWith('**')) {
                                 return <strong key={j} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
                             }
                             return part;
                         })}
                     </p>
                 );
            }
        }
    }
    flushList(); 

    return <article className="max-w-none">{elements}</article>;
};


const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-10 min-h-[200px]">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="mt-4 text-gray-600">Fetching information...</p>
    </div>
);

const LawInfoDisplay: React.FC<LawInfoDisplayProps> = ({ isLoading, error, lawInfo, hasSelectedLaw, selectedLaw }) => {
  const [activeTopic, setActiveTopic] = useState<LawSection | null>(null);

  const lawSections = useMemo(() => parseMarkdownSections(lawInfo || ''), [lawInfo]);

  useEffect(() => {
    setActiveTopic(null);
  }, [lawInfo]);
  
  const handleDownloadPDF = () => {
    if (!lawInfo || !selectedLaw) return;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let y = 20;

    const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(selectedLaw, pageWidth - margin * 2);
    checkPageBreak(titleLines.length * 8);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 8 + 10;

    doc.setFontSize(12);
    
    lawSections.forEach(section => {
        doc.setFont('helvetica', 'bold');
        const sectionTitleLines = doc.splitTextToSize(section.title, pageWidth - margin * 2);
        checkPageBreak(sectionTitleLines.length * 6 + 10);
        doc.text(sectionTitleLines, margin, y);
        y += sectionTitleLines.length * 6 + 5;

        doc.setFont('helvetica', 'normal');
        const content = section.content
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/^\* /gm, '  • ');
        
        const contentLines = doc.splitTextToSize(content, pageWidth - margin * 2);
        
        if (y + (contentLines.length * 5) > pageHeight - margin) {
            checkPageBreak(contentLines.length * 5 + 10);
        }
        
        doc.text(contentLines, margin, y);
        y += contentLines.length * 5 + 10;
    });

    const filename = `${selectedLaw.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
};

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  if (lawInfo) {
    const downloadButton = (
      <div className="mt-8 text-center">
         <button
             onClick={handleDownloadPDF}
             className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
             aria-label={`Download ${selectedLaw} details as PDF`}
         >
             <DownloadIcon className="h-5 w-5" />
             <span>Download as PDF</span>
         </button>
     </div>
 );

    if (activeTopic) {
      return (
        <div className="mt-4 p-1 animate-fade-in">
          <button 
            onClick={() => setActiveTopic(null)}
            className="mb-6 inline-flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Topics
          </button>
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">{activeTopic.title}</h2>
          <ContentRenderer content={activeTopic.content} />
          {downloadButton}
        </div>
      );
    }

    return (
        <div className="mt-4 animate-fade-in">
             <h3 className="text-xl font-bold text-gray-800 mb-2">Index</h3>
             <p className="text-gray-500 mb-6">Select a topic from the chosen law to view its details.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {lawSections.map((section) => (
                     <button
                        key={section.title}
                        onClick={() => setActiveTopic(section)}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-left hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
                     >
                         <h4 className="font-semibold text-gray-800">{section.title}</h4>
                     </button>
                 ))}
             </div>
             {downloadButton}
        </div>
    );
  }

  if (hasSelectedLaw) {
      return (
          <div className="text-center p-10 min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Something went wrong. Please try selecting the law again.</p>
          </div>
      )
  }

  if (!hasSelectedLaw) {
      return (
          <div className="text-center p-10 min-h-[200px] flex items-center justify-center rounded-lg bg-slate-50 border-2 border-dashed border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Select a Law Code</h3>
                <p className="text-gray-500 mt-1">Choose a law from the dropdown to see its index here.</p>
              </div>
          </div>
      )
  }

  return null;
};

export default LawInfoDisplay;