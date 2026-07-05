import "./EndSchedule.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const days = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
];

const hours = Array.from(
  { length: 8 },
  (_, i) => `${8 + i}:00`
);

const EndSchedule = ({
  open,
  onClose,
}: Props) => {
  if (!open) return null;

  return (
    <div className="schedule-overlay">
      <div className="schedule-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>מערכת שעות כללית</h2>

        <div className="table-wrapper">

          <table className="schedule-table">

            <thead>
              <tr>
                <th>שעה</th>

                {days.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>

              {hours.map(hour => (

                <tr key={hour}>

                  <td>{hour}</td>

                  {days.map(day => (

                    <td key={day}>
                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

export default EndSchedule;