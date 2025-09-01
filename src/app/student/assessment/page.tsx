'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Download, RefreshCw, Trash2, LayoutDashboard } from 'lucide-react';
import { AssessmentReport } from '@/components/student/AssessmentReport';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MAX_GOALS = 8;
const TEMPLATE_ID = 'main_template';

export default function StudentAssessmentPage() {
  const { user, loading: authLoading } = useAuth();

  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [view, setView] = useState<'assessment' | 'report'>('assessment');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDeleteGoal = (index: number) => {
    const goalId = `goal_${index + 1}`;
    const hasAnswers = Object.keys(answers).some(key => key.startsWith(goalId));

    let confirmed = true;
    if (hasAnswers) {
      confirmed = window.confirm("Are you sure? Deleting this goal will also delete all of its answers.");
    }

    if (confirmed) {
      // Remove the goal
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);

      // Remove associated answers
      const newAnswers = { ...answers };
      Object.keys(newAnswers).forEach(key => {
        if (key.startsWith(goalId)) {
          delete newAnswers[key];
        }
      });
      setAnswers(newAnswers);
    }
  };

  // --- Data Fetching and Snapshotting Logic ---
  useEffect(() => {
    if (user) {
      const userAssessmentRef = doc(db, 'userAssessments', user.uid);
      getDoc(userAssessmentRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAssessmentData(data);
          setAnswers(data.answers || {});
          setGoals(data.goals && data.goals.length > 0 ? data.goals : ['']);
          setIsLoading(false);
        } else {
          const templateRef = doc(db, 'personalityAssessmentTemplates', TEMPLATE_ID);
          getDoc(templateRef).then(templateSnap => {
            if (templateSnap.exists()) {
              const templateData = templateSnap.data();
              const newAssessment = {
                userId: user.uid,
                templateVersion: templateSnap.data()?.updatedAt || serverTimestamp(),
                status: 'in-progress',
                startedAt: serverTimestamp(),
                answers: {},
                goals: [''],
                section1Questions: templateData.section1Questions || [],
                goalQuestions: templateData.goalQuestions || [],
                goalSettingQuestions: templateData.goalSettingQuestions || [],
                goalSettingInstructions: templateData.goalSettingInstructions || `Define up to ${MAX_GOALS} personal or professional goals.`,
                section2FixedQuestions: templateData.section2FixedQuestions || [],
              };
              setDoc(userAssessmentRef, newAssessment).then(() => {
                setAssessmentData(newAssessment);
                setAnswers(newAssessment.answers);
                setGoals(newAssessment.goals);
                setIsLoading(false);
              });
            } else {
              console.error("Could not find assessment template.");
              setIsLoading(false);
            }
          });
        }
      }).catch(err => {
        console.error("Could not load your assessment.", err);
        setIsLoading(false);
      });
    }
  }, [user]);

  // --- Auto-saving Logic ---
  useEffect(() => {
    if (isLoading || !assessmentData) return;
    const interval = setInterval(() => {
      setIsSaving(true);
      const userAssessmentRef = doc(db, 'userAssessments', user.uid);
      updateDoc(userAssessmentRef, {
        answers,
        goals,
        lastSaved: serverTimestamp()
      }).then(() => {
        console.log("Progress auto-saved.");
        setIsSaving(false);
      }).catch(err => {
        console.error("Auto-save failed:", err);
        setIsSaving(false);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [answers, goals, user, isLoading, assessmentData]);

  // --- Flattened Steps Logic ---
  const { steps, sectionPills } = useMemo(() => {
    if (!assessmentData) return { steps: [], sectionPills: [] };

    const flatSteps: any[] = [];
    const pillData: any[] = [];

    // Section 1
    if (assessmentData.section1Questions?.length > 0) {
        pillData.push({ title: 'Section 1', stepIndex: flatSteps.length });
        assessmentData.section1Questions.forEach((q: any) => {
            flatSteps.push({ type: 'question', question: q, sectionTitle: 'Section 1' });
        });
    }

    // Goal Setting Questions
    if (assessmentData.goalSettingQuestions?.length > 0) {
        pillData.push({ title: 'Goal Questions', stepIndex: flatSteps.length });
        assessmentData.goalSettingQuestions.forEach((q: any) => {
            flatSteps.push({ type: 'question', question: q, sectionTitle: 'Goal Questions' });
        });
    }

    // Goal Setting
    pillData.push({ title: 'Goal Setting', stepIndex: flatSteps.length });
    flatSteps.push({ type: 'goal_setting', sectionTitle: 'Goal Setting' });

    // Goal Sections
    const definedGoals = goals.filter(g => g.trim() !== '');
    definedGoals.forEach((goal, index) => {
        const goalTitle = `Goal ${index + 1}`;
        pillData.push({ title: goalTitle, stepIndex: flatSteps.length });
        assessmentData.goalQuestions.forEach((q: any) => {
            flatSteps.push({ type: 'question', question: q, sectionTitle: goalTitle, goal, isGoalQuestion: true, parentId: `goal_${index + 1}` });
        });
    });

    // Section 2 Fixed
    if (assessmentData.section2FixedQuestions?.length > 0) {
        pillData.push({ title: 'Section 2', stepIndex: flatSteps.length });
        assessmentData.section2FixedQuestions.forEach((q: any) => {
            flatSteps.push({ type: 'question', question: q, sectionTitle: 'Section 2' });
        });
    }

    return { steps: flatSteps, sectionPills: pillData };
  }, [assessmentData, goals]);

  const currentStep = steps[currentStepIndex];

  const isNextDisabled = useMemo(() => {
    if (!currentStep || currentStep.type !== 'question' || currentStep.question.isInstruction) {
      return false;
    }
    const questionId = currentStep.isGoalQuestion ? `${currentStep.parentId}_${currentStep.question.id}` : currentStep.question.id;
    const answer = answers[questionId] || '';
    const { minLength, maxLength } = currentStep.question;

    if (minLength && answer.length < minLength) return true;
    if (maxLength && answer.length > maxLength) return true;

    return false;
  }, [currentStep, answers]);


  if (authLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="xl" label="Loading Your Assessment..." /></div>;
  }
  if (!user) {
    return <p className="text-center mt-10">You must be logged in to take the assessment.</p>;
  }
  if (!assessmentData) {
     return <p className="text-center mt-10">Could not load assessment data. Please try again later.</p>;
  }

  const progressPercentage = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  const saveProgress = () => {
      if (isLoading || !assessmentData) return;
      const userAssessmentRef = doc(db, 'userAssessments', user.uid);
      updateDoc(userAssessmentRef, {
        answers,
        goals,
        lastSaved: serverTimestamp()
      }).then(() => {
        console.log("Progress saved on navigation.");
      }).catch(err => {
        console.error("Save on navigation failed:", err);
      });
  }

  const handleNext = () => {
    saveProgress();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    saveProgress();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleGoToSection = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
  }

  const addGoal = () => {
    if (goals.length < MAX_GOALS) {
        setGoals([...goals, '']);
    }
  };

  const handleFinish = () => {
    const userAssessmentRef = doc(db, 'userAssessments', user.uid);
    updateDoc(userAssessmentRef, { status: 'completed', completedAt: serverTimestamp() });
    setView('report');
  }

  const generatePdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('assessment-report.pdf');
    setIsGeneratingPdf(false);
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'goal_setting':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">{currentStep.sectionTitle}</h2>
            <div className="mb-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: assessmentData.goalSettingInstructions || `Define up to ${MAX_GOALS} personal or professional goals.` }} />
            <div className="space-y-4">
              {goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                        value={goal}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        placeholder={`Goal ${index + 1}`}
                        className="text-lg"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(index)} disabled={goals.length <= 1 && !goals[0]}>
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
              ))}
            </div>
            {goals.length < MAX_GOALS && (
               <Button onClick={addGoal} variant="link" className="mt-2">Add another goal</Button>
            )}
          </div>
        );

      case 'question':
        const questionId = currentStep.isGoalQuestion ? `${currentStep.parentId}_${currentStep.question.id}` : currentStep.question.id;
        if (currentStep.question.isInstruction) {
          return (
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentStep.sectionTitle}</h2>
              {currentStep.isGoalQuestion && (
                  <p className="mb-4 p-2 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
                      Regarding your goal: <span className="font-bold">{currentStep.goal}</span>
                  </p>
              )}
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="block text-lg font-semibold mb-2">{currentStep.question.title}</h3>
                  <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: currentStep.question.helpText }} />
              </div>
            </div>
          );
        }
        return (
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentStep.sectionTitle}</h2>
            {currentStep.isGoalQuestion && (
                <p className="mb-4 p-2 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
                    Regarding your goal: <span className="font-bold">{currentStep.goal}</span>
                </p>
            )}
            <div className="mt-6">
                <label className="block text-lg font-semibold mb-2">{currentStep.question.title}</label>
                <div className="text-sm text-muted-foreground mb-3" dangerouslySetInnerHTML={{ __html: currentStep.question.helpText }} />
                <Textarea
                  rows={8}
                  placeholder="Your answer..."
                  className="text-base"
                  value={answers[questionId] || ''}
                  onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                  minLength={currentStep.question.minLength}
                  maxLength={currentStep.question.maxLength}
                  showCount={true}
                />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (view === 'report') {
    const goalReportSections = goals.filter(g => g.trim() !== '').map((goal, index) => {
        const parentId = `goal_${index + 1}`;
        return {
            id: parentId,
            title: `Goal ${index + 1}`,
            goal: goal,
            questions: assessmentData.goalQuestions.map((q:any) => ({...q, answer: answers[`${parentId}_${q.id}`] || ''}))
        }
    });

    const reportData = {
        section1: {
            title: "Section 1",
            questions: assessmentData.section1Questions.map((q:any) => ({...q, answer: answers[q.id] || ''}))
        },
        goalSetting: {
            title: "Goal Questions",
            questions: assessmentData.goalSettingQuestions.map((q:any) => ({...q, answer: answers[q.id] || ''}))
        },
        goalSections: goalReportSections,
        section2Fixed: {
            title: "Section 2",
            questions: assessmentData.section2FixedQuestions.map((q:any) => ({...q, answer: answers[q.id] || ''}))
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl">Your Assessment Report</CardTitle>
                        <CardDescription>This is a summary of your responses. You can download it as a PDF.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" onClick={() => setView('assessment')}>
                            <RefreshCw className="mr-2 h-4 w-4"/> Back to Assessment
                        </Button>
                        <Button onClick={generatePdf} disabled={isGeneratingPdf}>
                            {isGeneratingPdf ? <LoadingSpinner /> : <><Download className="mr-2 h-4 w-4"/> Download PDF</>}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px' }}>
                        <div ref={reportRef}>
                            <AssessmentReport reportData={reportData} />
                        </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                         <AssessmentReport reportData={reportData} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">Personality & Goals Assessment</CardTitle>
              <CardDescription>
                {isSaving ? 'Saving...' : 'Complete all sections to generate your report.'}
              </CardDescription>
            </div>
            <Link href="/student/dashboard">
              <Button variant="outline">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4">
            <style>{`
              .custom-progress-bar > div {
                background-color: #468966 !important;
              }
            `}</style>
            <div className="flex items-center gap-4 mb-2">
              <Progress value={progressPercentage} className="w-full custom-progress-bar"/>
              <span className="font-bold text-lg text-[#468966]">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sectionPills.map((pill) => (
                <Button
                  key={pill.title}
                  variant={currentStep.sectionTitle === pill.title ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleGoToSection(pill.stepIndex)}
                  className="text-xs sm:text-sm"
                >
                  {pill.title}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[300px]">
          {renderStepContent()}
        </CardContent>

        <div className="p-6 bg-muted/50 flex justify-between items-center rounded-b-lg">
            <Button variant="outline" onClick={handlePrev} disabled={currentStepIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4"/> Previous
            </Button>
            <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
            </p>
            {currentStepIndex === steps.length - 1 ? (
                <Button variant="success" onClick={handleFinish}>
                    <Check className="mr-2 h-4 w-4"/> Finish & View Report
                </Button>
            ) : (
                <Button onClick={handleNext} disabled={isNextDisabled}>
                    Next <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            )}
        </div>
      </Card>
    </div>
  );
}
