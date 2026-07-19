import { StudyPlan } from '../models/studyPlan.model';
import { PlannerGeminiService } from './plannerGemini.service';
import { AppError } from '../utils/appError';

function toDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export class StudyPlanService {
  public static async generate(userId: string, examName: string, examDateStr: string, topics: string[]) {
    const today = toDateOnly(new Date());
    const examDate = toDateOnly(new Date(examDateStr));

    const totalDays = Math.round((examDate.getTime() - today.getTime()) / 86400000);
    if (totalDays < 1) {
      throw new AppError('Exam date must be at least 1 day in the future', 400);
    }
    if (totalDays > 60) {
      throw new AppError('Study plans support a maximum of 60 days', 400);
    }

    const result = await PlannerGeminiService.generatePlan(examName, topics, totalDays);

    const days = result.days
      .sort((a, b) => a.dayOffset - b.dayOffset)
      .map((d) => ({
        dayOffset: d.dayOffset,
        date: new Date(today.getTime() + d.dayOffset * 86400000),
        focusTopics: d.focusTopics,
        tasks: d.tasks,
        estimatedHours: d.estimatedHours,
        completed: false,
      }));

    return StudyPlan.create({
      user: userId,
      examName,
      examDate,
      topics,
      days,
      tips: result.tips,
    });
  }

  public static async list(userId: string) {
    return StudyPlan.find({ user: userId }).sort({ createdAt: -1 });
  }

  public static async getById(id: string, userId: string) {
    const plan = await StudyPlan.findById(id);
    if (!plan) throw new AppError('Study plan not found', 404);
    if (plan.user.toString() !== userId) throw new AppError('Not authorized', 403);
    return plan;
  }

  public static async toggleDay(id: string, userId: string, dayOffset: number, completed: boolean) {
    const plan = await StudyPlanService.getById(id, userId);
    const day = plan.days.find((d) => d.dayOffset === dayOffset);
    if (!day) throw new AppError('Day not found in this plan', 404);
    day.completed = completed;
    await plan.save();
    return plan;
  }

  public static async remove(id: string, userId: string) {
    const plan = await StudyPlanService.getById(id, userId);
    await plan.deleteOne();
  }
}