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
            className="rounded-lg px-3 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer"
            style={{ backgroundColor: 'var(--theme-input-bg)', border: '1px solid var(--theme-input-border)', color: 'var(--theme-text)' }}
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
