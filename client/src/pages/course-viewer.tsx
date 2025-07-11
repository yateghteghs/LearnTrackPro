import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import VideoPlayer from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle, Lock, Bookmark, Share } from "lucide-react";

// Mock user ID for demo
const CURRENT_USER_ID = 1;

export default function CourseViewer() {
  const { courseId } = useParams();
  
  const { data: user } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID],
  });

  const { data: course } = useQuery({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID, "enrollments"],
    select: (enrollments: any[]) => enrollments.find((e: any) => e.courseId === parseInt(courseId || "0")),
    enabled: !!courseId,
  });

  if (!user || !course) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const currentModuleIndex = 2; // Mock current module
  const modules = course.modules || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader user={user} />
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Course Header */}
        <Card className="mb-8">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <p className="text-gray-600 text-sm">Module 3: Functions and Scope</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Completion</div>
                  <div className="font-semibold text-gray-900">
                    {enrollment?.progress || 0}%
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <div className="flex">
            {/* Course Navigation */}
            <div className="w-80 border-r border-gray-200 bg-gray-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Course Content</h3>
                <div className="space-y-2">
                  {/* Module 1 - Completed */}
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">1. Introduction</span>
                      <CheckCircle className="h-5 w-5 text-edu-green" />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">15 min</div>
                  </div>
                  
                  {/* Module 2 - Completed */}
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">2. Basic Syntax</span>
                      <CheckCircle className="h-5 w-5 text-edu-green" />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">22 min</div>
                  </div>
                  
                  {/* Module 3 - Current */}
                  <div className="bg-edu-blue bg-opacity-10 border-2 border-edu-blue rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-edu-blue">3. Functions & Scope</span>
                      <PlayCircle className="h-5 w-5 text-edu-blue" />
                    </div>
                    <div className="text-sm text-blue-600 mt-1">Current: 18 min</div>
                  </div>
                  
                  {/* Module 4 - Locked */}
                  <div className="bg-white rounded-lg p-3 shadow-sm opacity-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">4. Objects & Arrays</span>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Pass quiz to unlock</div>
                  </div>
                  
                  {/* Module 5 - Locked */}
                  <div className="bg-white rounded-lg p-3 shadow-sm opacity-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-500">5. Final Project</span>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Complete all modules</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video/Content Area */}
            <div className="flex-1">
              <VideoPlayer
                title="Understanding JavaScript Functions"
                duration="7:30"
                currentTime="3:24"
                progress={45}
              />
              
              {/* Content Description */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Understanding JavaScript Functions
                </h3>
                <p className="text-gray-600 mb-4">
                  In this lesson, you'll learn about function declarations, expressions, and arrow functions. 
                  We'll cover scope, hoisting, and best practices for writing clean, reusable code.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button className="bg-edu-blue hover:bg-blue-700">
                    Mark as Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
