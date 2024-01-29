import { Fragment, useState } from "react";

import DeleteConfirmation from "@components/DeleteConfirmation";
import { NavLink } from "react-router-dom";
import axios from "@utils/axios";
import dayjs from "dayjs";
import { mutate } from "swr";
import { toast } from "react-toastify";

export default function NewSearchEntry({ data, index }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/search/${data._id}`);
      await mutate("/search");
      toast.success("Search deleted");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const [editable, setEditable] = useState(false);
  const [name, setName] = useState(data?.name);

  return (
    <Fragment key={index}>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDelete}
        />
      )}
      <NavLink
        to={`/${data?.name?.toLowerCase()}`}
        state={data}
        className="sidebar__search__container__entry"
      >
        <div className="sidebar__search__container__entry__title">
          {editable ? (
            <input
              type="text"
              className="sidebar__search__container__entry__title__input"
              value={name}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setName(e.target.value);
              }}
              autoFocus
            />
          ) : (
            name
          )}
        </div>
        <div className="sidebar__search__container__entry__date">
          Created on {dayjs(data.createdAt).format("DD MMM YYYY")}
        </div>
        <div className="sidebar__search__container__entry__icons">
          <button
            className="sidebar__search__container__entry__icons__edit"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!editable) {
                setEditable(true);
              } else {
                await axios.put(`/search/${data._id}`, {
                  name,
                });
                await mutate("/search");
                setEditable(false);
              }
            }}
          >
            {editable ? (
              "Save"
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 12.4141H13"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 1.41421C10.2652 1.149 10.6249 1 11 1C11.1857 1 11.3696 1.03658 11.5412 1.10765C11.7128 1.17872 11.8687 1.28289 12 1.41421C12.1313 1.54554 12.2355 1.70144 12.3066 1.87302C12.3776 2.0446 12.4142 2.2285 12.4142 2.41421C12.4142 2.59993 12.3776 2.78383 12.3066 2.95541C12.2355 3.12699 12.1313 3.28289 12 3.41421L3.66667 11.7475L1 12.4142L1.66667 9.74755L10 1.41421Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteConfirmation(true);
            }}
            className="sidebar__search__container__entry__icons__delete"
          >
            <svg
              width="16"
              height="16"
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
          </button>
        </div>
      </NavLink>
    </Fragment>
  );
}
