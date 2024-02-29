export default function ExperienceItem({ item, company, title }) {
  console.log("experience", item)
  return (
    <div className="content__container__content__experience__item">
      <div className="content__container__content__experience__item__info">
        <div className="content__container__content__experience__item__info__heading">
          {item.title.name ?? "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__company">
          <a href={`https://www.${item.company.linkedin_url}`}> {item.company.name ?? "N/A"}</a>
        </div>
        <div className="content__container__content__experience__item__info__duration">
          {item.start_date} - {item.end_date ?? "Present"}
        </div>
        {item.company.location ? (
          <div className="content__container__content__experience__item__info__duration">
            {item.company.location.name ?? "N/A"}
          </div>
        ) : null}

        {item.description ? (
          <div
            style={{
              marginTop: ".5em",
              color: "#000",
            }}
            dangerouslySetInnerHTML={{ __html: item.description }}
            className="content__container__content__experience__item__info__duration"
          ></div>
        ) : null}
      </div>
    </div>
  );
}
