import { Outlet} from "@remix-run/react"
import type { V2_MetaFunction, LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/index.css";


export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesUrl},
];

export const meta: V2_MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
        {name: "viewport", content: "initial-scale=1, width=device-width"}
    ];
};

export default function Index() {
    return (
        <div className="wrapper">
            <Outlet />
        </div>
    );
}
