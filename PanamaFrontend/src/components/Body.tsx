import type {JSX} from "react";
import History from "./History-desc.tsx"
import Mission from "./Mission.tsx"
import Map from "./Map.tsx";
import Table from "./Table.tsx";


export default function Body() : JSX.Element {
    return (
        <>
            <History />
            <Mission />
            <Map />
            <Table />
        </>
    )
}