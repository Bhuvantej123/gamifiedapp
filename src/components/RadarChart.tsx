import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useUserStore } from '../store/userStore';

export const RadarChartComponent: React.FC = () => {
  const profile = useUserStore((state) => state.profile);
  
  // Mock data - in real app fetch from guest_progress stats
  const data = [
    { subject: 'Math', A: 120, fullMark: 150 },
    { subject: 'Science', A: 98, fullMark: 150 },
    { subject: 'Sports', A: 86, fullMark: 150 },
    { subject: 'Fitness', A: 99, fullMark: 150 },
    { subject: 'Logic', A: 85, fullMark: 150 },
    { subject: 'History', A: 65, fullMark: 150 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }}
          />
          <Radar
            name="Skill Matrix"
            dataKey="A"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
