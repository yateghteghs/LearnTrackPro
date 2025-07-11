import { 
  users, courses, modules, quizzes, enrollments, moduleProgress, 
  quizAttempts, prerequisites, userAchievements,
  type User, type InsertUser, type Course, type InsertCourse,
  type Module, type InsertModule, type Quiz, type InsertQuiz,
  type Enrollment, type InsertEnrollment, type ModuleProgress, type InsertModuleProgress,
  type QuizAttempt, type InsertQuizAttempt, type Prerequisite, type InsertPrerequisite,
  type UserAchievement, type InsertUserAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, stats: Partial<Pick<User, 'currentStreak' | 'completedCourses' | 'hoursLearned' | 'achievements'>>): Promise<void>;

  // Course methods
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCourseWithModules(courseId: number): Promise<Course & { modules: Module[] } | undefined>;
  
  // Module methods
  getModule(id: number): Promise<Module | undefined>;
  getModulesByCourse(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Quiz methods
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizByModule(moduleId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Enrollment methods
  getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(userId: number, courseId: number, progress: number): Promise<void>;
  
  // Progress methods
  getUserModuleProgress(userId: number, moduleId: number): Promise<ModuleProgress | undefined>;
  createModuleProgress(progress: InsertModuleProgress): Promise<ModuleProgress>;
  updateModuleProgress(userId: number, moduleId: number, completed: boolean, timeSpent?: number): Promise<void>;
  
  // Quiz attempt methods
  getQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getBestQuizScore(userId: number, quizId: number): Promise<number>;
  
  // Prerequisites methods
  getCoursePrerequisites(courseId: number): Promise<Course[]>;
  checkPrerequisites(userId: number, courseId: number): Promise<boolean>;
  
  // Achievements methods
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStats(userId: number, stats: Partial<Pick<User, 'currentStreak' | 'completedCourses' | 'hoursLearned' | 'achievements'>>): Promise<void> {
    await db.update(users).set(stats).where(eq(users.id, userId));
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(courses.title);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourseWithModules(courseId: number): Promise<Course & { modules: Module[] } | undefined> {
    const course = await this.getCourse(courseId);
    if (!course) return undefined;
    
    const courseModules = await this.getModulesByCourse(courseId);
    return { ...course, modules: courseModules };
  }

  async getModule(id: number): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.orderIndex);
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizByModule(moduleId: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId));
    return quiz || undefined;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getUserEnrollments(userId: number): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select({
        id: enrollments.id,
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
        progress: enrollments.progress,
        completed: enrollments.completed,
        completedAt: enrollments.completedAt,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || undefined;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async updateEnrollmentProgress(userId: number, courseId: number, progress: number): Promise<void> {
    await db
      .update(enrollments)
      .set({ progress, completed: progress >= 100, completedAt: progress >= 100 ? new Date() : null })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  async getUserModuleProgress(userId: number, moduleId: number): Promise<ModuleProgress | undefined> {
    const [progress] = await db
      .select()
      .from(moduleProgress)
      .where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleId, moduleId)));
    return progress || undefined;
  }

  async createModuleProgress(progress: InsertModuleProgress): Promise<ModuleProgress> {
    const [newProgress] = await db.insert(moduleProgress).values(progress).returning();
    return newProgress;
  }

  async updateModuleProgress(userId: number, moduleId: number, completed: boolean, timeSpent?: number): Promise<void> {
    const updateData: any = { completed };
    if (completed) updateData.completedAt = new Date();
    if (timeSpent !== undefined) updateData.timeSpent = timeSpent;

    await db
      .update(moduleProgress)
      .set(updateData)
      .where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleId, moduleId)));
  }

  async getQuizAttempts(userId: number, quizId: number): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
      .orderBy(desc(quizAttempts.attemptedAt));
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [newAttempt] = await db.insert(quizAttempts).values(attempt).returning();
    return newAttempt;
  }

  async getBestQuizScore(userId: number, quizId: number): Promise<number> {
    const [result] = await db
      .select({ maxScore: sql<number>`max(${quizAttempts.score})` })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)));
    return result?.maxScore || 0;
  }

  async getCoursePrerequisites(courseId: number): Promise<Course[]> {
    return await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnail: courses.thumbnail,
        difficulty: courses.difficulty,
        estimatedHours: courses.estimatedHours,
        passingScore: courses.passingScore,
        createdAt: courses.createdAt,
      })
      .from(prerequisites)
      .innerJoin(courses, eq(prerequisites.prerequisiteCourseId, courses.id))
      .where(eq(prerequisites.courseId, courseId));
  }

  async checkPrerequisites(userId: number, courseId: number): Promise<boolean> {
    const prereqs = await this.getCoursePrerequisites(courseId);
    if (prereqs.length === 0) return true;

    for (const prereq of prereqs) {
      const enrollment = await this.getEnrollment(userId, prereq.id);
      if (!enrollment || !enrollment.completed) {
        return false;
      }
    }
    return true;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
  }

  async createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db.insert(userAchievements).values(achievement).returning();
    return newAchievement;
  }
}

export const storage = new DatabaseStorage();
