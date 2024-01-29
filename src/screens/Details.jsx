import { Fragment, useEffect, useState } from "react";

import DetailSidebarItem from "@components/DetailSidebarItem";
import EducationItem from "@components/EducationItem";
import ExperienceItem from "@components/ExperienceItem";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "@utils/axios";

export default function Details() {
  const { state: prevState } = useLocation();

  if (prevState === undefined) {
    window.location.href = "/";
  }

  const [state, setState] = useState(prevState);
  const [downloadProcessing, setDownloadProcessing] = useState(false);
  const [selected, setSelected] = useState(state?.json[0]);
  const [rankIndex, setRankIndex] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  const forceComponentRerender = () => {
    setForceRender((prev) => prev + 1);
  };
  useEffect(() => {
    setState(prevState);
  }, [prevState, selected]);
  const generate_report = async () => {
    try {
      setLoading(true); // Set loading to true when the API call is initiated
      const response = await axios.post('/result/generate_report', {
        data: selected,
        keyword: state.keyword
      });

      setSelected(prevSelected => {
        const updatedSelected = { ...prevSelected, report: [response.data] }; // Add report=[] to the selected item
        return updatedSelected;
      });
      // Additional logic if needed

    } catch (error) {
      // Handle errors if any
    } finally {
      setLoading(false); // Set loading back to false whether the call succeeds or fails
      forceComponentRerender();
    }
  };

  let orderArray = state?.ranking?.ranked_candidates?.ids;

  let sortedData = state.json.sort((a, b) => {
    let aIndex = orderArray.indexOf(a.fullName);
    let bIndex = orderArray.indexOf(b.fullName);
    return aIndex - bIndex;
  });

  const handleDownload = () => {
    setDownloadProcessing(true);

    if (sortedData.filter((item) => typeof item === "string").length === 0) {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(sortedData)], {
        type: "application/json",
      });
      element.href = URL.createObjectURL(file);
      element.download = "data.json";
      document.body.appendChild(element);
      element.click();
      setDownloadProcessing(false);
      return;
    }
  };

  return (
    <div className="container__main">
      <div className="sidebar">
        <div className="sidebar__top__buttons">
          <div className="sidebar__back__btn">
            <Link to="/">
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17 14.9325C15.0428 12.473 13.3048 11.0775 11.7856 10.7456C10.2668 10.4142 8.8208 10.3639 7.4472 10.5954V15L1 7.81265L7.4472 1V5.18641C9.9868 5.207 12.1456 6.145 13.924 8C15.702 9.855 16.7276 12.1658 17 14.9325Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.898797"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          <button
            className="sidebar__top__delete"
            onClick={handleDownload}
            disabled={downloadProcessing}
          >
            {downloadProcessing ? "Downloading..." : "Download"}
          </button>
        </div>
        <div className="sidebar__profile__list">
          <div className="sidebar__profile__list__item">
            <div className="sidebar__profile__list__item__name">Full Name</div>
            <div className="sidebar__profile__list__item__name">Rank</div>
          </div>
          {state?.json?.length === 0 ? (
            <div className="sidebar__profile__list__item">No Data Found</div>
          ) : (
            sortedData.map((item, index) => (
              <DetailSidebarItem
                key={index}
                fullName={item.fullName}
                item={item}
                active={selected?.fullName === item.fullName}
                onChange={setSelected}
                setRankIndex={setRankIndex}
                index={index}
              />
            ))
          )}
        </div>
      </div>
      {!selected ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
            color: "#fff",
            fontSize: "24px",
          }}
        >
          No Data Found
        </div>
      ) : (
        <div className="content__container">
          <div className="content__container__profile">
            <div className="content__container__content__info">
              <div className="content__container__content__info__heading">
                {selected?.fullName || "N/A"}
              </div>
              <div className="content__container__content__info__designation">
                {selected?.title || "N/A"}
              </div>
              <div className="content__container__content__info__location">
                {selected?.location || "N/A"}
              </div>
              <div className="content__container__content__info__icons">
                <a href={selected?.url}>
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6721 6.8164e-05H1.32787C0.979718 -0.003475 0.644381 0.131239 0.395438 0.37465C0.146495 0.61806 0.00428035 0.950286 0 1.29843V16.7047C0.00505444 17.0523 0.147609 17.3838 0.396468 17.6265C0.645326 17.8693 0.980223 18.0036 1.32787 18.0001H16.6721C17.0203 18.0028 17.3554 17.8677 17.6042 17.6241C17.853 17.3805 17.9953 17.0484 18 16.7002V1.294C17.9938 0.946881 17.8508 0.616239 17.6022 0.373945C17.3535 0.131652 17.0193 -0.0027088 16.6721 6.8164e-05Z"
                      fill="#0076B2"
                    />
                    <path
                      d="M2.66461 6.74713H5.33657V15.3443H2.66461V6.74713ZM4.00133 2.46844C4.30779 2.46844 4.60737 2.55934 4.86216 2.72963C5.11695 2.89992 5.31552 3.14196 5.43273 3.42512C5.54994 3.70828 5.58053 4.01985 5.52063 4.3204C5.46074 4.62095 5.31305 4.89699 5.09624 5.11358C4.87944 5.33018 4.60326 5.47761 4.30265 5.53722C4.00205 5.59683 3.69051 5.56594 3.40746 5.44846C3.12441 5.33098 2.88256 5.13219 2.71252 4.87723C2.54247 4.62227 2.45186 4.32261 2.45215 4.01615C2.45254 3.60554 2.61593 3.21188 2.90641 2.92167C3.1969 2.63146 3.59072 2.46844 4.00133 2.46844ZM7.01264 6.74713H9.57395V7.92746H9.60936C9.96641 7.25172 10.8369 6.5391 12.1367 6.5391C14.8426 6.5332 15.3443 8.31402 15.3443 10.623V15.3443H12.6723V11.1616C12.6723 10.1657 12.6546 8.88353 11.284 8.88353C9.9133 8.88353 9.68018 9.96943 9.68018 11.0966V15.3443H7.01264V6.74713Z"
                      fill="white"
                    />
                  </svg>
                </a>

              </div>
              <button
                onClick={generate_report}
                className="sidebar__top__delete"
                style={{ width: '160px', marginTop: '10px', marginBottom: '15px' }}
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
            <div className="content__container__report">
              {selected.report && selected.report[0]
                ?.split("\n\n")
                .map((item, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: index === 0 || index === 6 ? "24px" : "16px",
                      margin:
                        index === 0 || index === 6 ? "1em 0em" : ".5em 0em",
                      color: index === 0 || index === 6 ? "#5167f6" : "#000",
                    }}
                  >
                    {index === 0 || index === 6
                      ? item
                      : item
                        .replaceAll("**", "")
                        .split(":")
                        .map((item, index) => (
                          <Fragment key={index}>
                            {index === 0 ? (
                              <div
                                style={{
                                  fontWeight: "500",
                                  marginBottom: ".5em",
                                }}
                              >
                                {item + ":"}
                              </div>
                            ) : (
                              <span>{item}</span>
                            )}
                          </Fragment>
                        ))}
                  </div>
                ))}
            </div>
            {selected?.summary ? (
              <div className="content__container__content__experience">
                <div className="content__container__content__experience__heading">
                  About
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: selected?.summary }}
                ></div>
              </div>
            ) : null}
            <div className="content__container__content__experience">
              <div className="content__container__content__experience__heading">
                Experiences
              </div>
              {selected?.member_experience_collection?.length === 0 ? (
                <div>No Experience</div>
              ) : (
                selected?.member_experience_collection
                  .filter((item) => item.deleted === 0)
                  .reverse()
                  .map((item, index) => (
                    <ExperienceItem item={item} key={index} />
                  ))
              )}
            </div>
            <div className="content__container__content__experience">
              <div className="content__container__content__experience__heading">
                Education
              </div>
              {selected?.member_education_collection?.length === 0 ? (
                <div>No Education</div>
              ) : (

                selected?.member_education_collection
                  .filter((item) => item.deleted === 0)
                  .map((item, index) => (
                    <EducationItem item={item} key={index} />


                  ))


              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
