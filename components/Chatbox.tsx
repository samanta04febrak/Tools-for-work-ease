import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { answerLawQuestion } from '../services/geminiService';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import DownloadIcon from './icons/DownloadIcon';

const Chatbox: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setAnswer('');

        try {
            const result = await answerLawQuestion(question);
            setAnswer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadPDF = () => {
        if (!question || !answer) return;

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
        doc.text("Shram Sarathi: Q&A", margin, y);
        y += 15;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Question:", margin, y);
        y += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const questionLines = doc.splitTextToSize(question, pageWidth - margin * 2);
        checkPageBreak(questionLines.length * 5);
        doc.text(questionLines, margin, y);
        y += questionLines.length * 5 + 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        checkPageBreak(8);
        doc.text("Answer:", margin, y);
        y += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const answerLines = doc.splitTextToSize(answer.replace(/\*\*(.*?)\*\*/g, '$1'), pageWidth - margin * 2);
        checkPageBreak(answerLines.length * 5);
        doc.text(answerLines, margin, y);

        const filename = question.split(' ').slice(0, 5).join('_').replace(/[^\w]/gi, '') + '.pdf';
        doc.save(filename);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ask a Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What are the rules for maternity leave?"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 pr-28 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none disabled:opacity-50"
                        rows={3}
                        disabled={isLoading}
                        aria-label="Ask a question about Indian labour laws"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-md px-4 py-2 flex items-center justify-center font-semibold hover:bg-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105"
                        aria-label="Submit question"
                    >
                        <span className="hidden sm:inline">{isLoading ? 'Asking...' : 'Ask'}</span>
                        <PaperAirplaneIcon className="h-5 w-5 sm:ml-2"/>
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="flex items-center justify-center p-6">
                    <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div>
                    <p className="ml-3 text-gray-600">Getting your answer...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                </div>
            )}

            {answer && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in">
                    <article className="max-w-none">
                         {answer.split('\n').map((paragraph, index) => <p key={index} className="text-gray-600 mb-2">{paragraph}</p>)}
                    </article>
                     <div className="mt-6 text-center">
                         <button
                             onClick={handleDownloadPDF}
                             className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
                             aria-label="Download chat as PDF"
                         >
                             <DownloadIcon className="h-5 w-5" />
                             <span>Download as PDF</span>
                         </button>
                     </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;