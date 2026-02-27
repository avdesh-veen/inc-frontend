

'use client';

import * as React from 'react';
import type { WorkTypesTableProps, WorkType, CategoryType, ComplexityLevel } from '@/features/settings/types/work-types';
import { CATEGORY_COLORS } from '@/features/settings/types/work-types';



export function WorkTypesTableSimple({
  workTypes,
  selectedCategory,
  onCreate,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusToggle,
  onCategoryChange,
}: Readonly<WorkTypesTableProps>) {
  const [sortColumn, setSortColumn] = React.useState<string>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    workTypes.forEach((wt) => {
      counts[wt.category.name] = (counts[wt.category.name] || 0) + 1;
    });
    return counts as Record<CategoryType, number>;
  }, [workTypes]);

  // Filter work types by selected category
  const filteredWorkTypes = selectedCategory
    ? workTypes.filter((wt) => wt.category.name === selectedCategory)
    : workTypes;

  // Sort work types
  const sortedWorkTypes = React.useMemo(() => {
    const sorted = [...filteredWorkTypes];
    sorted.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortColumn) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'category':
          valA = a.category.name.toLowerCase();
          valB = b.category.name.toLowerCase();
          break;
        case 'duration':
          valA = a.expectedDuration;
          valB = b.expectedDuration;
          break;
        case 'complexity':
          const complexityOrder: Record<ComplexityLevel, number> = { low: 1, medium: 2, high: 3 };
          valA = complexityOrder[a.complexityLevel];
          valB = complexityOrder[b.complexityLevel];
          break;
        case 'status':
          valA = a.isActive.toString().toLowerCase();
          valB = b.isActive.toString().toLowerCase();
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredWorkTypes, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle status toggle
  const handleStatusToggle = (workType: WorkType) => {
    onStatusToggle(workType.id);
  };

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-3 h-3 ml-1 inline-block text-text-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 ml-1 inline-block text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 ml-1 inline-block text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };


  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    const colorMap: Record<string, string> = {
      Low: 'emerald',
      Medium: 'amber',
      High: 'rose',
    };
    return colorMap[complexity] || 'slate';
  };

  return (
    <div className="rounded-xl bg-glass-bg backdrop-blur-[var(--glass-blur)] border border-glass-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground">All Work Types</h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory || 'all'}
            onChange={(e) => onCategoryChange(e.target.value === 'all' ? null : (e.target.value as CategoryType))}
            className="px-3 py-1.5 rounded-lg bg-glass-bg border border-border-10 text-sm text-foreground focus:border-violet-500 focus:outline-none cursor-pointer [&>option]:bg-[var(--color-background)] [&>option]:text-foreground"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all" className="bg-[var(--color-background)] text-foreground">All Categories</option>
            {Object.keys(categoryCounts).map((category) => (
              <option key={category} value={category} className="bg-[var(--color-background)] text-foreground">
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/30 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Work Type
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-10">
              <th
                className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase cursor-pointer hover:text-text-70 select-none"
                onClick={() => handleSort('name')}
              >
                Work Type{getSortIcon('name')}
              </th>
              <th
                className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase cursor-pointer hover:text-text-70 select-none"
                onClick={() => handleSort('category')}
              >
                Category{getSortIcon('category')}
              </th>
              <th
                className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase cursor-pointer hover:text-text-70 select-none"
                onClick={() => handleSort('duration')}
              >
                Duration{getSortIcon('duration')}
              </th>
              <th
                className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase cursor-pointer hover:text-text-70 select-none"
                onClick={() => handleSort('complexity')}
              >
                Complexity{getSortIcon('complexity')}
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase">
                Requires
              </th>
              <th
                className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase cursor-pointer hover:text-text-70 select-none"
                onClick={() => handleSort('status')}
              >
                Status{getSortIcon('status')}
              </th>
              <th className="px-2 py-2 text-left text-xs font-bold text-text-50 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedWorkTypes.map((workType) => {
              const categoryColor = CATEGORY_COLORS[workType.category.name as keyof typeof CATEGORY_COLORS] || 'slate';
              const complexityColor = getComplexityColor(workType.complexityLevel);

              return (
                <tr key={workType.id} className="border-b border-border-5 hover:bg-glass-bg transition-colors">
                  <td className="px-2 py-3">
                    <div className="font-medium text-foreground">{workType.name}</div>
                    {workType.description && (
                      <div className="text-xs text-text-50 mt-0.5 line-clamp-1">{workType.description}</div>
                    )}
                  </td>
                  <td className="px-2 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs bg-${categoryColor}-500/20 text-${categoryColor}-300`}>
                      {workType.category.name}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-foreground">{workType.expectedDuration}</td>
                  <td className="px-2 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs bg-${complexityColor}-500/20 text-${complexityColor}-300`}>
                      {workType.complexityLevel}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-1">
                      {workType.requiredSkills && workType.requiredSkills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded text-xs bg-glass-bg border border-border-10 text-text-70">
                          {skill}
                        </span>
                      ))}
                      {workType.requiredSkills?.length && workType.requiredSkills.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-glass-bg border border-border-10 text-text-70">
                          +{workType.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workType.isActive}
                        onChange={() => handleStatusToggle(workType)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border-10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(workType)}
                        className="p-1.5 rounded-lg hover:bg-glass-bg text-text-50 hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDuplicate(workType)}
                        className="p-1.5 rounded-lg hover:bg-glass-bg text-text-50 hover:text-foreground transition-colors"
                        title="Duplicate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(workType.id)}
                        className="p-1.5 rounded-lg hover:bg-glass-bg text-text-50 hover:text-rose-400 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
