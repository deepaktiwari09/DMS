import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debounceTimerRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (onSearch) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        onSearch(searchTerm);
      }, debounceMs);
    }

    return () => {
      clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm, onSearch, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-[var(--text-secondary)]" />
      </div>
      <input
        type="text"
        className={cn('input w-full pl-10', className)}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default SearchInput;