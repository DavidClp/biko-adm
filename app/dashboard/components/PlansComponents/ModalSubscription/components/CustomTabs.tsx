import React from "react";
import { tabProps } from "../../../interfaces";

interface CustomTabsProps {
  tabs: tabProps[];
  onChange: (index: number) => void;
  pos: number;
}

export const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, onChange, pos }) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => tab.canClick && onChange(index)}
            disabled={!tab.canClick}
            className={`
              flex-1 px-2 md:px-4 py-1 text-xs md:text-sm font-medium rounded-md transition-all duration-200
              ${tab.open 
                ? 'bg-background text-foreground shadow-sm border border-input' 
                : 'text-muted-foreground hover:text-foreground'
              }
              ${!tab.canClick 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-background/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
