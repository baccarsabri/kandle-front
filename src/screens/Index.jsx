import { LoadingSvg } from "@assets/LoadingSvg";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@components";
import { Suspense } from "react";

export default function Index() {
  return (
    <div className="container__main">
      <Suspense
        fallback={
          <div
            className="sidebar"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LoadingSvg height={70} width={70} />
          </div>
        }
      >
        <Sidebar />
      </Suspense>
      <Outlet />
    </div>
  );
}
