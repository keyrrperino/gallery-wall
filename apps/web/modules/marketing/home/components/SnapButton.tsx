/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";

type SnapButtonProps = {
    onClick: () => void;
    size: string;
  };

  const SnapButton: React.FC<SnapButtonProps> = ({ 
    onClick}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const handleClick = () => {
      setIsClicked(true); 
      onClick(); //
    };
    return (
        <button
            className={`h-[10vh] w-[10vh] font-button-base flex items-center justify-center outline-none transition-all duration-300 
              focus:outline-none bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-full border-4 border-white
              ${isHovered ? " -translate-y-1 scale-90" : ""}
              ${isClicked ? " pointer-events-none opacity-0" : " opacity-100"}`}
            style={{
              cursor: "pointer",
              
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          </button>
      );
    };
    
    export default SnapButton;