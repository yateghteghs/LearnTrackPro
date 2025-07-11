import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock } from "lucide-react";
import { Link } from "wouter";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    difficulty: string;
  };
  progress: number;
  currentLesson: string;
  canAccess: boolean;
  lockReason?: string;
}

export default function CourseCard({ 
  course, 
  progress, 
  currentLesson, 
  canAccess, 
  lockReason 
}: CourseCardProps) {
  const CardWrapper = canAccess ? Link : 'div';
  const cardProps = canAccess ? { href: `/course/${course.id}` } : {};

  return (
    <Card className={`${canAccess ? 'hover:border-edu-blue cursor-pointer' : 'opacity-60'} transition-colors border border-gray-200`}>
      <CardContent className="p-4">
        <CardWrapper {...cardProps}>
          <div className="flex items-center space-x-4">
            <img 
              src={course.thumbnail || "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=64&h=64&fit=crop"} 
              alt={`${course.title} thumbnail`}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-600">
                {canAccess ? currentLesson : lockReason || course.description}
              </p>
              {canAccess && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              {!canAccess && lockReason && (
                <div className="mt-2 flex items-center space-x-2">
                  <Lock className="text-gray-400" size={12} />
                  <span className="text-xs text-gray-500">{lockReason}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className={`w-8 h-8 ${canAccess ? 'bg-edu-blue' : 'bg-gray-200'} ${canAccess ? 'bg-opacity-10' : ''} rounded-lg flex items-center justify-center`}>
                {canAccess ? (
                  <Play className="text-edu-blue" size={16} />
                ) : (
                  <Lock className="text-gray-400" size={16} />
                )}
              </div>
            </div>
          </div>
        </CardWrapper>
      </CardContent>
    </Card>
  );
}
