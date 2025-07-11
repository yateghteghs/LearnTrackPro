import { db } from "./db";
import { 
  users, courses, modules, quizzes, enrollments, 
  moduleProgress, quizAttempts, userAchievements, prerequisites 
} from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create sample user
  const [user] = await db.insert(users).values({
    username: "demo_user",
    email: "demo@example.com",
    firstName: "Alex",
    lastName: "Johnson",
    password: "password123", // In real app, this would be hashed
    currentStreak: 7,
    completedCourses: 2,
    hoursLearned: 24.5,
    achievements: 5,
  }).returning();

  // Create sample courses
  const [jsCourse] = await db.insert(courses).values({
    title: "JavaScript Fundamentals",
    description: "Learn the basics of JavaScript programming",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
    difficulty: "beginner",
    estimatedHours: 12,
    passingScore: 85,
  }).returning();

  const [reactCourse] = await db.insert(courses).values({
    title: "React Development",
    description: "Build modern web applications with React",
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&h=200&fit=crop",
    difficulty: "intermediate",
    estimatedHours: 18,
    passingScore: 85,
  }).returning();

  const [advancedCourse] = await db.insert(courses).values({
    title: "Advanced JavaScript Concepts",
    description: "Master advanced JavaScript patterns and techniques",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
    difficulty: "advanced",
    estimatedHours: 24,
    passingScore: 90,
  }).returning();

  // Create course modules
  const jsModules = [
    {
      courseId: jsCourse.id,
      title: "Introduction to JavaScript",
      description: "Getting started with JavaScript",
      orderIndex: 1,
      contentType: "video",
      contentUrl: "https://example.com/video1",
      duration: 15,
      isRequired: true,
    },
    {
      courseId: jsCourse.id,
      title: "Variables and Data Types",
      description: "Understanding JavaScript variables",
      orderIndex: 2,
      contentType: "video",
      contentUrl: "https://example.com/video2",
      duration: 22,
      isRequired: true,
    },
    {
      courseId: jsCourse.id,
      title: "Functions and Scope",
      description: "Learning about functions",
      orderIndex: 3,
      contentType: "video",
      contentUrl: "https://example.com/video3",
      duration: 18,
      isRequired: true,
    },
    {
      courseId: jsCourse.id,
      title: "Objects and Arrays",
      description: "Working with objects and arrays",
      orderIndex: 4,
      contentType: "video",
      contentUrl: "https://example.com/video4",
      duration: 25,
      isRequired: true,
    },
    {
      courseId: jsCourse.id,
      title: "Final Project",
      description: "Build a complete JavaScript application",
      orderIndex: 5,
      contentType: "text",
      contentText: "Create a todo list application using JavaScript",
      duration: 60,
      isRequired: true,
    },
  ];

  const insertedModules = await db.insert(modules).values(jsModules).returning();

  // Create sample quiz
  const [quiz] = await db.insert(quizzes).values({
    moduleId: insertedModules[2].id, // Functions and Scope module
    title: "Functions and Scope Quiz",
    description: "Test your understanding of JavaScript functions",
    timeLimit: 15,
    passingScore: 85,
    questions: [
      {
        id: "q1",
        question: "What is the correct way to define a function in JavaScript?",
        options: [
          { value: "a", label: "function myFunction() { }", description: "Traditional function declaration" },
          { value: "b", label: "const myFunction = () => { }", description: "Arrow function syntax" },
          { value: "c", label: "var myFunction = function() { }", description: "Function expression" },
          { value: "d", label: "All of the above", description: "Multiple valid syntaxes" },
        ],
        correctAnswer: "d",
      },
      {
        id: "q2",
        question: "What is function scope in JavaScript?",
        options: [
          { value: "a", label: "Variables declared inside a function are only accessible within that function" },
          { value: "b", label: "Functions can access all global variables" },
          { value: "c", label: "Functions create their own execution context" },
          { value: "d", label: "Both A and C are correct" },
        ],
        correctAnswer: "d",
      },
      {
        id: "q3",
        question: "What does 'hoisting' mean in JavaScript?",
        options: [
          { value: "a", label: "Moving variables to the top of their scope" },
          { value: "b", label: "Lifting functions up in the code" },
          { value: "c", label: "A mechanism where variable and function declarations are moved to the top of their scope" },
          { value: "d", label: "None of the above" },
        ],
        correctAnswer: "c",
      },
    ],
  }).returning();

  // Create enrollments
  await db.insert(enrollments).values([
    {
      userId: user.id,
      courseId: jsCourse.id,
      progress: 60,
      completed: false,
    },
    {
      userId: user.id,
      courseId: reactCourse.id,
      progress: 25,
      completed: false,
    },
  ]);

  // Create module progress
  await db.insert(moduleProgress).values([
    {
      userId: user.id,
      moduleId: insertedModules[0].id,
      completed: true,
      completedAt: new Date(),
      timeSpent: 15,
    },
    {
      userId: user.id,
      moduleId: insertedModules[1].id,
      completed: true,
      completedAt: new Date(),
      timeSpent: 22,
    },
    {
      userId: user.id,
      moduleId: insertedModules[2].id,
      completed: false,
      timeSpent: 8,
    },
  ]);

  // Create quiz attempts
  await db.insert(quizAttempts).values([
    {
      userId: user.id,
      quizId: quiz.id,
      score: 95,
      answers: ["d", "d", "c"],
      passed: true,
      timeTaken: 480, // 8 minutes
    },
  ]);

  // Create achievements
  await db.insert(userAchievements).values([
    {
      userId: user.id,
      achievementType: "course_completion",
      achievementTitle: "JavaScript Master",
      achievementDescription: "Completed 5 JavaScript modules",
    },
    {
      userId: user.id,
      achievementType: "streak",
      achievementTitle: "7-Day Streak",
      achievementDescription: "Learned for 7 consecutive days",
    },
    {
      userId: user.id,
      achievementType: "perfect_score",
      achievementTitle: "Quiz Champion",
      achievementDescription: "Scored 95% on Functions Quiz",
    },
  ]);

  // Create prerequisites
  await db.insert(prerequisites).values([
    {
      courseId: reactCourse.id,
      prerequisiteCourseId: jsCourse.id,
    },
    {
      courseId: advancedCourse.id,
      prerequisiteCourseId: jsCourse.id,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});