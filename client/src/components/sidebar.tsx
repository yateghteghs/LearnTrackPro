import { Link, useLocation } from "wouter";
import { Home, BookOpen, Trophy, TrendingUp, Calendar, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  user: {
    currentStreak: number;
  };
  currentCourse?: {
    course: {
      title: string;
    };
    progress: number;
  };
}

export default function Sidebar({ user, currentCourse }: SidebarProps) {
  const [location] = useLocation();

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: Home, count: null },
    { href: "/courses", label: "My Courses", icon: BookOpen, count: 3 },
    { href: "/achievements", label: "Achievements", icon: Trophy, count: null },
    { href: "/progress", label: "Progress", icon: TrendingUp, count: null },
    { href: "/schedule", label: "Schedule", icon: Calendar, count: null },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <div className="space-y-6">
          {/* Learning Streak */}
          <div className="bg-gradient-to-r from-edu-blue to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Learning Streak</p>
                <p className="text-2xl font-bold">{user.currentStreak} Days</p>
              </div>
              <Flame className="text-orange-300" size={32} />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-edu-blue bg-opacity-10 text-edu-blue' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    <item.icon size={20} />
                    <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
                    {item.count && (
                      <span className="ml-auto bg-edu-orange text-white text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Current Course Progress */}
          {currentCourse && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Course</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 text-sm">
                  {currentCourse.course.title}
                </h4>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(currentCourse.progress)}%</span>
                  </div>
                  <Progress value={currentCourse.progress} className="h-2" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
