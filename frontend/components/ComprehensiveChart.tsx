'use client';

import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ComprehensiveChartProps {
  matchScore: number;
  eligibilityScore: number;
  skillScore: number;
  skillsMatch: number;
  skillsGap: number;
  verdict: string;
}

export default function ComprehensiveChart({
  matchScore,
  eligibilityScore,
  skillScore,
  skillsMatch,
  skillsGap,
  verdict
}: ComprehensiveChartProps) {
  
  // Overall Score Doughnut Chart
  const overallData = {
    labels: ['Match Score', 'Gap'],
    datasets: [
      {
        data: [matchScore, 100 - matchScore],
        backgroundColor: [
          matchScore >= 70 ? '#10b981' : matchScore >= 40 ? '#f59e0b' : '#ef4444',
          '#f3f4f6'
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  // Breakdown Bar Chart
  const breakdownData = {
    labels: ['Eligibility', 'Skills', 'Overall'],
    datasets: [
      {
        label: 'Score %',
        data: [eligibilityScore, skillScore, matchScore],
        backgroundColor: [
          eligibilityScore >= 70 ? '#3b82f6' : eligibilityScore >= 40 ? '#f59e0b' : '#ef4444',
          skillScore >= 70 ? '#8b5cf6' : skillScore >= 40 ? '#f59e0b' : '#ef4444',
          matchScore >= 70 ? '#10b981' : matchScore >= 40 ? '#f59e0b' : '#ef4444',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Skills Distribution Doughnut
  const skillsData = {
    labels: ['Skills Match', 'Skills Gap'],
    datasets: [
      {
        data: [skillsMatch, skillsGap],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Visual Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Score */}
        <div className="text-center">
          <div className="relative h-48 mb-4">
            <Doughnut data={overallData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  matchScore >= 70 ? 'text-emerald-600' : 
                  matchScore >= 40 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {matchScore}%
                </div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800">Overall Match</h4>
          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mt-2 ${
            verdict === 'QUALIFIED' ? 'bg-emerald-100 text-emerald-800' :
            verdict === 'UNDERQUALIFIED' ? 'bg-rose-100 text-rose-800' :
            verdict === 'COMPLETELY_UNQUALIFIED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {verdict?.replace('_', ' ')}
          </div>
        </div>

        {/* Breakdown Scores */}
        <div className="text-center">
          <div className="h-48 mb-4">
            <Bar data={breakdownData} options={barOptions} />
          </div>
          <h4 className="font-semibold text-gray-800">Score Breakdown</h4>
          <div className="text-xs text-gray-600 mt-2">
            Eligibility • Skills • Overall
          </div>
        </div>

        {/* Skills Distribution */}
        <div className="text-center">
          <div className="relative h-48 mb-4">
            <Doughnut data={skillsData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {skillsMatch + skillsGap}
                </div>
                <div className="text-sm text-gray-600">Total Skills</div>
              </div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-800">Skills Analysis</h4>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
              <span>{skillsMatch} Match</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-rose-500 rounded-full mr-1"></div>
              <span>{skillsGap} Gap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{eligibilityScore}%</div>
          <div className="text-sm text-gray-600">Eligibility</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{skillScore}%</div>
          <div className="text-sm text-gray-600">Skills</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{skillsMatch}</div>
          <div className="text-sm text-gray-600">Matched</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl">
          <div className="text-2xl font-bold text-rose-600">{skillsGap}</div>
          <div className="text-sm text-gray-600">Missing</div>
        </div>
      </div>
    </div>
  );
}