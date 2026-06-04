import { useState } from "react";
import SubjectModal from "../components/SubjectModal";
import EmployeeModal from "../components/EmployeeModal";
import ClassModal from "../components/ClassModal";
import GradeModal from "../components/GradeModal";



export default function AdminPage() {
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
    const [classModalOpen, setclassModalOpen] = useState(false);
        const [gradeModalOpen, setgradeModalOpen] = useState(false);



  return (
    <div style={{ padding: "20px" }}>
      <h1>דף ניהול</h1>

      {/* כפתור לפתיחת ניהול מקצועות */}
      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setSubjectModalOpen(true)}
      >
        ניהול מקצועות
      </button>

      {/* כפתור לפתיחת ניהול עובדים */}
      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => setEmployeeModalOpen(true)}
      >
        ניהול עובדים
      </button>

      {/* כפתור לפתיחת ניהול כיתות */}
      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() =>setclassModalOpen (true)}
      >
        ניהול כיתות
      </button>


      {/* כפתור לפתיחת ניהול מחזורים */}
      <button
        style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() =>setgradeModalOpen (true)}
      >
        ניהול מחזורים
      </button>
     
      {/* קומפוננטת Modal לניהול מקצועות */}
      <SubjectModal
        open={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
      />

      {/* קומפוננטת Modal לניהול עובדים */}
      <EmployeeModal
        open={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
      />


      {/* קומפוננטת Modal לניהול כיתות */}
      <ClassModal
        open={classModalOpen}
        onClose={() => setclassModalOpen(false)}
      />

      {/* קומפוננטת Modal לניהול מחזורים */}
      <GradeModal
        open={gradeModalOpen}
        onClose={() => setgradeModalOpen(false)}
      />
    </div>
  );
}