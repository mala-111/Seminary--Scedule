import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchEmployees, createEmployee } from "../redux/slices/EmployeeSlice";
import { deleteEmployee as deleteEmployeeApi } from "../api/employeeApi";
import "./EmployeeModal.css";

interface EmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployeeModal = ({ open, onClose }: EmployeeModalProps) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector(state => state.employees);

  const [name, setName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    if (open) dispatch(fetchEmployees());
  }, [open, dispatch]);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(deleteName.toLowerCase())
  );

  const handleAdd = async () => {
  if (
    !name.trim() ||
    !employeeCode.trim()
  ) {
    return;
  }

  const codeExists = employees.some(
    e =>
      e.employeeCode.trim() ===
      employeeCode.trim()
  );

  if (codeExists) {
    alert("קוד עובד כבר קיים במערכת");
    return;
  }

  await dispatch(
    createEmployee({
      name,
      employeeCode,
    })
  );

  alert("העובד נוסף בהצלחה");

  setName("");
  setEmployeeCode("");
};
  const [showEmployees, setShowEmployees] =useState(false);
  const handleDelete = async (employeeName: string) => {
    const employee = employees.find(e => e.name === employeeName);
    if (!employee) {
      alert("לא קיים עובד כזה למחיקה");
      return;
    }
    await deleteEmployeeApi(employee.employeeId);
    alert("העובד נמחקה בהצלחה");
    setDeleteName("");
    dispatch(fetchEmployees());
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* ריבוע קטן לסגירה */}
        <button className="close-btn" onClick={onClose}>X</button>

        <h2>ניהול עובדים</h2>

        
        {/* הצגת כל העובדים */}
        <button onClick={() => setShowEmployees(!showEmployees)}>
          {showEmployees ? "הסתר עובדים" : "הצג את כל העובדים"}
        </button>
        {showEmployees && (
          <div className="classes-list">
            {employees.length === 0 ? (
              <p>אין עובדים במערכת</p>
            ) : (
              employees.map(e => (
                <div key={e.employeeId} className="class-item">
                  {e.name} - {e.employeeCode}
                </div>
              ))
            )}
          </div>
        )}


        {/* הוספה */}
        
        <div className="section">
          <input
            type="text"
            placeholder="שם עובד"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="קוד עובד"
            value={employeeCode}
            onChange={e => setEmployeeCode(e.target.value)}
          />
          <button onClick={handleAdd}>הוסף עובד</button>
        </div>

        {/* מחיקה */}
        <div className="section">
          <input
            type="text"
            placeholder="הקלד שם עובד למחיקה"
            value={deleteName}
            onChange={e => setDeleteName(e.target.value)}
            list="employees-list"
          />
          <datalist id="employees-list">
            {employees.map(e => (
              <option key={e.employeeId} value={e.name} />
            ))}
          </datalist>
          <button onClick={() => handleDelete(deleteName)}>מחק עובד</button>

          {/* הצעות אוטומטיות */}
          {deleteName && (
            <div className="suggestions">
              {filteredEmployees.map(emp => (
                <div
                  key={emp.employeeId}
                  className="suggestion-item"
                  onClick={() => setDeleteName(emp.name)}
                >
                  {emp.name} ({emp.employeeCode})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;