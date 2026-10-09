import React from 'react';
import { Search, Filter } from 'lucide-react';
import styles from './FilterBar.module.css';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusOptions?: FilterOption[];
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusOptions,
  selectedStatus,
  onStatusChange,
  actions,
}) => {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>

        {statusOptions && onStatusChange && (
          <div className={styles.filterWrapper}>
            <Filter size={14} className={styles.filterIcon} />
            <select
              className={styles.select}
              value={selectedStatus || ''}
              onChange={(e) => onStatusChange(e.target.value)}
              title="Filter by status"
            >
              <option value="">All Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {actions && <div className={styles.right}>{actions}</div>}
    </div>
  );
};
