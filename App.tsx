import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, ArrowRight, TrendingUp, TrendingDown, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import InputField from './components/InputField';
import ResultCard from './components/ResultCard';
import { formatBRL, formatVND } from './utils';

// Constants for fixed rules
const INTERMEDIARY_FEE_PERCENT = 0.065; // 6.5%
const VN_REDUCTION_PERCENT = 0.20;      // 20%
const PLATFORM_FEE_PERCENT = 0.16;      // 16%

const App: React.FC = () => {
  // State for user inputs
  const [vnPurchased, setVnPurchased] = useState<number | string>('');
  const [cardCost, setCardCost] = useState<number | string>('');
  const [resalePrice, setResalePrice] = useState<number | string>('');

  // Derived state (Calculations)
  const calculations = useMemo(() => {
    const vnAmount = Number(vnPurchased) || 0;
    const cost = Number(cardCost) || 0;
    const resale = Number(resalePrice) || 0;

    // 1. Final Cost in BRL
    const intermediaryFee = cost * INTERMEDIARY_FEE_PERCENT;
    const finalCost = cost + intermediaryFee;

    // 2. Usable VN
    const vnReduction = vnAmount * VN_REDUCTION_PERCENT;
    const usableVn = vnAmount - vnReduction;

    // 3. Net Revenue in BRL
    const platformFee = resale * PLATFORM_FEE_PERCENT;
    const netRevenue = resale - platformFee;

    // 4. Final Profit/Loss
    const profit = netRevenue - finalCost;
    const isProfitable = profit > 0;
    const profitMargin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;
    const roi = finalCost > 0 ? (profit / finalCost) * 100 : 0;

    return {
      vnAmount,
      cost,
      resale,
      intermediaryFee,
      finalCost,
      vnReduction,
      usableVn,
      platformFee,
      netRevenue,
      profit,
      isProfitable,
      profitMargin,
      roi
    };
  }, [vnPurchased, cardCost, resalePrice]);

  // Chart Data
  const chartData = [
    {
      name: 'Money Out',
      value: calculations.finalCost,
      breakdown: [
        { label: 'Card Price', val: calculations.cost },
        { label: 'Intermediary Fee', val: calculations.intermediaryFee }
      ]
    },
    {
      name: 'Money In',
      value: calculations.netRevenue,
      breakdown: [
        { label: 'Sale Price', val: calculations.resale },
        { label: 'Platform Fee', val: -calculations.platformFee }
      ]
    }
  ];

  const handleReset = () => {
    setVnPurchased('');
    setCardCost('');
    setResalePrice('');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Calculator size={24} />
              </div>
              Reseller Calculator
            </h1>
            <p className="mt-2 text-slate-600">
              Calculate margins for Vietnamese currency reselling instantly.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <RefreshCw size={16} /> Reset All
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                Transaction Details
              </h2>
              
              <div className="space-y-4">
                <InputField
                  id="vn_amount"
                  label="VN Purchased (₫)"
                  value={vnPurchased}
                  onChange={setVnPurchased}
                  placeholder="e.g. 100000"
                  suffix="₫"
                  helpText="The initial amount of Vietnamese Dong on the card."
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400 font-medium">COSTS</span>
                  </div>
                </div>

                <InputField
                  id="card_cost"
                  label="Card Cost (R$)"
                  value={cardCost}
                  onChange={setCardCost}
                  placeholder="e.g. 50.00"
                  prefix="R$"
                  helpText="The amount you paid for the card."
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-slate-400 font-medium">SALES</span>
                  </div>
                </div>

                <InputField
                  id="resale_price"
                  label="Resale Price (R$)"
                  value={resalePrice}
                  onChange={setResalePrice}
                  placeholder="e.g. 80.00"
                  prefix="R$"
                  helpText="The price you are selling the currency for on the platform."
                />
              </div>

              {/* Fee Summary Small Box */}
              <div className="mt-6 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
                <p className="flex justify-between">
                  <span>Intermediary Fee:</span>
                  <span className="font-medium text-slate-700">6.5%</span>
                </p>
                <p className="flex justify-between">
                  <span>Activation Reduction:</span>
                  <span className="font-medium text-slate-700">20%</span>
                </p>
                <p className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-medium text-slate-700">16%</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Result: Profit/Loss */}
            <div className={`rounded-2xl shadow-md border-2 overflow-hidden transition-all duration-300 ${
              calculations.profit > 0 ? 'bg-white border-emerald-100' : calculations.profit < 0 ? 'bg-white border-rose-100' : 'bg-white border-slate-100'
            }`}>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Net Profit / Loss</h2>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-extrabold ${
                        calculations.profit > 0 ? 'text-emerald-600' : calculations.profit < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        {formatBRL(calculations.profit)}
                      </span>
                      {calculations.finalCost > 0 && (
                         <span className={`text-lg font-semibold ${
                          calculations.profit > 0 ? 'text-emerald-600' : calculations.profit < 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                          ({calculations.roi.toFixed(1)}% ROI)
                         </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Total after all fees and deductions
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-full ${
                    calculations.profit > 0 ? 'bg-emerald-100 text-emerald-600' : calculations.profit < 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {calculations.profit > 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                  </div>
                </div>
              </div>
              
              {/* Progress bar visual for margin */}
              {calculations.netRevenue > 0 && (
                <div className="h-2 w-full bg-slate-100">
                  <div 
                    className={`h-full transition-all duration-500 ${calculations.profit > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(Math.abs(calculations.roi), 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ResultCard
                label="Final Cost (Spent)"
                value={formatBRL(calculations.finalCost)}
                subValue={`Includes ${formatBRL(calculations.intermediaryFee)} (6.5%) fee`}
                type="neutral"
                icon={ArrowRight}
              />
              <ResultCard
                label="Net Revenue (Earned)"
                value={formatBRL(calculations.netRevenue)}
                subValue={`After ${formatBRL(calculations.platformFee)} (16%) fee`}
                type="info"
                icon={DollarSign}
              />
              <ResultCard
                label="Usable VN Amount"
                value={formatVND(calculations.usableVn)}
                subValue={`Reduced by ${formatVND(calculations.vnReduction)} (20%)`}
                type="neutral"
                icon={RefreshCw}
              />
            </div>

            {/* Simple Visual Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-semibold text-slate-700 mb-4">Financial Breakdown</h3>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                      <Tooltip 
                        formatter={(value: number) => formatBRL(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-2 flex justify-center gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span>Expenses (Cost + 6.5%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Net Income (Sale - 16%)</span>
                  </div>
               </div>
            </div>

            {/* Instructions / Alert */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-indigo-900">
                <p className="font-semibold mb-1">How fees are calculated:</p>
                <ul className="list-disc pl-4 space-y-1 opacity-80">
                  <li><strong>Intermediary Fee (6.5%):</strong> Added to your purchase price.</li>
                  <li><strong>Activation Loss (20%):</strong> Deducted from the VN currency amount immediately.</li>
                  <li><strong>Platform Fee (16%):</strong> Deducted from your final resale price.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;