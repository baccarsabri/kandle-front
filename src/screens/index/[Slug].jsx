import { useEffect, useLayoutEffect, useState } from "react";

import { LoadingSvg } from "@assets/LoadingSvg";
import ResultEntry from "@components/ResultEntry";
import { SendSvg } from "@assets/SendSvg";
import axios from "@utils/axios";
import { mutate } from "swr";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import useQuery from "@utils/useQuery";
import axiosExternal from "@utils/externalAxios";
import { NavLink } from "react-router-dom";


export default function Index() {
  const min = 0;
  const max = 50;

  const [valueResults, setValue] = useState(1);
  const [searchData, setSearchData] = useState(null);
  const [searchInsightsLoading, setSearchInsightsLoading] = useState(false)

  const handleChange = event => {
    const value = Math.max(min, Math.min(max, Number(event.target.value)));
    setValue(value);
  };
  const setValueResultToOne = () => {
    setValue(1);
  }
  const { state: prevState } = useLocation();
  const [state, setState] = useState(prevState);

  useLayoutEffect(() => {
    setState(prevState);
  }, [prevState]);

  const { data } = useQuery(`/result/search/${state._id}`);
  console.log("data:::", data)

  const [searchText, setSearchText] = useState(state.query ? state.query : "");
  const [fileUploaded, setFileUploaded] = useState(
    state.type ? state.type === "description" : false
  );
  const SearchInsights = async () => {
    setSearchInsightsLoading(true)
    const res = await axios.post("/scrape/SearchInsights",
      { data: data[0].json }
    );
    setSearchData(res.data);
    setSearchInsightsLoading(false);
    console.log(res);

  }

  useEffect(() => {
    setSearchText(state.query ? state.query : "");
    setFileUploaded(state.type ? state.type === "description" : false);
  }, [state]);

  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setSearchText(content);
        setFileUploaded(true);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.post("/result", {
        searchId: state._id,
      });

      await axios.put(`/search/${state._id}`, {
        query: searchText,
        type: fileUploaded ? "description" : "query",
      });
      mutate(`/result/search/${state._id}`);
      mutate(`/search/${state._id}`);
      setState((prevState) => ({
        ...prevState,
        query: searchText,
        type: fileUploaded ? "description" : "query",
      }));

    } catch (err) {
      toast.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="content__container">
      <a href="https://docs.kandel.ai/" target="_blank" className="sidebar__top__delete" style={{ width: '150px', height: "35px", position: 'absolute', top: 20, right: 10, textDecoration: 'none', justifyContent: 'center', backgroundColor: '#5167f6', borderRadius: '5px' }}>Documentation</a>
      <div className="content__container__content">
        {data?.length > 0 ? (

          data?.map((item, index) => (
            <>
              <ResultEntry
                key={item._id}
                data={item}
                search={state}
                index={index}
                results={valueResults}
                setValueResultToOne={setValueResultToOne}
                SearchInsights={SearchInsights}
                loading={searchInsightsLoading}
              />
              {searchData && (
                <div className="content__container__content__under_entry">
                  <ul style={{ listStyleType: 'none' }}>
                    <li><div className="content__container__content__entry__title" >
                      Number of Results :
                      <span className="content__container__content__entry__status__complete">
                        &nbsp;{searchData.analysis["Number of candidates"]} condidates
                      </span>

                    </div>

                    </li>
                    <li>
                      <div className="content__container__content__entry__title">
                        Average Experience :
                        <span className="content__container__content__entry__status__complete">
                          &nbsp; {searchData.analysis["Average experience"]} years
                        </span>

                      </div>
                    </li>

                    <li>
                      <div className="content__container__content__entry__title" >
                        Average Salary :
                        <span className="content__container__content__entry__status__complete">
                          &nbsp;${Math.ceil(searchData.analysis["Average salary"])}
                        </span>

                      </div>
                    </li>
                    <li style={{ paddingTop: '25px' }}>
                      <div className="content__container__content__under_entry">
                        <img src={`data:image/png;base64, ${searchData.image}`} alt="Red dot" className="image-container" />

                      </div>
                    </li>
                  </ul>
                  <div className="content__container__content__entry__title">
                    Top Skills :
                    <span >
                      &nbsp;  {searchData.analysis["Most popular skills"] && searchData.analysis["Most popular skills"].length > 0 ? (
                        <div style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', fontWeight: 'bold', }}>

                          {searchData.analysis["Most popular skills"].slice(0, 10).map((skill, index) => (
                            <span key={index} className="content__container__content__entry__status__complete" style={{ padding: '05px' }}>{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <span>No skills.</span>
                      )}
                    </span>
                  </div>





                </div>
              )}

            </>

          ))
        )
          : (
            <>
              <div className="content__container__content__heading">
                {processing
                  ? "Please Wait"
                  : "Let us help you find the best People"}
              </div>
              <div className="content__container__content__text">
                {processing
                  ? "We are scraping the web for you"
                  : "Please start writing your query"}
              </div>
            </>
          )}
      </div>
      <div className="content__container__bottom">
        <label style={{ position: 'absolute', left: '9%', bottom: '10%', padding: '1.5em' }}>Results : </label>
        <input
          type="text"
          style={{
            display: 'flex',
            borderRadius: '5px',
            padding: '1.5em',
            width: '10%',
            border: 'none',
            outline: 'none',
          }}
          placeholder="1"
          value={valueResults}
          onChange={handleChange}
        />

        <div className="content__container__bottom__content">

          {state.query === undefined || state.query === null ? (
            <button className="content__container__bottom__upload">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={processing}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="13"
                viewBox="0 0 11 13"
                fill="none"
              >
                <path
                  d="M4.17392 7.36525H7.40871M4.17392 9.52177H5.79132M1.47827 2.51308V11.1392C1.47827 11.4251 1.59187 11.6994 1.79409 11.9016C1.9963 12.1038 2.27056 12.2174 2.55653 12.2174H9.0261C9.31207 12.2174 9.58633 12.1038 9.78854 11.9016C9.99076 11.6994 10.1044 11.4251 10.1044 11.1392V4.85398C10.1043 4.71033 10.0756 4.56814 10.0199 4.43575C9.96415 4.30335 9.88253 4.18343 9.7798 4.08302L7.38606 1.74212C7.18462 1.54515 6.91409 1.43485 6.63236 1.43481H2.55653C2.27056 1.43481 1.9963 1.54842 1.79409 1.75063C1.59187 1.95284 1.47827 2.2271 1.47827 2.51308Z"
                  stroke="#F5F9FF"
                  strokeWidth="1.07826"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.86969 1.435V3.59152C6.86969 3.87749 6.98329 4.15175 7.18551 4.35397C7.38772 4.55618 7.66198 4.66978 7.94795 4.66978H10.1045"
                  stroke="#F5F9FF"
                  strokeWidth="1.07826"
                  strokeLinejoin="round"
                />
              </svg>
              {!fileUploaded
                ? " Upload job description"
                : "Upload new job description"}
            </button>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="content__container__bottom__search"
            style={{
              backgroundColor: processing ? "#fafafa" : null,
            }}
          >

            <input
              className="content__container__bottom__search__input"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Start typing here..."
              disabled={
                processing ||
                fileUploaded ||
                (state.query !== null && state.query !== undefined)
              }
            />
            <button
              disabled={processing}
              className="content__container__bottom__search__button"
              style={{
                backgroundColor: processing ? "#fafafa" : null,
              }}
            >
              {processing ? <LoadingSvg /> : <SendSvg />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
