import { Bell, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function NavigationHeader({ user }: NavigationHeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-edu-blue rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-gray-900">EduFlow</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-edu-blue font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">My Courses</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Browse</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Analytics</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-edu-red rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
