interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  filters: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
}

export default function FilterBar({ filters }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((filter) => (
        <div key={filter.label} className="flex items-center gap-2">
          <label className="text-xs text-slate-400 uppercase tracking-wider">{filter.label}</label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#0C6DFD]/50 appearance-none cursor-pointer"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
