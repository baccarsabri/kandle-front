import { useEffect, useState } from "react";

import DeleteConfirmationResultEntry from "./DeleteConfirmationResultEntry";
import { Link } from "react-router-dom";
import { LoadingSvg } from "@assets/LoadingSvg";
import axios from "@utils/axios";
import dayjs from "dayjs";
import { mutate } from "swr";
import { toast } from "react-toastify";

export default function ResultEntry({ data, search, index }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);
  const searchText = search.query;
  data.keyword = searchText;



  useEffect(() => {
    if (data.json !== null && data.json !== undefined) return;


    async function runQuery() {
      try {
        setProcessing(true);
        let res = null;
        let location = null;
        const response = await axios.get(`/search/keyword/${searchText}`);
        const keywordData = response.data;


        const lines = keywordData.split('\n');

        lines.forEach(line => {
          if (line.startsWith(" Location:")) {
            location = line.substring(10).trim();
          }

        });

        if (location === null) {
          // setError("Cannot split the sentence.");
          res = await axios.post("/scrape/getData", {
            title: searchText,
            resultId: data._id,
          });
        } else {
          let updatedSearchText = searchText.replace(`in ${location}`, '');
          res = await axios.post("/scrape/getData", {
            title: updatedSearchText,
            city: location,
            resultId: data._id,
          });


        }
        //   res = await axios.post("/scrape/getData", {
        //     title: keyword.data,
        //  resultId: data._id,
        //  });

        //   mutate(`/result/search/${search._id}`);

        // mutate(`/search/${search._id}`);
      } catch (err) {
        toast.error(err);
      } finally {
        setProcessing(false);
      }
    }
    runQuery();
  }, []);

  const handleClear = async () => {
    setProcessing(true);
    try {
      await axios.delete(`/result/${data._id}`);
      toast.success("Result cleared");
      mutate(`/result/search/${search._id}`);
    } catch (err) {
      toast.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {deleteConfirmation ? (
        <DeleteConfirmationResultEntry
          onClose={() => setDeleteConfirmation(false)}
          onConfirm={handleClear}
        />
      ) : null}
      <div className="content__container__content__entry">
        <div className="content__container__content__entry__top">
          <div className="content__container__content__entry__title">
            Result {index + 1} - {data.json?.length} candidates
          </div>
          <div className="content__container__content__entry__status">
            {data.json === null || data.json === undefined ? (
              <div className="content__container__content__entry__status__pending">
                Pending
              </div>
            ) : (
              <div className="content__container__content__entry__status__complete">
                Completed
              </div>
            )}
          </div>
          <div className="content__container__content__entry__date">
            Created on {dayjs(data.createdAt).format("DD MMM YYYY")}
          </div>
        </div>
        <div className="content__container__content__entry__bottom">
          <Link
            to="/details"
            state={data}
            disabled={processing}
            className="content__container__content__entry__bottom__button"
          >
            {processing ? (
              <LoadingSvg />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 11 13"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M4.17392 7.36525H7.40871M4.17392 9.52177H5.79132M1.47827 2.51308V11.1392C1.47827 11.4251 1.59187 11.6994 1.79409 11.9016C1.9963 12.1038 2.27056 12.2174 2.55653 12.2174H9.0261C9.31207 12.2174 9.58633 12.1038 9.78854 11.9016C9.99076 11.6994 10.1044 11.4251 10.1044 11.1392V4.85398C10.1043 4.71033 10.0756 4.56814 10.0199 4.43575C9.96415 4.30335 9.88253 4.18343 9.7798 4.08302L7.38606 1.74212C7.18462 1.54515 6.91409 1.43485 6.63236 1.43481H2.55653C2.27056 1.43481 1.9963 1.54842 1.79409 1.75063C1.59187 1.95284 1.47827 2.2271 1.47827 2.51308Z"
                    strokeWidth="1.07826"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.86969 1.435V3.59152C6.86969 3.87749 6.98329 4.15175 7.18551 4.35397C7.38772 4.55618 7.66198 4.66978 7.94795 4.66978H10.1045"
                    strokeWidth="1.07826"
                    strokeLinejoin="round"
                  />
                </svg>
                View Details
              </>
            )}
          </Link>
          <button
            onClick={() => setDeleteConfirmation(true)}
            disabled={processing}
            className="content__container__content__entry__bottom__button content__container__content__entry__bottom__button__secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="14"
              fill="currentColor"
              height="14"
              viewBox="0 0 50 50"
            >
              <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
            </svg>
            Clear Result
          </button>
        </div>
      </div >
    </>
  );
}
