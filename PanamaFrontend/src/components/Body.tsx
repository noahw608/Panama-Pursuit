import type {JSX} from "react";
import History from "./History-desc.tsx"
import Mission from "./Mission.tsx"
import {WorldMap} from "./WorldMap.tsx";


export default function Body() : JSX.Element {
    return (
        <>
            <History />
            <Mission />
            <WorldMap />
        </>
    )
}