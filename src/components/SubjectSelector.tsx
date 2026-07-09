import type { MathSubject } from '../types';

interface SubjectSelectorProps {
  subjects: readonly { id: string; name: string; nameEn: string; icon: string; color: string }[];
  selected: MathSubject;
  onSelect: (subject: MathSubject) => void;
}

export function SubjectSelector({ subjects, selected, onSelect }: SubjectSelectorProps) {
  return (
    <div className="math-card">
      <h3 className="font-bold text-gray-800 mb-4">فرع الرياضيات</h3>
      <div className="grid grid-cols-2 gap-2">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSelect(subject.id as MathSubject)}
            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
              selected === subject.id
                ? `${subject.color} text-white shadow-md`
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{subject.icon}</span>
            <span>{subject.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
