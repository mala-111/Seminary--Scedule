// import { useState } from "react";
// import { motion } from "framer-motion";
// import "./BranchInputModal.css";

// interface BranchInputModalProps {
//   onSave: (branchName: string) => void;
//   onClose: () => void;
// }

// const BranchInputModal = ({ onSave, onClose }: BranchInputModalProps) => {
//   const [branchName, setBranchName] = useState("");

//   const handleSave = () => {
//     if (!branchName.trim()) {
//       alert("יש למלא שם סניף");
//       return;
//     }
//     onSave(branchName.trim());
//     setBranchName("");
//   };

//   return (
//     <div className="modal-overlay">
//       <motion.div
//         className="modal-content"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//       >
//         <h2>הקלד שם סניף</h2>
//         <input
//           type="text"
//           placeholder="שם סניף"
//           value={branchName}
//           onChange={(e) => setBranchName(e.target.value)}
//         />
//         <div className="modal-buttons">
//           <motion.button whileHover={{ scale: 1.05 }} onClick={handleSave}>
//             שמירה
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.05 }} onClick={onClose}>
//             NO
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default BranchInputModal;