import React from "react";

type TagChipProps = {
  label: string;
  onClick?: () => void;
  selected?: boolean;
};

const TagChip: React.FC<TagChipProps> = ({ label, onClick, selected }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-1 rounded-full text-sm font-medium shadow-sm
        border transition-colors duration-150
        ${selected ? "bg-primary text-white border-primary" : "bg-secondary text-primary border-accent hover:bg-accent hover:text-white"}
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      `}
    >
      {label}
    </button>
  );
};

export default TagChip; 