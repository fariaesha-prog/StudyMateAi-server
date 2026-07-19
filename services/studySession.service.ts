import { StudySession } from '../models/studySession.model';

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toKey(d: Date): string {
  return toDateOnly(d).toISOString().slice(0, 10);
}

export class StudySessionService {
  public static async logActivity(userId: string, minutes: number): Promise<void> {
    const today = toDateOnly(new Date());
    const existing = await StudySession.findOne({ user: userId, date: today });
    if (existing) {
      existing.durationMinutes += minutes;
      await existing.save();
    } else {
      await StudySession.create({ user: userId, date: today, durationMinutes: minutes });
    }
  }

  public static async getWeeklyChart(userId: string) {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
    const monday = toDateOnly(new Date(now.getTime() - dayOfWeek * 86400000));

    const sessions = await StudySession.find({
      user: userId,
      date: { $gte: monday },
    });

    const byDay: Record<string, number> = {};
    for (const s of sessions) {
      const key = toKey(s.date);
      byDay[key] = (byDay[key] ?? 0) + s.durationMinutes;
    }

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = labels.map((label, i) => {
      const day = new Date(monday.getTime() + i * 86400000);
      const minutes = byDay[toKey(day)] ?? 0;
      return { day: label, hours: Math.round((minutes / 60) * 10) / 10 };
    });

    const totalThisWeek = data.reduce((sum, d) => sum + d.hours, 0);

    const lastMonday = toDateOnly(new Date(monday.getTime() - 7 * 86400000));
    const lastWeekSessions = await StudySession.find({
      user: userId,
      date: { $gte: lastMonday, $lt: monday },
    });
    const totalLastWeek = lastWeekSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;

    let weekDeltaLabel = 'No data for last week yet';
    if (totalLastWeek > 0) {
      const pct = Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100);
      weekDeltaLabel = `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
    } else if (totalThisWeek > 0) {
      weekDeltaLabel = 'First week logged';
    }

    return { data, weekDeltaLabel };
  }

  public static async getStreak(userId: string) {
    const sessions = await StudySession.find({ user: userId }).sort({ date: -1 }).limit(120);
    const dateSet = new Set(sessions.map((s) => toKey(s.date)));

    const computeStreakFrom = (fromDate: Date): number => {
      let cursor = toDateOnly(fromDate);
      if (!dateSet.has(toKey(cursor))) {
        cursor = new Date(cursor.getTime() - 86400000);
        if (!dateSet.has(toKey(cursor))) return 0;
      }
      let streak = 0;
      while (dateSet.has(toKey(cursor))) {
        streak += 1;
        cursor = new Date(cursor.getTime() - 86400000);
      }
      return streak;
    };

    const current = computeStreakFrom(new Date());
    const weekAgo = computeStreakFrom(new Date(Date.now() - 7 * 86400000));
    const delta = current - weekAgo;

    return {
      current,
      deltaLabel: `${delta >= 0 ? '+' : ''}${delta} from last week`,
    };
  }
}