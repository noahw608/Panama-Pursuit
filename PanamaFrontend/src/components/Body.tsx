import type {JSX} from "react";
import History from "./History-desc.tsx"
import Mission from "./Mission.tsx"
import Map from "./Map.tsx";


export default function Body() : JSX.Element {
    return (
        <>
            <History />
            <Mission />
            <Map />
        </>
    )
}