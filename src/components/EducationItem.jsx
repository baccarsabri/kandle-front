export default function EducationItem({ item }) {
  return (
    <div className="content__container__content__experience__item">
      <div className="content__container__content__experience__item__info">
        <div className="content__container__content__experience__item__info__heading">
          {item.title || "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__company">
          {item.subtitle === null ? "NA" : "" || "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__duration">
          {`${item.date_from} - ${item.date_to}` || "N/A"}
        </div>
      </div>
    </div>
  );
}
