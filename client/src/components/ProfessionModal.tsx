import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProfessionModal.css";
import SacredProfessions from "./SacredProfessions";
import SandProfessions from "./SandProfessions";
import GroupsProfessions from "./GroupsProfessions";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaveProfession: (profession: string, cycles: string[]) => void;
}

const ProfessionModal = ({ open, onClose, onSaveProfession }: Props) => {
  const [activeCategory, setActiveCategory] = useState<"sacred" | "sand" | "groups" | null>(null);

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
            {!activeCategory ? (
              <>
                <h2>בחירת מקצועות</h2>
                <div className="profession-list">
                  <button onClick={() => setActiveCategory("sacred")}>מקצועות קודש</button>
                  <button onClick={() => setActiveCategory("sand")}>מקצועות חול</button>
                  <button onClick={() => setActiveCategory("groups")}>הקבצות</button>
                </div>
                <button onClick={onClose}>חזרה</button>
              </>
            ) : activeCategory === "sacred" ? (
              <SacredProfessions
                onClose={() => setActiveCategory(null)}
                onSave={(p, c) => onSaveProfession(p, c)}
              />
            ) : activeCategory === "sand" ? (
              <SandProfessions
                onClose={() => setActiveCategory(null)}
                onSave={(p, c) => onSaveProfession(p, c)}
              />
            ) : (
              <GroupsProfessions
                onClose={() => setActiveCategory(null)}
                onSave={(p, c) => onSaveProfession(p, c)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfessionModal;