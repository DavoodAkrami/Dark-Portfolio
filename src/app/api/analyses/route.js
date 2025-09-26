export async function GET() {
    try {
      const res = await fetch(
        `https://api.vercel.com/v6/analytics/events?projectId=${process.env.VERCEL_PROJECT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          },
          cache: "no-store",
        }
      );
  
      if (!res.ok) {
        return Response.json(
          { error: "Failed to fetch data from Vercel" },
          { status: res.status }
        );
      }
  
      const data = await res.json();
  
      const chartData = data.events?.map((e) => ({
        date: e.day || e.timestamp || "unknown",
        users: e.count || 0,
      })) || [];
  
      return Response.json(chartData);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  