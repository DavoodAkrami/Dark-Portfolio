"use client"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchVercelAnalyses } from "@/store/slices/vercelSlice";
import { LineChart } from "@mui/x-charts/LineChart";

const StatCard = ({ label, value, sub }) => (
    <div className="bg-[var(--button-color)] rounded-ap [--ap-radius:2rem] p-6 flex flex-col gap-1 flex-1 min-w-[180px]">
        <span className="text-[var(--subtext-color)] text-sm">{label}</span>
        <span className="text-[var(--accent-color)] text-3xl font-[650]">{value}</span>
        {sub && <span className="text-[var(--subtext-color)] text-xs">{sub}</span>}
    </div>
);

const dashboard = () => {
    const dispatch = useDispatch();
    const { loading: analyticsLoading, error: analyticsError, data: analyticsData } = useSelector(state => state.vercelSlice);

    const [items, setItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState([]);
    const [syncLoading, setSyncLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchVercelAnalyses());

        (async () => {
            try {
                const res = await fetch('/api/list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topK: 200 }) });
                const data = await res.json();
                setItems(data?.results || []);
            } catch {
                setItems([]);
            } finally {
                setItemsLoading(false);
            }
        })();

        (async () => {
            try {
                const res = await fetch('/api/sync/status');
                const data = await res.json();
                setSyncStatus(data?.status || []);
            } catch {
                setSyncStatus([]);
            } finally {
                setSyncLoading(false);
            }
        })();
    }, []);

    const catBreakdown = useMemo(() => {
        const counts = {};
        items.forEach((item) => {
            const cat = item.metadata?.cat || 'unknown';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [items]);

    const needsSyncCount = syncStatus.filter((s) => s.hasNewData).length;

    const chartSeries = useMemo(() => {
        if (!Array.isArray(analyticsData)) return null;
        return {
            dates: analyticsData.map((d) => String(d.date)),
            users: analyticsData.map((d) => Number(d.users) || 0),
        };
    }, [analyticsData]);

    return (
        <div className="min-h-screen bg-[var(--primary-color)] text-[var(--text-color)] p-8 max-md:p-5 max-md:pt-20">
            <h1 className="text-[2rem] font-[600] text-[var(--accent-color)] mb-6">Dashboard</h1>

            <div className="flex flex-wrap gap-4 mb-8">
                <StatCard
                    label="AI Data Entries"
                    value={itemsLoading ? "…" : items.length}
                    sub={itemsLoading ? undefined : `${catBreakdown.length} categories`}
                />
                {catBreakdown.slice(0, 3).map(([cat, count]) => (
                    <StatCard key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={count} />
                ))}
                <StatCard
                    label="Data Sync"
                    value={syncLoading ? "…" : needsSyncCount}
                    sub={syncLoading ? undefined : needsSyncCount > 0 ? "sources need syncing" : "all up to date"}
                />
            </div>

            <div className="bg-[var(--button-color)] rounded-ap [--ap-radius:2.4rem] p-6">
                <h2 className="text-lg font-[600] text-[var(--text-color)] mb-4">Visitor Analytics</h2>

                {analyticsLoading ? (
                    <div className="w-full flex justify-center items-center py-16">
                        <div className="h-8 w-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : analyticsError || !chartSeries || chartSeries.dates.length === 0 ? (
                    <div className="py-12 text-center text-[var(--subtext-color)]">
                        Analytics data is unavailable right now.
                    </div>
                ) : (
                    <LineChart
                        xAxis={[{ data: chartSeries.dates, scaleType: 'point' }]}
                        series={[{ data: chartSeries.users, label: 'Visitors', color: '#6366f1' }]}
                        height={300}
                    />
                )}
            </div>
        </div>
    )
}

export default dashboard;
