import React from 'react';
import { AlertCircle, Calendar, DollarSign, Users } from 'lucide-react';

const DisasterCard = ({ disaster }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500 bg-red-500/5 shadow-red-500/10';
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-500/5 shadow-yellow-500/10';
      case 'low':
        return 'border-l-4 border-emerald-500 bg-emerald-500/5 shadow-emerald-500/10';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  const getBadgeStyles = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50';
      case 'low': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
    }
  };

  return (
    <div className={`glass p-5 rounded-2xl transition-all hover:translate-x-1 ${getPriorityStyles(disaster.priority)}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold font-sans tracking-tight text-white/95">
          {disaster.type}
        </h3>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 ${getBadgeStyles(disaster.priority)}`}>
          {disaster.priority === 'high' && <AlertCircle className="w-3 h-3" />}
          {disaster.priority}
        </span>
      </div>
      
      <p className="text-sm text-white/70 mb-4 line-clamp-2">
        {disaster.description}
      </p>
      
      <div className="grid grid-cols-2 gap-3 text-xs text-white/60 mb-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-400" />
          <span>{disaster.casualties.toLocaleString()} Casualties</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="truncate">${disaster.economic_loss.toLocaleString()} Loss</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-white/40 mt-2">
        <Calendar className="w-3 h-3" />
        {new Date(disaster.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DisasterCard;
