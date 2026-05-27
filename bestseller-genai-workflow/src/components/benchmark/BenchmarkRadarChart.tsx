import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import { BenchmarkScore } from '../../types';
import { getToolById } from '../../data/tools';

interface BenchmarkRadarChartProps {
  scores: BenchmarkScore[];
}

const COLORS = ['#C9A96E', '#6C5CE7', '#10A37F', '#FF4757'];

const RADAR_METRICS = [
  { key: 'outputQuality', label: 'Quality' },
  { key: 'fashionRealism', label: 'Fashion' },
  { key: 'brandConsistency', label: 'Brand' },
  { key: 'promptAdherence', label: 'Prompt' },
  { key: 'batchEfficiency', label: 'Batch' },
  { key: 'localizationCapability', label: 'Localise' },
  { key: 'commercialSafety', label: 'Safety' },
  { key: 'easeOfUse', label: 'Ease' },
  { key: 'bestsellerFit', label: 'BS Fit' },
];

export default function BenchmarkRadarChart({ scores }: BenchmarkRadarChartProps) {
  const top3 = scores.slice(0, 4);

  const data = RADAR_METRICS.map(m => {
    const row: Record<string, string | number> = { metric: m.label };
    top3.forEach(s => {
      row[s.toolId] = s[m.key as keyof BenchmarkScore] as number;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#E8E4DF" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11, fill: '#9B9187', fontFamily: 'Inter' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fontSize: 9, fill: '#9B9187' }}
          tickCount={4}
        />
        {top3.map((score, i) => {
          const tool = getToolById(score.toolId);
          return (
            <Radar
              key={score.toolId}
              name={tool?.name ?? score.toolId}
              dataKey={score.toolId}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          );
        })}
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: 'Inter', paddingTop: 8 }}
        />
        <Tooltip
          contentStyle={{
            fontSize: 11,
            fontFamily: 'Inter',
            background: 'white',
            border: '1px solid #E8E4DF',
            borderRadius: 8,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
