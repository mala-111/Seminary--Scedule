import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

const STORAGE_KEY = "saved_users";

interface User {
  username: string;
  password: string;
}

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [savedUsers, setSavedUsers] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const users = localStorage.getItem(STORAGE_KEY);
    if (users) {
      const parsed: User[] = JSON.parse(users);
      const unique = parsed.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.username === user.username)
      );
      setSavedUsers(unique);
    }
  }, []);

  const handleLogin = () => {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    alert("חובה למלא שם משתמש וסיסמה");
    return;
  }

  // התחברות מנהל
  if (cleanUsername.toLowerCase() === "adminaration") {
    if (cleanPassword === "1234") {
      navigate("/form-admin");
      return;
    }

    alert("סיסמת מנהל שגויה");
    return;
  }

  // שמירת משתמשים רגילים
  const filtered = savedUsers.filter(
    (u) => u.username !== cleanUsername
  );

  const updated = [
    { username: cleanUsername, password: cleanPassword },
    ...filtered,
  ].slice(0, 3);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  setSavedUsers(updated);

  navigate("/form", {
    state: {
      username: cleanUsername,
      password: cleanPassword,
    },
  });
};

  const handleSelectSuggestion = (name: string) => {
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
          <input
            placeholder="שם משתמש"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <AnimatePresence>
            {showSuggestions && savedUsers.length > 0 && (
              <motion.ul
                className="suggestions-list"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {savedUsers
                  .filter((u) =>
                    u.username.toLowerCase().includes(username.toLowerCase())
                  )
                  .map((user) => (
                    <li
                      key={user.username}
                      onClick={() => handleSelectSuggestion(user.username)}
                    >
                      {user.username}
                    </li>
                  ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <motion.button
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