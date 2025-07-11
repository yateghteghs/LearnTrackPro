import { Star, Flame, Trophy } from "lucide-react";

interface AchievementCardProps {
  title: string;
  description: string;
  type: string;
}

export default function AchievementCard({ title, description, type }: AchievementCardProps) {
  const getIcon = () => {
    switch (type) {
      case "streak":
        return <Flame className="text-white" size={20} />;
      case "perfect_score":
        return <Trophy className="text-white" size={20} />;
      default:
        return <Star className="text-white" size={20} />;
    }
  };

  const getBgGradient = () => {
    switch (type) {
      case "streak":
        return "bg-gradient-to-r from-green-400 to-blue-500";
      case "perfect_score":
        return "bg-gradient-to-r from-purple-400 to-pink-500";
      default:
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 ${getBgGradient()} rounded-full flex items-center justify-center`}>
        {getIcon()}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
