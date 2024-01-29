import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();
  return (
    <div
      className="content__container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffe1e1",
        color: "#ff0000",
      }}
    >
      {error?.message ?? "An error occurred"}
    </div>
  );
}
