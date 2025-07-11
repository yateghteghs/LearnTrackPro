import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCourseSchema, insertModuleSchema, insertQuizSchema,
  insertEnrollmentSchema, insertQuizAttemptSchema, insertUserAchievementSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseWithModules(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Module routes
  app.get("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const moduleData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/modules/:moduleId/quiz", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const quiz = await storage.getQuizByModule(moduleId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found for this module" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Enrollment routes
  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      
      // Check prerequisites
      const canEnroll = await storage.checkPrerequisites(enrollmentData.userId, enrollmentData.courseId);
      if (!canEnroll) {
        return res.status(400).json({ message: "Prerequisites not met for this course" });
      }

      // Check if already enrolled
      const existing = await storage.getEnrollment(enrollmentData.userId, enrollmentData.courseId);
      if (existing) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Progress routes
  app.post("/api/progress/modules", async (req, res) => {
    try {
      const { userId, moduleId, completed, timeSpent } = req.body;
      
      // Check if progress record exists
      let progress = await storage.getUserModuleProgress(userId, moduleId);
      
      if (!progress) {
        // Create new progress record
        progress = await storage.createModuleProgress({ userId, moduleId });
      }
      
      // Update progress
      await storage.updateModuleProgress(userId, moduleId, completed, timeSpent);
      
      // Update course enrollment progress
      const module = await storage.getModule(moduleId);
      if (module) {
        const courseModules = await storage.getModulesByCourse(module.courseId);
        const completedModules = await Promise.all(
          courseModules.map(async (m) => {
            const p = await storage.getUserModuleProgress(userId, m.id);
            return p?.completed || false;
          })
        );
        
        const courseProgress = (completedModules.filter(Boolean).length / courseModules.length) * 100;
        await storage.updateEnrollmentProgress(userId, module.courseId, courseProgress);
      }
      
      res.json({ message: "Progress updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quiz attempt routes
  app.post("/api/quiz-attempts", async (req, res) => {
    try {
      const attemptData = insertQuizAttemptSchema.parse(req.body);
      const attempt = await storage.createQuizAttempt(attemptData);
      
      // Check if this unlocks any achievements
      const user = await storage.getUser(attemptData.userId);
      if (user && attemptData.passed) {
        // Award achievement for perfect score
        if (attemptData.score === 100) {
          await storage.createUserAchievement({
            userId: attemptData.userId,
            achievementType: "perfect_score",
            achievementTitle: "Perfect Score",
            achievementDescription: "Scored 100% on a quiz"
          });
        }
        
        // Update user stats
        await storage.updateUserStats(attemptData.userId, {
          achievements: (user.achievements || 0) + 1
        });
      }
      
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz attempt data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/quiz-attempts/:quizId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const quizId = parseInt(req.params.quizId);
      const attempts = await storage.getQuizAttempts(userId, quizId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Prerequisites routes
  app.get("/api/courses/:courseId/prerequisites", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const prerequisites = await storage.getCoursePrerequisites(courseId);
      res.json(prerequisites);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/can-enroll/:courseId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const courseId = parseInt(req.params.courseId);
      const canEnroll = await storage.checkPrerequisites(userId, courseId);
      res.json({ canEnroll });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
