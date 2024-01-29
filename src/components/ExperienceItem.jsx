export default function ExperienceItem({ item }) {
  return (
    <div className="content__container__content__experience__item">
      <div className="content__container__content__experience__item__info">
        <div className="content__container__content__experience__item__info__heading">
          {item.title ?? "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__company">
          <a href={item.company_url}> {item.company_name ?? "N/A"}</a>
        </div>
        <div className="content__container__content__experience__item__info__duration">
          {item.date_from} - {item.date_to ?? "Present"}
          {" - " + item.duration || "N/A "}
        </div>
        {item.location ? (
          <div className="content__container__content__experience__item__info__duration">
            {item.location ?? "N/A"}
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
