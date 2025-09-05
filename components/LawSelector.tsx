import React from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface LawSelectorProps {
  laws: string[];
  selectedLaw: string;
  onLawChange: (law: string) => void;
  disabled: boolean;
}

const LawSelector: React.FC<LawSelectorProps> = ({ laws, selectedLaw, onLawChange, disabled }) => {
  return (
    <div className="relative mb-8">
      <label htmlFor="law-selector" className="sr-only">Select a Labour Law Code</label>
      <select
        id="law-selector"
        value={selectedLaw}
        onChange={(e) => onLawChange(e.target.value)}
        disabled={disabled}
        className="block w-full appearance-none bg-white border border-gray-300 text-gray-900 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled>-- Select a Labour Law Code --</option>
        {laws.map((law) => (
          <option key={law} value={law}>
            {law}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <ChevronDownIcon className="fill-current h-5 w-5" />
      </div>
    </div>
  );
};

export default LawSelector;