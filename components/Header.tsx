import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import XCircleIcon from './icons/XCircleIcon';

interface HeaderProps {
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="bg-white sticky top-0 z-10 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 mr-3 text-indigo-600" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Shram Sarathi
                </h1>
            </div>
            <button
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
              aria-label="Clear session"
            >
              <XCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
