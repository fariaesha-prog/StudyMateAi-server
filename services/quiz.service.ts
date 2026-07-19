import { Quiz } from '../models/quiz.model';
import { StudySessionService } from './studySession.service';

export class QuizService {
  public static async submit(userId: string, subject: string, score: number) {
    const quiz = await Quiz.create({ user: userId, subject, score });
    await StudySessionService.logActivity(userId, 3);
    return quiz;
  }

  public static async getAverage(userId: string) {
    const all = await Quiz.find({ user: userId });
    if (all.length === 0) return { avgScore: 0, deltaLabel: 'No quizzes yet' };

    const avgScore = Math.round(all.reduce((sum, q) => sum + q.score, 0) / all.length);

    const now = Date.now();
    const last30 = all.filter((q) => now - new Date((q as any).createdAt).getTime() <= 30 * 86400000);
    const prev30 = all.filter((q) => {
      const age = now - new Date((q as any).createdAt).getTime();
      return age > 30 * 86400000 && age <= 60 * 86400000;
    });

    let deltaLabel = 'Not enough history yet';
    if (last30.length && prev30.length) {
      const avgLast = last30.reduce((s, q) => s + q.score, 0) / last30.length;
      const avgPrev = prev30.reduce((s, q) => s + q.score, 0) / prev30.length;
      const diff = Math.round(avgLast - avgPrev);
      deltaLabel = `${diff >= 0 ? '+' : ''}${diff}% from last month`;
    }

    return { avgScore, deltaLabel };
  }

  public static async getBySubject(userId: string) {
    const all = await Quiz.find({ user: userId });
    const bySubject = new Map<string, number[]>();
    for (const q of all) {
      const list = bySubject.get(q.subject) ?? [];
      list.push(q.score);
      bySubject.set(q.subject, list);
    }

    return Array.from(bySubject.entries())
      .map(([subject, scores]) => ({
        subject: subject.length > 12 ? subject.slice(0, 12) + '…' : subject,
        score: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
      }))
      .slice(0, 6);
  }

  public static async getLowestSubject(userId: string) {
    const bySubject = await QuizService.getBySubject(userId);
    if (bySubject.length === 0) return null;
    return bySubject.reduce((lowest, cur) => (cur.score < lowest.score ? cur : lowest));
  }
}