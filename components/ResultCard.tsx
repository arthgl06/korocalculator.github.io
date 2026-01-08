import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  type?: 'neutral' | 'positive' | 'negative' | 'info';
  icon?: React.ElementType;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  label, 
  value, 
  subValue, 
  type = 'neutral',
  icon: Icon
}) => {
  const getColors = () => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-50 border-emerald-100 text-emerald-900';
      case 'negative':
        return 'bg-rose-50 border-rose-100 text-rose-900';
      case 'info':
        return 'bg-blue-50 border-blue-100 text-blue-900';
      default:
        return 'bg-slate-50 border-slate-100 text-slate-900';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'positive': return 'text-emerald-700';
      case 'negative': return 'text-rose-700';
      case 'info': return 'text-blue-700';
      default: return 'text-slate-700';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getColors()} transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <h3 className={`text-xl font-bold ${getValueColor()}`}>{value}</h3>
          {subValue && (
            <p className="text-xs opacity-70 mt-1">{subValue}</p>
          )}
        </div>
        {Icon && <Icon className={`w-5 h-5 opacity-50`} />}
      </div>
    </div>
  );
};

export default ResultCard;