import { Project } from '@/types';

export function generateCSV(projects: Project[]): string {
  const headers = [
    'Project Name',
    'Role',
    'Category',
    'Description',
    'Responsibilities',
    'Tech Stack',
    'Start Date',
    'End Date',
    'Repository',
    'Domain',
  ];

  const rows = projects.map(project => [
    project.name,
    project.role_id || '',
    project.category_id || '',
    project.project_description || '',
    project.responsibilities || '',
    '', // Tech stack - needs to be joined from related table
    project.start_date || '',
    project.end_date || '',
    project.repo_url || '',
    project.domain || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string = 'projects.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
