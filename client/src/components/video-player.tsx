import { useState } from "react";
import { Play, Pause, ChevronsUp, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  title: string;
  duration: string;
  currentTime: string;
  progress: number;
}

export default function VideoPlayer({ title, duration, currentTime, progress }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative bg-black rounded-b-xl">
      <img 
        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&h=600&fit=crop" 
        alt={`${title} video thumbnail`}
        className="w-full h-96 object-cover rounded-b-xl"
      />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          size="lg"
          className="w-16 h-16 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="text-edu-blue ml-0" size={24} />
          ) : (
            <Play className="text-edu-blue ml-1" size={24} />
          )}
        </Button>
      </div>
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center space-x-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-edu-blue"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-sm">{currentTime}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div 
                className="bg-edu-blue h-1 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">{duration}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-white hover:text-edu-blue">
            <ChevronsUp size={16} />
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white hover:text-edu-blue">
            <Maximize size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
