import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { industries } from '../../data/industries';

const data = industries.map((ind) => ({
  name: ind.label,
  value: ind.totalDevices,
  color: ind.color,
}));

export default function IndustryDonut() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
            }}
            formatter={(value) => [`${Number(value).toLocaleString()} devices`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 -mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name.split(' / ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
}
