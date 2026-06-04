import { useState } from "react";
import SubjectModal from "../components/SubjectModal";
import EmployeeModal from "../components/EmployeeModal";
import ClassModal from "../components/ClassModal";
import GradeModal from "../components/GradeModal";
import AdminSettingsModal from "../components/AdminSettingsModal";

export default function AdminPage() {
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [adminSettingsOpen, setAdminSettingsOpen] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>דף ניהול</h1>

      <button style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }} onClick={() => setSubjectModalOpen(true)}>
        ניהול מקצועות
      </button>

      <button style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }} onClick={() => setEmployeeModalOpen(true)}>
        ניהול עובדים
      </button>

      <button style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }} onClick={() => setClassModalOpen(true)}>
        ניהול כיתות
      </button>

      <button style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }} onClick={() => setGradeModalOpen(true)}>
        ניהול מחזורים
      </button>

      {/* כפתור חדש למנהל – שינוי סיסמה והוספת מנהל */}
      <div style={{ marginTop: "50px", textAlign: "right" }}>
        <button
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={() => setAdminSettingsOpen(true)}
        >
          ניהול מנהלים
        </button>
      </div>

      {/* קומפוננטות Modal */}
      <SubjectModal open={subjectModalOpen} onClose={() => setSubjectModalOpen(false)} />
      <EmployeeModal open={employeeModalOpen} onClose={() => setEmployeeModalOpen(false)} />
      <ClassModal open={classModalOpen} onClose={() => setClassModalOpen(false)} />
      <GradeModal open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} />

      {/* Modal מנהלים */}
      <AdminSettingsModal open={adminSettingsOpen} onClose={() => setAdminSettingsOpen(false)} />
    </div>
  );
}