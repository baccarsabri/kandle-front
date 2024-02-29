export default function EducationItem({ item }) {
  return (
    <div className="content__container__content__experience__item">
      <div className="content__container__content__experience__item__info">
        <div className="content__container__content__experience__item__info__heading">
          {item.school.name || "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__company">
          {item.majors.length > 0 ? item.majors[0] : "" || "N/A"}
        </div>
        <div className="content__container__content__experience__item__info__duration">
          {`${item.start_date} - ${item.end_date}` || "N/A"}
        </div>
      </div>
    </div>
  );
}
