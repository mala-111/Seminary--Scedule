import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchEmployees } from "../redux/slices/EmployeeSlice";
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // סינון שמות עובדים להצעות
  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(username.toLowerCase())
  );

  const handleLogin = () => {
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      alert("חובה למלא שם משתמש וסיסמה");
      return;
    }

    // מנהל
    if (cleanUsername.toLowerCase() === "adminaration") {
      if (cleanPassword === "1234") {
        navigate("/form-admin");
        return;
      }
      alert("סיסמת מנהל שגויה");
      return;
    }

    // עובד
    const employee = employees.find(
      (e) => e.name.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (!employee) {
      alert("שם משתמש לא קיים");
      return;
    }

    if (employee.employeeCode !== cleanPassword) {
      alert("סיסמה שגויה");
      return;
    }

    navigate("/form", {
      state: {
        username: employee.name,
        password: employee.employeeCode,
        employeeId: employee.employeeId,
      },
    });
  };

  const handleSelect = (name: string) => {
    setUsername(name);
    setShowSuggestions(false);
  };

  return (
    <div className="home-container">
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>מערכת שעות לעובד</h1>

        <div className="input-group">
          <div style={{ position: "relative" }}>
            <input
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowSuggestions(false), 150)
              }
            />

            {/* הצעות עובדים */}
            <AnimatePresence>
              {showSuggestions && filteredEmployees.length > 0 && (
                <motion.ul
                  className="suggestions-list"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp.employeeId}
                      onClick={() => handleSelect(emp.name)}
                    >
                      {emp.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
<motion.button
  style={{ padding: "10px 20px", fontSize: "16px" }}
  whileHover={{
    scale: 1.08,
    boxShadow: "0 10px 25px rgba(59,130,246,0.5)",
  }}
  whileTap={{ scale: 0.96 }}
  onClick={handleLogin}
>
  כניסה למערכת
</motion.button>
      </motion.div>
    </div>
  );
};

export default Home;