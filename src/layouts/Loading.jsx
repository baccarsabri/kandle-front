import { LoadingSvg } from "@assets/LoadingSvg";

export default function Loading() {
  return (
    <div
      className="content__container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadingSvg height={70} width={70} />
    </div>
  );
}
