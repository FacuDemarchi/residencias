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
        px-4 py-2 rounded-full text-base font-normal
        border border-gray-200 bg-white text-gray-800
        shadow
        transition-colors
        hover:bg-lightblue
        focus:outline-none
        whitespace-nowrap
        mx-1
        ${selected ? "bg-primary text-white border-primary" : ""}
      `}
    >
      {label}
    </button>
  );
};

export default TagChip; 