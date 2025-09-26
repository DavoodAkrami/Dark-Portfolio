"use client"
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchVercelAnalyses } from "@/store/slices/vercelSlice";


const dashboard = () => {
    const dispatch = useDispatch();
    const { loading, error, data } = useSelector(state => state.vercelSlice);

    useEffect(() => {
        dispatch(
            fetchVercelAnalyses()
        )
        console.log(data)
    }, [])

    return (
        <div
            className="min-h-screen bg-[var(--primary-color)]"
        >
            {data}
        </div>
    )
}

export default dashboard;