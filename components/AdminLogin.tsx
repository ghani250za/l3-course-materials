
import React, { useState } from 'react';
import { Group } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [selectedGroup, setSelectedGroup] = useState<Group>(Group.G1);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(selectedGroup, password)) {
      onLoginSuccess();
    } else {
      setError('كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>العودة إلى الرئيسية</span>
      </button>
      <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">تسجيل دخول المسؤول</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-slate-300 mb-2">المجموعة</label>
            <select
              id="group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as Group)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
            >
              {Object.values(Group).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
