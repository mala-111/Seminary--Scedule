import { useState } from "react";

import SubjectModal from "../components/SubjectModal";
import EmployeeModal from "../components/EmployeeModal";
import ClassModal from "../components/ClassModal";
import GradeModal from "../components/GradeModal";
import AdminSettingsModal from "../components/AdminSettingsModal";

import SchoolSettingsModal from "../components/SchoolSettingsModal";
import ClassSubjectRequirementModal from "../components/ClassSubjectRequirementModal";

export default function AdminPage() {
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [adminSettingsOpen, setAdminSettingsOpen] = useState(false);

  // NEW
  const [schoolSettingsOpen, setSchoolSettingsOpen] = useState(false);
  const [requirementsOpen, setRequirementsOpen] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>דף ניהול</h1>

      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setSubjectModalOpen(true)}
      >
        ניהול מקצועות
      </button>

      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setEmployeeModalOpen(true)}
      >
        ניהול עובדים
      </button>

      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setClassModalOpen(true)}
      >
        ניהול כיתות
      </button>

      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setGradeModalOpen(true)}
      >
        ניהול מחזורים
      </button>

      {/* NEW BUTTONS */}
      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setSchoolSettingsOpen(true)}
      >
        הגדרות מערכת שעות
      </button>

      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setRequirementsOpen(true)}
      >
        דרישות מקצועות לכיתות
      </button>

      {/* Admin */}
      <div style={{ marginTop: "50px", textAlign: "right" }}>
        <button
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={() => setAdminSettingsOpen(true)}
        >
          ניהול מנהלים
        </button>
      </div>

      {/* Modals קיימים */}
      <SubjectModal open={subjectModalOpen} onClose={() => setSubjectModalOpen(false)} />
      <EmployeeModal open={employeeModalOpen} onClose={() => setEmployeeModalOpen(false)} />
      <ClassModal open={classModalOpen} onClose={() => setClassModalOpen(false)} />
      <GradeModal open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} />
      <AdminSettingsModal open={adminSettingsOpen} onClose={() => setAdminSettingsOpen(false)} />

      {/* NEW MODALS */}
      <SchoolSettingsModal
        open={schoolSettingsOpen}
        onClose={() => setSchoolSettingsOpen(false)}
      />

      <ClassSubjectRequirementModal
        open={requirementsOpen}
        onClose={() => setRequirementsOpen(false)}
      />
    </div>
  );
}