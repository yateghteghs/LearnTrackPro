import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerChange: (answer: string) => void;
}

export default function QuizQuestion({ question, selectedAnswer, onAnswerChange }: QuizQuestionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.question}</h3>
      
      <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange} className="space-y-4">
        {question.options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
            <Label 
              htmlFor={option.value} 
              className="flex-1 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-edu-blue transition-colors"
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
