interface DetailLevelSelectorProps {
  levels: readonly { id: string; name: string; nameEn: string; description: string }[];
  selected: string;
  onSelect: (level: 'brief' | 'detailed' | 'step-by-step') => void;
}

export function DetailLevelSelector({ levels, selected, onSelect }: DetailLevelSelectorProps) {
  return (
    <div className="math-card">
      <h3 className="font-bold text-gray-800 mb-4">مستوى التفصيل</h3>
      <div className="space-y-2">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id as 'brief' | 'detailed' | 'step-by-step')}
            className={`w-full text-right p-3 rounded-xl transition-all ${
              selected === level.id
                ? 'bg-primary-50 border-2 border-primary-500 text-primary-700'
                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="font-medium">{level.name}</div>
            <div className="text-sm opacity-75">{level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
