import React from 'react';

const JagannathLogo = ({ size = "md", showGlow = true }) => {

  // Size variants
  const sizes = {
    sm: {
      eye: "w-6 h-6",
      pupil: "w-2 h-2",
      tilakHeight: "h-4",
      spacing: "space-x-1"
    },
    md: {
      eye: "w-8 h-8",
      pupil: "w-3 h-3",
      tilakHeight: "h-5",
      spacing: "space-x-2"
    },
    lg: {
      eye: "w-12 h-12",
      pupil: "w-5 h-5",
      tilakHeight: "h-8",
      spacing: "space-x-3"
    }
  };

  const current = sizes[size];

  const glowClass = showGlow 
    ? "shadow-[0_0_10px_rgba(255,0,0,0.6)]" 
    : "";

  return (
    <div className={`flex items-center ${current.spacing}`}>

      {/* Left Eye */}
      <div className={`${current.eye} bg-white rounded-full border-[3px] border-red-600 flex items-center justify-center ${glowClass}`}>
        <div className={`${current.pupil} bg-black rounded-full`} />
      </div>

      {/* Tilak */}
      <div className="flex flex-col items-center -mt-2">
        <div className={`w-2 ${current.tilakHeight} border border-white rounded-b-full flex justify-center`}>
          <div className="w-[2px] bg-red-600 mt-[2px] h-[70%]" />
        </div>
        <div className="w-[2px] h-2 bg-white -mt-[2px]" />
      </div>

      {/* Right Eye */}
      <div className={`${current.eye} bg-white rounded-full border-[3px] border-red-600 flex items-center justify-center ${glowClass}`}>
        <div className={`${current.pupil} bg-black rounded-full`} />
      </div>

    </div>
  );
};

export default JagannathLogo;
