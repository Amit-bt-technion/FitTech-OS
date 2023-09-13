import {Outlet} from "@remix-run/react";


export default function Index() {
  return (
    <div className="wrapper">
      <Outlet />
    </div>
  );
}
