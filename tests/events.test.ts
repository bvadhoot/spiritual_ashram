import { describe, expect, it } from "vitest";
import {
  events,
  getPastEventsFrom,
  getUpcomingEventsFrom,
  isUpcoming,
  sortEventsByDate,
  todayInIndia,
  type AshramEvent,
} from "@/lib/events";

const TODAY = "2026-10-18";

function event(overrides: Partial<AshramEvent>): AshramEvent {
  return {
    id: "test",
    slug: "test",
    date: "2026-12-01",
    title: "Test event",
    location: "Mallayyagiri",
    description: "A test.",
    category: "Satsang",
    ...overrides,
  };
}

describe("isUpcoming", () => {
  it("hides events whose final day has passed", () => {
    expect(isUpcoming(event({ date: "2026-10-17" }), TODAY)).toBe(false);
  });

  it("keeps an event visible for the whole of its final day", () => {
    expect(isUpcoming(event({ date: TODAY }), TODAY)).toBe(true);
    expect(
      isUpcoming(
        event({ date: "2026-10-16", endDate: TODAY }),
        TODAY,
      ),
    ).toBe(true);
  });

  it("keeps future events", () => {
    expect(isUpcoming(event({ date: "2026-10-19" }), TODAY)).toBe(true);
  });
});

describe("getUpcomingEvents", () => {
  it("returns only future events, sorted ascending", () => {
    const upcoming = getUpcomingEventsFrom(events, undefined, TODAY);
    expect(upcoming.length).toBeGreaterThan(0);
    expect(upcoming.every((item) => isUpcoming(item, TODAY))).toBe(true);

    const dates = upcoming.map((item) => item.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("does not include the demonstration past events", () => {
    const upcomingIds = getUpcomingEventsFrom(events, undefined, TODAY).map(
      (item) => item.id,
    );
    expect(upcomingIds).not.toContain("jayanti-2026");
    expect(upcomingIds).not.toContain("yoga-sadhana-camp-2026");
  });

  it("applies a limit after sorting", () => {
    const nextTwo = getUpcomingEventsFrom(events, 2, TODAY);
    expect(nextTwo).toHaveLength(2);
    expect(nextTwo[0].date).toBe("2026-11-22");
    expect(nextTwo[1].date).toBe("2026-12-04");
  });

  it("does not mutate the source array", () => {
    const original = events.map((item) => item.id);
    getUpcomingEventsFrom(events, undefined, TODAY);
    expect(events.map((item) => item.id)).toEqual(original);
  });
});

describe("getPastEvents", () => {
  it("returns past events newest first", () => {
    const past = getPastEventsFrom(events, TODAY);
    expect(past.length).toBeGreaterThanOrEqual(3);
    expect(past.every((item) => !isUpcoming(item, TODAY))).toBe(true);
    const dates = past.map((item) => item.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("sortEventsByDate", () => {
  it("sorts a copy without changing the input", () => {
    const list = [
      event({ id: "b", date: "2027-02-01" }),
      event({ id: "a", date: "2026-12-01" }),
    ];
    expect(sortEventsByDate(list).map((item) => item.id)).toEqual(["a", "b"]);
    expect(list.map((item) => item.id)).toEqual(["b", "a"]);
  });
});

describe("todayInIndia", () => {
  it("uses the Indian calendar date rather than UTC", () => {
    expect(todayInIndia(new Date("2026-10-18T18:29:00Z"))).toBe("2026-10-18");
    expect(todayInIndia(new Date("2026-10-18T18:31:00Z"))).toBe("2026-10-19");
    expect(todayInIndia(new Date("2026-10-18T20:00:00Z"))).toBe("2026-10-19");
  });
});
