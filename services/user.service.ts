import { User } from '../models/user.model';
import { Resource } from '../models/resource.model';
import { Quiz } from '../models/quiz.model';
import { StudySession } from '../models/studySession.model';
import { AppError } from '../utils/appError';
import { UpdateProfileInput } from '../types/profile.interface';

export class UserService {
  public static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  public static async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findByIdAndUpdate(userId, input, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  public static async getStats(userId: string) {
    const [resourcesCount, studySessions, quizzes, recentUploads] = await Promise.all([
      Resource.countDocuments({ user: userId }),
      StudySession.find({ user: userId }).sort({ date: -1 }),
      Quiz.find({ user: userId }),
      Resource.find({ user: userId }).sort({ createdAt: -1 }).limit(4),
    ]);

    const totalMinutes = studySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const studyHours = Math.round(totalMinutes / 60);

    const quizAvg = quizzes.length
      ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
      : 0;

    // Streak: consecutive days (including today) with at least one session
    let streak = 0;
    const daySet = new Set(studySessions.map((s) => s.date.toISOString().slice(0, 10)));
    const cursor = new Date();
    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (daySet.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    // Monthly activity — last 6 months, summed hours
    const now = new Date();
    const monthlyActivity: { month: string; hours: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = target.toLocaleString('en-US', { month: 'short' });
      const minutesInMonth = studySessions
        .filter(
          (s) =>
            s.date.getFullYear() === target.getFullYear() &&
            s.date.getMonth() === target.getMonth()
        )
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      monthlyActivity.push({ month: monthLabel, hours: Math.round(minutesInMonth / 60) });
    }

    return {
      resourcesCount,
      studyHours,
      quizAvg,
      streak,
      monthlyActivity,
      recentUploads,
      totalAiChats: 0, // placeholder until AI Chat backend exists
    };
  }
}