"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySessionService = void 0;
const studySession_model_1 = require("../models/studySession.model");
function toDateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function toKey(d) {
    return toDateOnly(d).toISOString().slice(0, 10);
}
class StudySessionService {
    static async logActivity(userId, minutes) {
        const today = toDateOnly(new Date());
        const existing = await studySession_model_1.StudySession.findOne({ user: userId, date: today });
        if (existing) {
            existing.durationMinutes += minutes;
            await existing.save();
        }
        else {
            await studySession_model_1.StudySession.create({ user: userId, date: today, durationMinutes: minutes });
        }
    }
    static async getWeeklyChart(userId) {
        const now = new Date();
        const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
        const monday = toDateOnly(new Date(now.getTime() - dayOfWeek * 86400000));
        const sessions = await studySession_model_1.StudySession.find({
            user: userId,
            date: { $gte: monday },
        });
        const byDay = {};
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
        const lastWeekSessions = await studySession_model_1.StudySession.find({
            user: userId,
            date: { $gte: lastMonday, $lt: monday },
        });
        const totalLastWeek = lastWeekSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
        let weekDeltaLabel = 'No data for last week yet';
        if (totalLastWeek > 0) {
            const pct = Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100);
            weekDeltaLabel = `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
        }
        else if (totalThisWeek > 0) {
            weekDeltaLabel = 'First week logged';
        }
        return { data, weekDeltaLabel };
    }
    static async getStreak(userId) {
        const sessions = await studySession_model_1.StudySession.find({ user: userId }).sort({ date: -1 }).limit(120);
        const dateSet = new Set(sessions.map((s) => toKey(s.date)));
        const computeStreakFrom = (fromDate) => {
            let cursor = toDateOnly(fromDate);
            if (!dateSet.has(toKey(cursor))) {
                cursor = new Date(cursor.getTime() - 86400000);
                if (!dateSet.has(toKey(cursor)))
                    return 0;
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
exports.StudySessionService = StudySessionService;
