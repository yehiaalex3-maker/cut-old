import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileSpreadsheet, Download, CheckCircle, FileText, Table } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Unit, CuttingSettings } from '../types';
import { calculateCutList, DEFAULT_CUTTING_SETTINGS } from '../lib/calculations';
import { exportToExcel } from '../lib/exportExcel';

export default function ExportPage({ onMenuToggle, projectName }: { onMenuToggle: () => void; projectName: string }) {
  const { projectId } = useParams();
  const [units, setUnits] = useState<Unit[]>([]);
  const [settings, setSettings] = useState<CuttingSettings>(DEFAULT_CUTTING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, settingsRes] = await Promise.all([
          fetch(`/api/units?project_id=${projectId}`),
          fetch(`/api/settings?project_id=${projectId}`),
        ]);
        const unitsData = await unitsRes.json();
        const settingsData = await settingsRes.json();
        setUnits(Array.isArray(unitsData) ? unitsData : []);
        if (settingsData) setSettings({ ...DEFAULT_CUTTING_SETTINGS, ...settingsData });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const pieces = calculateCutList(units, settings);

  const handleExport = () => {
    exportToExcel(pieces, units, settings, projectName);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page">
      <Header title="تصدير Excel" subtitle={`مشروع: ${projectName}`} onMenuToggle={onMenuToggle} />

      <div className="page-content">
        <div className="export-container">
          <motion.div className="export-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="export-icon-wrap">
              <FileSpreadsheet size={64} />
            </div>
            <h2>تصدير قائمة القطع</h2>
            <p>تصدير جميع مقاسات القطع الخشبية إلى ملف Excel جاهز للاستخدام في برامج التقطيع الذكية</p>

            <div className="export-stats">
              <div className="export-stat">
                <span className="export-stat-num">{units.length}</span>
                <span className="export-stat-label">وحدة</span>
              </div>
              <div className="export-stat">
                <span className="export-stat-num">{pieces.length}</span>
                <span className="export-stat-label">نوع قطعة</span>
              </div>
              <div className="export-stat">
                <span className="export-stat-num">{pieces.reduce((s, p) => s + p.quantity, 0)}</span>
                <span className="export-stat-label">قطعة إجمالي</span>
              </div>
            </div>

            <button
              className={`export-btn ${exported ? 'success' : ''}`}
              onClick={handleExport}
              disabled={units.length === 0}
            >
              {exported ? (
                <><CheckCircle size={20} /><span>تم التصدير بنجاح!</span></>
              ) : (
                <><Download size={20} /><span>تحميل ملف Excel</span></>
              )}
            </button>

            {units.length === 0 && (
              <p className="export-warning">⚠️ لا توجد وحدات. أضف وحدات أولاً من صفحة تفريغ المقاسات</p>
            )}
          </motion.div>

          <div className="export-info-cards">
            <motion.div className="export-info-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Table size={24} />
              <h4>ورقة قائمة القطع</h4>
              <p>جميع القطع مع الأبعاد والكميات وأكواد الشريط</p>
            </motion.div>
            <motion.div className="export-info-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <FileText size={24} />
              <h4>ورقة ملخص الوحدات</h4>
              <p>قائمة بجميع الوحدات مع مواصفاتها الكاملة</p>
            </motion.div>
            <motion.div className="export-info-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <FileSpreadsheet size={24} />
              <h4>ورقة التكلفة</h4>
              <p>تفصيل تكلفة المشروع بناءً على الأسعار المدخلة</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
