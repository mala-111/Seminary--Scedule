import { useEffect, useState } from "react";
import {
  getSchoolSettings,
  saveSchoolSettings,
  resetSchoolSettings,
} from "../api/SchoolSettingsApi";

import type { SchoolSettings } from "../redux/types/SchoolSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SchoolSettingsModal({ open, onClose }: Props) {
  const [form, setForm] = useState<SchoolSettings>({
    startHour: 8,
    endHour: 14,
    workingDaysPerWeek: 5,
    minLessonsPerDay: 4,
    maxConsecutiveLessons: 4,
    patrolHoursRatio: 4,
  });

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open]);

  const load = async () => {
    try {
      const data = await getSchoolSettings();
      if (data) setForm(data);
    } catch {
      // אין הגדרות עדיין
    }
  };

  const handleChange = (key: keyof SchoolSettings, value: number) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    await saveSchoolSettings(form);
    onClose();
  };

  const handleReset = async () => {
    await resetSchoolSettings();
    setForm({
      startHour: 8,
      endHour: 14,
      workingDaysPerWeek: 5,
      minLessonsPerDay: 4,
      maxConsecutiveLessons: 4,
      patrolHoursRatio: 4,
    });
  };

  if (!open) return null;

  return (
    <div className="modal">
      <h2>הגדרות מערכת שעות</h2>

      <div>
        <label>שעת התחלה</label>
        <input
          type="number"
          value={form.startHour}
          onChange={(e) => handleChange("startHour", +e.target.value)}
        />
      </div>

      <div>
        <label>שעת סיום</label>
        <input
          type="number"
          value={form.endHour}
          onChange={(e) => handleChange("endHour", +e.target.value)}
        />
      </div>

      <div>
        <label>ימים בשבוע</label>
        <input
          type="number"
          value={form.workingDaysPerWeek}
          onChange={(e) => handleChange("workingDaysPerWeek", +e.target.value)}
        />
      </div>

      <div>
        <label>מינימום שיעורים ביום</label>
        <input
          type="number"
          value={form.minLessonsPerDay}
          onChange={(e) => handleChange("minLessonsPerDay", +e.target.value)}
        />
      </div>

      <div>
        <label>מקסימום רצף שיעורים</label>
        <input
          type="number"
          value={form.maxConsecutiveLessons}
          onChange={(e) => handleChange("maxConsecutiveLessons", +e.target.value)}
        />
      </div>

      <div>
        <label>יחס שעות פטרול</label>
        <input
          type="number"
          value={form.patrolHoursRatio}
          onChange={(e) => handleChange("patrolHoursRatio", +e.target.value)}
        />
      </div>

      <button onClick={handleSave}>שמור</button>
      <button onClick={handleReset}>איפוס</button>
      <button onClick={onClose}>סגור</button>
    </div>
  );
}