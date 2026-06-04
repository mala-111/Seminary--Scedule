import { useState, useEffect } from "react";
import "./AdminSettingsModal.css";

interface AdminSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface Admin {
  username: string;
  password: string;
}

const AdminSettingsModal = ({ open, onClose }: AdminSettingsModalProps) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordFor, setChangePasswordFor] = useState("");
  const [newPasswordForChange, setNewPasswordForChange] = useState("");
  const [showAdmins, setShowAdmins] = useState(false);
  const [deleteAdminName, setDeleteAdminName] = useState("");

  useEffect(() => {
    if (open) {
      const stored = JSON.parse(localStorage.getItem("admins") || "[]");
      const hasAdmin = stored.some(a => a.username.toLowerCase() === "adminaration");
      const updatedAdmins = hasAdmin ? stored : [...stored, { username: "adminaration", password: "1234" }];
      setAdmins(updatedAdmins);
      localStorage.setItem("admins", JSON.stringify(updatedAdmins));
    }
  }, [open]);

  const handleAddAdmin = () => {
    if (!newUsername.trim() || !newPassword.trim()) return alert("יש למלא שם וסיסמה");
    if (admins.some(a => a.username.toLowerCase() === newUsername.toLowerCase()))
      return alert("מנהל זה כבר קיים");
    const updated = [...admins, { username: newUsername, password: newPassword }];
    setAdmins(updated);
    localStorage.setItem("admins", JSON.stringify(updated));
    setNewUsername("");
    setNewPassword("");
  };

  const handleChangePassword = () => {
    if (!changePasswordFor || !newPasswordForChange) return alert("בחר מנהל וסיסמה חדשה");
    const updated = admins.map(a =>
      a.username === changePasswordFor ? { ...a, password: newPasswordForChange } : a
    );
    setAdmins(updated);
    localStorage.setItem("admins", JSON.stringify(updated));
    setChangePasswordFor("");
    setNewPasswordForChange("");
  };

const handleDeleteAdmin = (username: string) => {
  if (!username.trim()) {
    alert("בחר מנהל למחיקה");
    return;
  }

  if (username.toLowerCase() === "adminaration") {
    alert("לא ניתן למחוק את adminaration");
    return;
  }

  const exists = admins.some(
    a => a.username.toLowerCase() === username.toLowerCase()
  );

  if (!exists) {
    alert("מנהל לא נמצא");
    return;
  }

  const updated = admins.filter(
    a => a.username.toLowerCase() !== username.toLowerCase()
  );

  setAdmins(updated);
  localStorage.setItem("admins", JSON.stringify(updated));
  setDeleteAdminName("");

  alert("המנהל נמחק בהצלחה");
};
const filteredAdmins = admins.filter(a =>
  a.username.toLowerCase().includes(deleteAdminName.toLowerCase())
);
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>ניהול מנהלים</h2>

        {/* הצגת כל המנהלים */}
        <button onClick={() => setShowAdmins(!showAdmins)}>
          {showAdmins ? "הסתר מנהלים" : "הצג את כל המנהלים"}
        </button>
        {showAdmins && (
  <div className="classes-list">
    {admins.length === 0 ? (
      <p>אין מנהלים במערכת</p>
    ) : (
      admins.map(a => (
        <div key={a.username} className="class-item">
          {a.username} - {a.password}
        </div>
      ))
    )}
  </div>
)}

        {/* הוספת מנהל */}
        <div className="section">
          <input
            type="text"
            placeholder="שם מנהל"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="סיסמה"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button onClick={handleAddAdmin}>הוסף מנהל</button>
        </div>

        {/* שינוי סיסמה */}
        <div className="section">
          <select value={changePasswordFor} onChange={e => setChangePasswordFor(e.target.value)}>
            <option value="">בחר מנהל</option>
            {admins.map(a => (
              <option key={a.username} value={a.username}>{a.username}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="סיסמה חדשה"
            value={newPasswordForChange}
            onChange={e => setNewPasswordForChange(e.target.value)}
          />
          <button onClick={handleChangePassword}>שנה סיסמה</button>

          <div className="section">
  <h3>מחיקת מנהל</h3>

  <input
    type="text"
    placeholder="הקלד שם מנהל למחיקה"
    value={deleteAdminName}
    onChange={e => setDeleteAdminName(e.target.value)}
    list="admins-list"
  />

  <datalist id="admins-list">
    {admins
      .filter(a => a.username.toLowerCase() !== "adminaration")
      .map(a => (
        <option key={a.username} value={a.username} />
      ))}
  </datalist>

  <button onClick={() => handleDeleteAdmin(deleteAdminName)}>
    מחק מנהל
  </button>

  {/* הצעות בזמן כתיבה */}
  {deleteAdminName && (
    <div className="suggestions">
      {filteredAdmins
        .filter(a => a.username.toLowerCase() !== "adminaration")
        .map(admin => (
          <div
            key={admin.username}
            className="suggestion-item"
            onClick={() => setDeleteAdminName(admin.username)}
          >
            {admin.username}
          </div>
        ))}
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;