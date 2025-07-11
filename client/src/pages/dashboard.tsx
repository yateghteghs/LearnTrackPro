import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import CourseCard from "@/components/course-card";
import AchievementCard from "@/components/achievement-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, Star, Flame, CheckCircle, Play, Lock } from "lucide-react";

// Mock user ID for demo - in a real app this would come from auth
const CURRENT_USER_ID = 1;

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "enrollments"],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "achievements"],
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const activeEnrollments = enrollments.filter((e: any) => !e.completed);
  const recentAchievements = achievements.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader user={user} />
      
      <div className="flex">
        <Sidebar user={user} currentCourse={activeEnrollments[0]} />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Continue your learning journey and unlock new achievements
                  </p>
                </div>
                <Button className="bg-edu-blue hover:bg-blue-700">
                  <span className="mr-2">+</span>
                  Browse Courses
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Courses Completed"
                value={user.completedCourses?.toString() || "0"}
                icon={CheckCircle}
                color="text-edu-green"
                bgColor="bg-edu-green bg-opacity-10"
              />
              <StatsCard
                title="Hours Learned"
                value={user.hoursLearned?.toString() || "0"}
                icon={Clock}
                color="text-edu-blue"
                bgColor="bg-edu-blue bg-opacity-10"
              />
              <StatsCard
                title="Achievements"
                value={user.achievements?.toString() || "0"}
                icon={Trophy}
                color="text-edu-orange"
                bgColor="bg-edu-orange bg-opacity-10"
              />
              <StatsCard
                title="Current Streak"
                value={user.currentStreak?.toString() || "0"}
                icon={Flame}
                color="text-edu-red"
                bgColor="bg-edu-red bg-opacity-10"
              />
            </div>

            {/* Active Courses and Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Course Progress */}
              <Card>
                <CardHeader className="border-b border-gray-100">
                  <CardTitle>Continue Learning</CardTitle>
                  <p className="text-gray-600 text-sm mt-1">Pick up where you left off</p>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {activeEnrollments.length > 0 ? (
                    activeEnrollments.map((enrollment: any) => (
                      <CourseCard
                        key={enrollment.id}
                        course={enrollment.course}
                        progress={enrollment.progress}
                        currentLesson="Current Module"
                        canAccess={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No active courses. Browse courses to get started!</p>
                    </div>
                  )}
                  
                  {/* Sample locked course for demo */}
                  <CourseCard
                    course={{
                      id: 999,
                      title: "Advanced Concepts",
                      description: "Prerequisites not met",
                      thumbnail: "",
                      difficulty: "advanced",
                      estimatedHours: 0,
                      passingScore: 85,
                      createdAt: new Date(),
                    }}
                    progress={0}
                    currentLesson="Prerequisites not met"
                    canAccess={false}
                    lockReason="Complete JavaScript Fundamentals first"
                  />
                </CardContent>
              </Card>

              {/* Achievements & Quiz Section */}
              <div className="space-y-6">
                {/* Recent Achievements */}
                <Card>
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {recentAchievements.length > 0 ? (
                      recentAchievements.map((achievement: any) => (
                        <AchievementCard
                          key={achievement.id}
                          title={achievement.achievementTitle}
                          description={achievement.achievementDescription}
                          type={achievement.achievementType}
                        />
                      ))
                    ) : (
                      <>
                        <AchievementCard
                          title="JavaScript Master"
                          description="Completed 5 JavaScript modules"
                          type="course_completion"
                        />
                        <AchievementCard
                          title="10-Day Streak"
                          description="Learned for 10 consecutive days"
                          type="streak"
                        />
                        <AchievementCard
                          title="Quiz Champion"
                          description="Scored 100% on 3 quizzes"
                          type="perfect_score"
                        />
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Knowledge Check */}
                <div className="bg-gradient-to-r from-edu-blue to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Knowledge Check Required</h3>
                      <p className="text-blue-100 text-sm">Complete to unlock next module</p>
                    </div>
                    <div className="text-2xl opacity-80">📋</div>
                  </div>
                  <Button variant="secondary" className="bg-white text-edu-blue hover:bg-gray-100">
                    Take Quiz (5 questions)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile FAB */}
      <Button className="fixed bottom-6 right-6 w-14 h-14 bg-edu-blue hover:bg-blue-700 rounded-full shadow-lg lg:hidden">
        <span className="text-xl">+</span>
      </Button>
    </div>
  );
}
