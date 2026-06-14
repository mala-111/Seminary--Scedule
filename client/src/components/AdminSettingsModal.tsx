import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks"; // התאמה ל-redux hooks שלך
import {
  addAdmin,
  changePassword,
  deleteAdmin,
  setAdmins,
  
} from "../redux/slices/AdminSlice";
import "./AdminSettingsModal.css";

interface AdminSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const AdminSettingsModal = ({ open, onClose }: AdminSettingsModalProps) => {
  const dispatch = useAppDispatch();
  const admins = useAppSelector(state => state.admins.admins);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordFor, setChangePasswordFor] = useState("");
  const [newPasswordForChange, setNewPasswordForChange] = useState("");
  const [showAdmins, setShowAdmins] = useState(false);
  const [deleteAdminName, setDeleteAdminName] = useState("");

  // מבטיח שה-adminaration תמיד קיים
  useEffect(() => {
    if (open) {
      const hasAdmin = admins.some(
        a => a.username.toLowerCase() === "adminaration"
      );
      if (!hasAdmin) {
        dispatch(
          setAdmins([...admins, { username: "adminaration", password: "1234" }])
        );
      }
    }
  }, [open, admins, dispatch]);

  // const handleAddAdmin = () => {
  //   if (!newUsername.trim() || !newPassword.trim())
  //     return alert("יש למלא שם וסיסמה");

  //   const exists = admins.some(
  //     a => a.username.toLowerCase() === newUsername.toLowerCase()
  //   );
  //   if (exists) return alert("מנהל זה כבר קיים");

  //   dispatch(addAdmin({ username: newUsername, password: newPassword }));
  //   setNewUsername("");
  //   setNewPassword("");
  // };

  const handleChangePassword = () => {
    if (!changePasswordFor || !newPasswordForChange)
      return alert("בחר מנהל וסיסמה חדשה");

    dispatch(
      changePassword({
        username: changePasswordFor,
        newPassword: newPasswordForChange,
      })
    );
    setChangePasswordFor("");
    setNewPasswordForChange("");
  };

  const handleDeleteAdmin = (username: string) => {
    if (!username.trim()) return alert("בחר מנהל למחיקה");

    if (username.toLowerCase() === "adminaration") {
      alert("לא ניתן למחוק את adminaration");
      return;
    }

    const exists = admins.some(
      a => a.username.toLowerCase() === username.toLowerCase()
    );
    if (!exists) return alert("מנהל לא נמצא");

    dispatch(deleteAdmin(username));
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
        <button className="close-btn" onClick={onClose}>
          X
        </button>
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
          <select
            value={changePasswordFor}
            onChange={e => setChangePasswordFor(e.target.value)}
          >
            <option value="">בחר מנהל</option>
            {admins.map(a => (
              <option key={a.username} value={a.username}>
                {a.username}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="סיסמה חדשה"
            value={newPasswordForChange}
            onChange={e => setNewPasswordForChange(e.target.value)}
          />
          <button onClick={handleChangePassword}>שנה סיסמה</button>

          {/* מחיקת מנהל */}
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