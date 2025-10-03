
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-cyan-400 tracking-wider">
          L3
        </h1>
        <p className="text-center text-slate-400 mt-1">المواد الدراسية</p>
      </div>
    </header>
  );
};

export default Header;
