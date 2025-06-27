'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SkillsChartProps {
  matchedSkills: number;
  missingSkills: number;
  matchScore: number;
}

export default function SkillsChart({ matchedSkills, missingSkills, matchScore }: SkillsChartProps) {
  const data = {
    labels: ['Matched Skills', 'Missing Skills'],
    datasets: [
      {
        data: [matchedSkills, missingSkills],
        backgroundColor: [
          '#10B981', // Green for matched
          '#EF4444', // Red for missing
        ],
        borderColor: [
          '#059669',
          '#DC2626',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = matchedSkills + missingSkills;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Skills Analysis</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 text-center">
        <div className={`text-3xl font-bold ${
          matchScore >= 80 ? 'text-green-600' : 
          matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {matchScore}%
        </div>
        <p className="text-gray-600">Overall Match</p>
      </div>
    </div>
  );
}