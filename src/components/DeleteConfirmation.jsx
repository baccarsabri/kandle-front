import { LoadingSvg } from "@assets/LoadingSvg";
import { useState } from "react";

export default function DeleteConfirmation({ onClose, onConfirm }) {
  const [processing, setProcessing] = useState(false);

  const handleDelete = async () => {
    setProcessing(true);
    await onConfirm();
    onClose();
    setProcessing(false);
  };

  return (
    <div className="delete__confirmation__overlay">
      <div className="delete__confirmation">
        <div className="delete__confirmation__icon">
          <svg
            width="50"
            height="50"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3.66675H2.33333H13"
              stroke="#FF0000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6663 3.66667V13C11.6663 13.3536 11.5259 13.6928 11.2758 13.9428C11.0258 14.1929 10.6866 14.3333 10.333 14.3333H3.66634C3.31272 14.3333 2.97358 14.1929 2.72353 13.9428C2.47348 13.6928 2.33301 13.3536 2.33301 13V3.66667M4.33301 3.66667V2.33333C4.33301 1.97971 4.47348 1.64057 4.72353 1.39052C4.97358 1.14048 5.31272 1 5.66634 1H8.33301C8.68663 1 9.02577 1.14048 9.27582 1.39052C9.52587 1.64057 9.66634 1.97971 9.66634 2.33333V3.66667"
              fill="#FF0000"
            />
            <path
              d="M11.6663 3.66667V13C11.6663 13.3536 11.5259 13.6928 11.2758 13.9428C11.0258 14.1929 10.6866 14.3333 10.333 14.3333H3.66634C3.31272 14.3333 2.97358 14.1929 2.72353 13.9428C2.47348 13.6928 2.33301 13.3536 2.33301 13V3.66667M4.33301 3.66667V2.33333C4.33301 1.97971 4.47348 1.64057 4.72353 1.39052C4.97358 1.14048 5.31272 1 5.66634 1H8.33301C8.68663 1 9.02577 1.14048 9.27582 1.39052C9.52587 1.64057 9.66634 1.97971 9.66634 2.33333V3.66667"
              stroke="#FF0000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.66699 7V11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.33301 7V11"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="delete__confirmation__title">
          Confirm Delete Search?
        </div>
        <div className="delete__confirmation__btn__container">
          <button
            onClick={onClose}
            className="delete__confirmation__btn__container__cancel"
          >
            Cancel
          </button>
          <button
            className="delete__confirmation__btn__container__delete"
            onClick={handleDelete}
          >
            {processing ? <LoadingSvg fill="#fff" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
