import React from 'react';
import HeroImage from './icons/HeroImage';

const Hero: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                       Shram Sarathi
                    </h1>
                    <p className="mt-2 text-lg text-indigo-600 font-semibold">
                        Your AI-powered guide to Indian Labour Laws.
                    </p>
                    <p className="mt-4 text-gray-600 max-w-xl">
                        Instantly get answers to your questions using the chat assistant, or select one of the 29 codified laws to dive deep into its specific provisions.
                    </p>
                </div>
                <div className="flex-shrink-0 w-48 h-48">
                     <HeroImage className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};

export default Hero;