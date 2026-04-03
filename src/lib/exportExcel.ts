import * as XLSX from 'xlsx';
import type { CutPiece, Unit, CuttingSettings } from '../types';
import { calculateCost } from './calculations';

export function exportToExcel(pieces: CutPiece[], units: Unit[], settings: CuttingSettings, projectName: string) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Cut List
  const cutData = [
    ['كود', 'اسم الوحدة', 'رقم الوحدة', 'اسم القطعة', 'العرض (سم)', 'الارتفاع (سم)', 'الكمية', 'الخامة', 'شريط أمامي', 'شريط خلفي', 'شريط يسار', 'شريط يمين'],
    ...pieces.map(p => [
      p.code,
      p.unit_name,
      p.unit_number,
      p.piece_name,
      p.width,
      p.height,
      p.quantity,
      p.material,
      p.edge_front ? 'نعم' : 'لا',
      p.edge_back ? 'نعم' : 'لا',
      p.edge_left ? 'نعم' : 'لا',
      p.edge_right ? 'نعم' : 'لا',
    ]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(cutData);
  ws1['!cols'] = Array(12).fill({ wch: 15 });
  XLSX.utils.book_append_sheet(wb, ws1, 'قائمة القطع');

  // Sheet 2: Units Summary
  const unitData = [
    ['#', 'نوع الوحدة', 'الكمية', 'العرض', 'الارتفاع', 'العمق', 'الرفوف', 'الأدراج', 'ملاحظات'],
    ...units.map((u, i) => [
      i + 1,
      u.unit_type,
      u.quantity,
      u.width,
      u.height,
      u.depth,
      u.shelves_count,
      u.drawers_count,
      u.notes || '',
    ]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(unitData);
  ws2['!cols'] = Array(9).fill({ wch: 15 });
  XLSX.utils.book_append_sheet(wb, ws2, 'ملخص الوحدات');

  // Sheet 3: Cost
  const cost = calculateCost(pieces, settings);
  const costData = [
    ['البيان', 'القيمة'],
    ['مساحة الخشب (م²)', cost.totalArea.toFixed(2)],
    ['سعر لوح الخشب (ج.م)', settings.wood_price],
    ['تكلفة الخشب (ج.م)', cost.woodCost.toFixed(2)],
    ['تكلفة الزجاج (ج.م)', cost.glassCost.toFixed(2)],
    ['إجمالي التكلفة (ج.م)', cost.totalCost.toFixed(2)],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(costData);
  ws3['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'التكلفة');

  XLSX.writeFile(wb, `${projectName}_قائمة_القطع.xlsx`);
}
