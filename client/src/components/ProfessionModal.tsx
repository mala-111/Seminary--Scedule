import { motion, AnimatePresence } from "framer-motion";
import "./ProfessionModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProfessionModal = ({ open, onClose }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
          >
            <h2>בחירת מקצועות</h2>
            <div className="profession-list">
              <button>מתמטיקה</button>
              <button>אנגלית</button>
              <button>היסטוריה</button>
              <button>מדעים</button>
            </div>
            <button onClick={onClose}>
              חזרה
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfessionModal;