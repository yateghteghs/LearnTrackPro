import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import QuizQuestion from "@/components/quiz-question";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

// Mock user ID for demo
const CURRENT_USER_ID = 1;

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
  correctAnswer: string;
}

export default function Quiz() {
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(765); // 12:45 in seconds

  const { data: user } = useQuery({
    queryKey: ["/api/users", CURRENT_USER_ID],
  });

  const { data: quiz } = useQuery({
    queryKey: ["/api/quizzes", quizId],
    enabled: !!quizId,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (quizData: any) => {
      return apiRequest("POST", "/api/quiz-attempts", quizData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", CURRENT_USER_ID] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  if (!user || !quiz) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const questions: Question[] = quiz.questions || [
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
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    const passed = score >= (quiz.passingScore || 85);

    submitQuizMutation.mutate({
      userId: CURRENT_USER_ID,
      quizId: parseInt(quizId || "0"),
      score,
      answers: Object.values(answers),
      passed,
      timeTaken: (quiz.timeLimit || 15) * 60 - timeRemaining,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader user={user} />
      
      <main className="max-w-4xl mx-auto p-6">
        <Card className="shadow-lg border border-gray-200">
          {/* Quiz Header */}
          <div className="bg-gradient-to-r from-edu-blue to-blue-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{quiz.title}</h2>
                <p className="text-blue-100 text-sm">
                  Module 3 Knowledge Check - {quiz.passingScore || 85}% required to pass
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-blue-100 text-sm">Time Remaining</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Progress</span>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
              </div>
              <Progress value={progress} className="bg-blue-500" />
            </div>
          </div>
          
          <CardContent className="p-8">
            {currentQ && (
              <QuizQuestion
                question={currentQ}
                selectedAnswer={answers[currentQ.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQ.id, answer)}
              />
            )}
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline">
                  Skip Question
                </Button>
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={handleNext} className="bg-edu-blue hover:bg-blue-700">
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitQuizMutation.isPending}
                    className="bg-edu-green hover:bg-green-700"
                  >
                    {submitQuizMutation.isPending ? "Submitting..." : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
