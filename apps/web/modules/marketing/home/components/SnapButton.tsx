/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import React, { useState } from "react";

type SnapButtonProps = {
    onClick: () => void;
    size: string;
  };

  const SnapButton: React.FC<SnapButtonProps> = ({ 
    onClick, 
    size}) => {
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
        <div className={`relative inline-block ${size}`}>
          <div className="relative">
            Snap image
          </div>
          
          <button
            className={`font-button-base absolute inset-0 flex items-center justify-center outline-none transition-all duration-300 
              focus:outline-none
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
        </div>
      );
    };
    
    export default SnapButton;