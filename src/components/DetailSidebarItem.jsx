export default function DetailSidebarItem({
  fullName,
  item,
  active,
  onChange,
  index,
  setRankIndex,
}) {
  return (
    <button
      onClick={() => {
        onChange(item);
        setRankIndex(index);
      }}
      className={
        active
          ? "sidebar__profile__list__item active"
          : "sidebar__profile__list__item"
      }
    >
      <div className="sidebar__profile__list__item__name">{fullName}</div>
      <div className="sidebar__profile__list__item__num">{index + 1}</div>
    </button>
  );
}
