import { NextResponse } from "next/server";
import {
  getDayCalendar,
  getMonthCalendar,
  isDateKey,
  isMonthKey,
  todayKey,
} from "@/lib/panchang";
import { getStoredFestivals } from "@/lib/panchang/festival-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Short enough that an admin edit shows up almost immediately at the edge.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const month = searchParams.get("month");
  const today = todayKey();

  if (date) {
    if (!isDateKey(date)) {
      return NextResponse.json(
        { ok: false, error: "Use a valid date in YYYY-MM-DD format." },
        { status: 400 },
      );
    }

    try {
      const overrides = await getStoredFestivals();
      const day = await getDayCalendar(date, [], today, overrides);
      return NextResponse.json({ ok: true, day }, { headers: CACHE_HEADERS });
    } catch (error) {
      console.error("Panchang day API failed", error);
      return NextResponse.json(
        { ok: false, error: "The panchang for this date could not be loaded." },
        { status: 500 },
      );
    }
  }

  if (month) {
    if (!isMonthKey(month)) {
      return NextResponse.json(
        { ok: false, error: "Use a valid month in YYYY-MM format." },
        { status: 400 },
      );
    }

    try {
      const overrides = await getStoredFestivals();
      const calendar = getMonthCalendar(month, [], today, overrides);
      return NextResponse.json(
        { ok: true, calendar },
        { headers: CACHE_HEADERS },
      );
    } catch (error) {
      console.error("Panchang month API failed", error);
      return NextResponse.json(
        { ok: false, error: "The calendar for this month could not be loaded." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { ok: false, error: "Pass ?month=YYYY-MM or ?date=YYYY-MM-DD." },
    { status: 400 },
  );
}
