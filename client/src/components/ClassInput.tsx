// ClassInput.tsx

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchAllClasses } from "../redux/slices/AllClassesSlice";

interface ClassInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ClassInput = ({
  value,
  onChange,
}: ClassInputProps) => {
  const dispatch = useAppDispatch();

  const { allClasses } = useAppSelector(
    (state) => state.allClasses
  );

  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchAllClasses());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const className = e.target.value;

    onChange(className);

    if (!className.trim()) {
      setError("");
      return;
    }

    const exists = allClasses.some(
      (c) =>
        c.className.trim().toLowerCase() ===
        className.trim().toLowerCase()
    );

    if (exists) {
      setError("");
    } else {
      setError("הכיתה אינה קיימת במערכת");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="הקלד כיתה"
        value={value}
        onChange={handleChange}
      />

      {error && (
        <div
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ClassInput;