import Papa from 'papaparse';
import { MetricRow } from './types';
import { REQUIRED_COLUMNS, UPLOAD_LIMITS } from './constants';

interface ParseResult {
  data: MetricRow[];
  errors: string[];
}

function sanitizeCell(value: string): string {
  let cleaned = value.trim();
  if (/^[=+\-@\t\r]/.test(cleaned)) {
    cleaned = cleaned.replace(/^[=+\-@\t\r]+/, '');
  }
  return cleaned;
}

export function parseCSV(fileContent: string, fileName: string): ParseResult {
  const errors: string[] = [];

  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  if (!(UPLOAD_LIMITS.ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return { data: [], errors: ['Please upload a .csv file.'] };
  }

  let content = fileContent;
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (content.trim().length === 0) {
    return { data: [], errors: ['This file is empty.'] };
  }

  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim().toLowerCase(),
  });

  if (parsed.data.length === 0) {
    return { data: [], errors: ['This file is empty.'] };
  }

  const headers = parsed.meta.fields || [];
  const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    return { data: [], errors: [`Missing columns: ${missingColumns.join(', ')}`] };
  }

  if (parsed.data.length < UPLOAD_LIMITS.MIN_ROWS) {
    return { data: [], errors: ['Need at least 2 rows of data.'] };
  }

  if (parsed.data.length > UPLOAD_LIMITS.MAX_ROWS) {
    return { data: [], errors: [`File exceeds ${UPLOAD_LIMITS.MAX_ROWS.toLocaleString()} row limit.`] };
  }

  const rows: MetricRow[] = [];
  const numericFields = ['users', 'signups', 'activated_users', 'paid_users', 'retained_users', 'cancelled_users'] as const;

  for (let i = 0; i < parsed.data.length; i++) {
    const raw = parsed.data[i] as Record<string, string>;
    const rowNum = i + 2;

    const dateStr = sanitizeCell(raw['date'] || '');
    if (isNaN(Date.parse(dateStr))) {
      errors.push(`Row ${rowNum}: invalid date "${dateStr}"`);
      continue;
    }

    const row: Partial<MetricRow> = { date: dateStr };
    let rowValid = true;

    for (const field of numericFields) {
      const cellValue = sanitizeCell(raw[field] || '');
      const num = Number(cellValue);

      if (isNaN(num)) {
        errors.push(`Row ${rowNum}: "${field}" is not a number`);
        rowValid = false;
        break;
      }

      if (num < 0) {
        errors.push(`Row ${rowNum}: "${field}" cannot be negative`);
        rowValid = false;
        break;
      }

      (row as Record<string, string | number>)[field] = Math.round(num);
    }

    if (rowValid) {
      rows.push(row as MetricRow);
    }
  }

  if (errors.length > 0 && rows.length === 0) {
    return { data: [], errors };
  }

  rows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return { data: rows, errors };
}
