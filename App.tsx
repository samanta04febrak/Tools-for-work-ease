import React, { useState, useEffect } from 'react';
import { LABOUR_LAW_CODES } from './constants';
import { getLawInformation } from './services/geminiService';
import Header from './components/Header';
import LawSelector from './components/LawSelector';
import LawInfoDisplay from './components/LawInfoDisplay';
import Chatbox from './components/Chatbox';
import Hero from './components/Hero';

const App: React.FC = () => {
  const [selectedLaw, setSelectedLaw] = useState('');
  const [lawInfo, setLawInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appKey, setAppKey] = useState(0);

  useEffect(() => {
    if (!selectedLaw) {
      setLawInfo(null);
      setError(null);
      return;
    }

    const fetchLawInfo = async () => {
      setIsLoading(true);
      setError(null);
      setLawInfo(null);
      try {
        const info = await getLawInformation(selectedLaw);
        setLawInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawInfo();
  }, [selectedLaw]);

  const handleLawChange = (law: string) => {
    setSelectedLaw(law);
  };

  const handleClear = () => {
    setSelectedLaw('');
    setAppKey(prevKey => prevKey + 1);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header onClear={handleClear} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <div key={appKey} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-full">
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Explore a Law</h2>
               <p className="text-gray-500 mb-6">Select a law from the list below to get a detailed breakdown of its key aspects.</p>
               <LawSelector
                laws={LABOUR_LAW_CODES}
                selectedLaw={selectedLaw}
                onLawChange={handleLawChange}
                disabled={isLoading}
              />
              <LawInfoDisplay
                isLoading={isLoading}
                error={error}
                lawInfo={lawInfo}
                hasSelectedLaw={!!selectedLaw}
                selectedLaw={selectedLaw}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <Chatbox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;