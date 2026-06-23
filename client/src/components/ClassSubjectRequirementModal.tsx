import { useEffect, useState } from "react";

import {
  getClassSubjectRequirements,
  addClassSubjectRequirement,
  deleteClassSubjectRequirement,
} from "../api/ClassSubjectRequirementApi";

import type { ClassSubjectRequirement } from "../redux/types/ClassSubjectRequirement";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClassSubjectRequirementModal({
  open,
  onClose,
}: Props) {
  const [list, setList] = useState<ClassSubjectRequirement[]>([]);
  const [form, setForm] = useState<ClassSubjectRequirement>({
    allClassesID: "",
    subjectID: "",
    weeklyHoursRequired: 1,
  });

  useEffect(() => {
    if (open) load();
  }, [open]);

  const load = async () => {
    const data = await getClassSubjectRequirements();
    setList(data);
  };

  const handleAdd = async () => {
    await addClassSubjectRequirement(form);
    setForm({
      allClassesID: "",
      subjectID: "",
      weeklyHoursRequired: 1,
    });
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteClassSubjectRequirement(id);
    load();
  };

  if (!open) return null;

  return (
    <div className="modal">
      <h2>דרישות מקצועות לכיתות</h2>

      {/* FORM */}
      <div>
        <input
          placeholder="Class ID"
          value={form.allClassesID}
          onChange={(e) =>
            setForm({ ...form, allClassesID: e.target.value })
          }
        />

        <input
          placeholder="Subject ID"
          value={form.subjectID}
          onChange={(e) =>
            setForm({ ...form, subjectID: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Weekly Hours"
          value={form.weeklyHoursRequired}
          onChange={(e) =>
            setForm({
              ...form,
              weeklyHoursRequired: +e.target.value,
            })
          }
        />

        <button onClick={handleAdd}>הוסף</button>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>כיתה</th>
            <th>מקצוע</th>
            <th>שעות</th>
            <th>פעולות</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.classSubjectRequirementId}>
              <td>{item.allClassesID}</td>
              <td>{item.subjectID}</td>
              <td>{item.weeklyHoursRequired}</td>
              <td>
                <button
                  onClick={() =>
                    handleDelete(item.classSubjectRequirementId!)
                  }
                >
                  מחק
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onClose}>סגור</button>
    </div>
  );
}