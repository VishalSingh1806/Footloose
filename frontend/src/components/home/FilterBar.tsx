import { SlidersHorizontal } from 'lucide-react';

export type FilterType =
  | 'all'
  | 'verified'
  | 'justJoined'
  | 'nearby'
  | 'premium';

interface Filter {
  id: FilterType;
  label: string;
  count?: number;
}

interface FilterBarProps {
  activeFilters: FilterType[];
  onFilterToggle: (filter: FilterType) => void;
  onOpenFilterModal: () => void;
  filterCounts?: Partial<Record<FilterType, number>>;
}

function FilterBar({
  activeFilters,
  onFilterToggle,
  onOpenFilterModal,
  filterCounts = {},
}: FilterBarProps) {
  const filters: Filter[] = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified', count: filterCounts.verified },
    { id: 'justJoined', label: 'Just Joined', count: filterCounts.justJoined },
    { id: 'nearby', label: 'Nearby', count: filterCounts.nearby },
    { id: 'premium', label: 'Premium', count: filterCounts.premium },
  ];

  const isActive = (filterId: FilterType) => activeFilters.includes(filterId);

  const getFilterLabel = (filter: Filter) => {
    if (filter.count !== undefined && filter.count > 0) {
      return `${filter.label} (${filter.count})`;
    }
    return filter.label;
  };

  return (
    <div
      className="bg-white border-b border-gray-200 py-3 sticky top-0 z-20
                    shadow-sm"
      style={{ top: '56px' }} // Below TopBar
    >
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterToggle(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                       transition-all whitespace-nowrap
                       ${
                         isActive(filter.id)
                           ? 'bg-[#E63946] text-white'
                           : 'bg-white text-gray-700 border border-gray-300 hover:border-[#E63946] hover:text-[#E63946]'
                       }`}
          >
            {getFilterLabel(filter)}
          </button>
        ))}

        {/* Filter Modal Button */}
        <button
          onClick={onOpenFilterModal}
          className="flex-shrink-0 w-10 h-10 rounded-full
                     bg-white border border-gray-300
                     flex items-center justify-center
                     hover:border-[#E63946] hover:text-[#E63946]
                     transition-all"
          aria-label="Open advanced filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default FilterBar;
