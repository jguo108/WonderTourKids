import React, { useState } from 'react';
import { LandmarkData, InfoTab } from '../types';

interface LandmarkDetailsProps {
  data: LandmarkData;
  imageSrc: string;
  onReset: () => void;
}

const LandmarkDetails: React.FC<LandmarkDetailsProps> = ({ data, imageSrc, onReset }) => {
  const [activeTab, setActiveTab] = useState<InfoTab>(InfoTab.HISTORY);

  const tabs = [
    { id: InfoTab.HISTORY, emoji: '📜', color: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
    { id: InfoTab.FUN_FACTS, emoji: '🤯', color: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
    { id: InfoTab.ARCHITECTURE, emoji: '🏛️', color: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
    { id: InfoTab.VISIT, emoji: '🎫', color: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case InfoTab.HISTORY:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-black text-purple-600 mb-2 flex items-center gap-2">
              <span>📜</span> The Story
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 font-medium">{data.history}</p>
          </div>
        );
      case InfoTab.FUN_FACTS:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-black text-orange-600 mb-2 flex items-center gap-2">
              <span>🤯</span> Did You Know?
            </h3>
            <ul className="space-y-3">
              {data.funFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm border border-orange-200">
                  <span className="text-2xl">⭐</span>
                  <span className="text-lg text-gray-700 font-medium">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case InfoTab.ARCHITECTURE:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-black text-blue-600 mb-2 flex items-center gap-2">
              <span>🏛️</span> Look & Style
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 font-medium">{data.architecture}</p>
          </div>
        );
      case InfoTab.VISIT:
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-black text-green-600 mb-2 flex items-center gap-2">
              <span>🎫</span> Visitor Tips
            </h3>
            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 border-dashed">
              <p className="text-lg leading-relaxed text-gray-700 font-medium">{data.visitInfo}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-10">
      {/* Top Image Section */}
      <div className="relative w-full h-64 bg-gray-200 rounded-b-[3rem] overflow-hidden shadow-xl border-b-4 border-white">
        <img src={imageSrc} alt={data.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <h1 className="text-3xl font-extrabold text-white text-center drop-shadow-lg">{data.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 ${
                activeTab === tab.id
                  ? `${tab.color} ${tab.border} shadow-none translate-y-1`
                  : 'bg-white border-gray-200 shadow-md hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mb-1">{tab.emoji}</span>
              <span className={`text-[10px] font-bold uppercase ${activeTab === tab.id ? tab.text : 'text-gray-400'}`}>
                {tab.id.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 min-h-[300px]">
          {renderContent()}
        </div>

        {/* Action Button */}
        <div className="mt-8 px-4">
          <button
            onClick={onReset}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xl font-bold py-4 rounded-2xl shadow-[0_6px_0_rgb(202,138,4)] active:shadow-[0_2px_0_rgb(202,138,4)] active:translate-y-1 transition-all border-2 border-yellow-600"
          >
            🔄 Scan Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandmarkDetails;
