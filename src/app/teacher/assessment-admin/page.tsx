'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Editor from 'react-simple-wysiwyg';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from '@/types';

const TEMPLATE_ID = 'main_template';

export default function AssessmentAdminPage() {
  const { user, loading: authLoading } = useAuth();

  const [section1Questions, setSection1Questions] = useState<Question[]>([]);
  const [section2FixedQuestions, setSection2FixedQuestions] = useState<Question[]>([]);
  const [goalQuestions, setGoalQuestions] = useState<Question[]>([]);
  const [goalSettingQuestions, setGoalSettingQuestions] = useState<Question[]>([]);
  const [goalSettingInstructions, setGoalSettingInstructions] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const templateRef = doc(db, 'personalityAssessmentTemplates', TEMPLATE_ID);
      getDoc(templateRef)
        .then(docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSection1Questions(data.section1Questions || []);
            setGoalQuestions(data.goalQuestions || []);
            setSection2FixedQuestions(data.section2FixedQuestions || []);
            setGoalSettingQuestions(data.goalSettingQuestions || []);
            setGoalSettingInstructions(data.goalSettingInstructions || 'Define up to 8 personal or professional goals.');
          } else {
             setError('No template found. Saving will create a new one.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load assessment template.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      console.error("Error: You must be logged in to save.");
      return;
    }

    setIsSaving(true);
    try {
      const templateRef = doc(db, 'personalityAssessmentTemplates', TEMPLATE_ID);

      const a = (q: Question) => ({...q, isInstruction: q.isInstruction || false});

      await setDoc(
        templateRef,
        {
          teacherId: user.uid, // Set ownership
          section1Questions: section1Questions.map(a),
          goalQuestions: goalQuestions.map(a),
          section2FixedQuestions: section2FixedQuestions.map(a),
          goalSettingQuestions: goalSettingQuestions.map(a),
          goalSettingInstructions,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log("Success! The assessment template has been saved.");
    } catch (err) {
      console.error("Failed to save the template. Check permissions.", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuestionChange = (
    section: 's1' | 's2' | 'goal' | 'goalSetting',
    id: string,
    field: 'title' | 'helpText' | 'isInstruction' | 'minLength' | 'maxLength',
    value: string | boolean | 'indeterminate'
  ) => {
    const updater = (setter: React.Dispatch<React.SetStateAction<Question[]>>) => {
      setter(prev =>
        prev.map(q => {
          if (q.id === id) {
            const newQ = { ...q };
            if (field === 'isInstruction') {
              newQ.isInstruction = value === true;
            } else if (typeof value === 'string') {
              (newQ[field] as any) = value;
            }
            return newQ;
          }
          return q;
        })
      );
    };
    if (section === 's1') updater(setSection1Questions);
    else if (section === 's2') updater(setSection2FixedQuestions);
    else if (section === 'goal') updater(setGoalQuestions);
    else if (section === 'goalSetting') updater(setGoalSettingQuestions);
  };

  const addQuestion = (section: 's1' | 's2' | 'goal' | 'goalSetting') => {
    const updater = (setter: React.Dispatch<React.SetStateAction<Question[]>>) => {
      setter(prev => {
        const newQuestion: Question = {
          id: `new_${Date.now()}`,
          title: '',
          helpText: '',
          isInstruction: false,
          position: prev.length,
        };
        return [...prev, newQuestion];
      });
    };
    if (section === 's1') updater(setSection1Questions);
    else if (section === 's2') updater(setSection2FixedQuestions);
    else if (section === 'goal') updater(setGoalQuestions);
    else if (section === 'goalSetting') updater(setGoalSettingQuestions);
  };

  const moveQuestion = (
    section: 's1' | 's2' | 'goal' | 'goalSetting',
    index: number,
    direction: 'up' | 'down'
  ) => {
    const updater = (setter: React.Dispatch<React.SetStateAction<Question[]>>) => {
      setter(prev => {
        const sorted = [...prev].sort((a, b) => a.position - b.position);
        const questionToMove = sorted[index];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= sorted.length) {
          return prev;
        }

        const questionToSwapWith = sorted[swapIndex];

        return prev.map(q => {
          if (q.id === questionToMove.id) {
            return { ...q, position: questionToSwapWith.position };
          }
          if (q.id === questionToSwapWith.id) {
            return { ...q, position: questionToMove.position };
          }
          return q;
        });
      });
    };
    if (section === 's1') updater(setSection1Questions);
    else if (section === 's2') updater(setSection2FixedQuestions);
    else if (section === 'goal') updater(setGoalQuestions);
    else if (section === 'goalSetting') updater(setGoalSettingQuestions);
  };

  const deleteQuestion = (section: 's1' | 's2' | 'goal' | 'goalSetting', id: string) => {
     const updater = (setter: React.Dispatch<React.SetStateAction<Question[]>>) => {
        setter(prev => prev.filter(q => q.id !== id));
    }
    if (section === 's1') updater(setSection1Questions);
    else if (section === 's2') updater(setSection2FixedQuestions);
    else if (section === 'goal') updater(setGoalQuestions);
    else if (section === 'goalSetting') updater(setGoalSettingQuestions);
  }

  if (authLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="xl" label="Loading Template..."/></div>;
  }

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Personality Assessment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here you can define the questions for the personality assessment. Changes will apply to new assessments.
          </p>
           {error && <p className="text-yellow-600 mt-4">{error}</p>}
        </CardContent>
      </Card>

      {/* Goal Setting Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Goal Setting Instructions</CardTitle>
          <p className="text-sm text-muted-foreground">This text will be shown to the user when they are defining their goals.</p>
        </CardHeader>
        <CardContent>
          <Editor
            value={goalSettingInstructions}
            onChange={(e) => setGoalSettingInstructions(e.target.value)}
            />
        </CardContent>
      </Card>

      {/* Section 1 Questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Section 1: Fixed Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {section1Questions.sort((a, b) => a.position - b.position).map((q, index) => (
            <div key={q.id} className="mb-4 p-4 border rounded-lg relative flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('s1', index, 'up')} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('s1', index, 'down')} disabled={index === section1Questions.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Question Title"
                  value={q.title}
                  onChange={(e) => handleQuestionChange('s1', q.id, 'title', e.target.value)}
                  className="mb-2 font-bold w-full"
                />
              </div>
              <Editor
                value={q.helpText || ''}
                onChange={(e) => handleQuestionChange('s1', q.id, 'helpText', e.target.value)}
              >
              </Editor>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`isInstruction-s1-${q.id}`}
                  checked={q.isInstruction}
                  onCheckedChange={(checked) => handleQuestionChange('s1', q.id, 'isInstruction', checked)}
                />
                <label
                  htmlFor={`isInstruction-s1-${q.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is an instruction (no answer required)
                </label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="number"
                  placeholder="Min Chars"
                  value={q.minLength || ''}
                  onChange={(e) => handleQuestionChange('s1', q.id, 'minLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
                <Input
                  type="number"
                  placeholder="Max Chars"
                  value={q.maxLength || ''}
                  onChange={(e) => handleQuestionChange('s1', q.id, 'maxLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => deleteQuestion('s1', q.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => addQuestion('s1')}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>
        </CardContent>
      </Card>

      {/* Goal Setting Preamble Questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Goal Setting Questions</CardTitle>
          <p className="text-sm text-muted-foreground">These questions will be asked once before the user defines their goals.</p>
        </CardHeader>
        <CardContent>
          {goalSettingQuestions.sort((a, b) => a.position - b.position).map((q, index) => (
            <div key={q.id} className="mb-4 p-4 border rounded-lg relative flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('goalSetting', index, 'up')} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('goalSetting', index, 'down')} disabled={index === goalSettingQuestions.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Question Title"
                  value={q.title}
                  onChange={(e) => handleQuestionChange('goalSetting', q.id, 'title', e.target.value)}
                  className="mb-2 font-bold w-full"
                />
              </div>
              <Editor
                value={q.helpText || ''}
                onChange={(e) => handleQuestionChange('goalSetting', q.id, 'helpText', e.target.value)}
              >
              </Editor>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`isInstruction-goalSetting-${q.id}`}
                  checked={q.isInstruction}
                  onCheckedChange={(checked) => handleQuestionChange('goalSetting', q.id, 'isInstruction', checked)}
                />
                <label
                  htmlFor={`isInstruction-goalSetting-${q.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is an instruction (no answer required)
                </label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="number"
                  placeholder="Min Chars"
                  value={q.minLength || ''}
                  onChange={(e) => handleQuestionChange('goalSetting', q.id, 'minLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
                <Input
                  type="number"
                  placeholder="Max Chars"
                  value={q.maxLength || ''}
                  onChange={(e) => handleQuestionChange('goalSetting', q.id, 'maxLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => deleteQuestion('goalSetting', q.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => addQuestion('goalSetting')}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>
        </CardContent>
      </Card>

      {/* Section 2 Goal Questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recurring Goal Questions</CardTitle>
          <p className="text-sm text-muted-foreground">These questions will be repeated for every goal the user sets.</p>
        </CardHeader>
        <CardContent>
          {goalQuestions.sort((a, b) => a.position - b.position).map((q, index) => (
            <div key={q.id} className="mb-4 p-4 border rounded-lg relative flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('goal', index, 'up')} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('goal', index, 'down')} disabled={index === goalQuestions.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Question Title"
                  value={q.title}
                  onChange={(e) => handleQuestionChange('goal', q.id, 'title', e.target.value)}
                  className="mb-2 font-bold w-full"
                />
              </div>
              <Editor
                value={q.helpText || ''}
                onChange={(e) => handleQuestionChange('goal', q.id, 'helpText', e.target.value)}
              >
              </Editor>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`isInstruction-goal-${q.id}`}
                  checked={q.isInstruction}
                  onCheckedChange={(checked) => handleQuestionChange('goal', q.id, 'isInstruction', checked)}
                />
                <label
                  htmlFor={`isInstruction-goal-${q.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is an instruction (no answer required)
                </label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="number"
                  placeholder="Min Chars"
                  value={q.minLength || ''}
                  onChange={(e) => handleQuestionChange('goal', q.id, 'minLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
                <Input
                  type="number"
                  placeholder="Max Chars"
                  value={q.maxLength || ''}
                  onChange={(e) => handleQuestionChange('goal', q.id, 'maxLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => deleteQuestion('goal', q.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => addQuestion('goal')}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>
        </CardContent>
      </Card>

      {/* Section 2 Fixed Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2: Additional Fixed Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {section2FixedQuestions.sort((a, b) => a.position - b.position).map((q, index) => (
            <div key={q.id} className="mb-4 p-4 border rounded-lg relative flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('s2', index, 'up')} disabled={index === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => moveQuestion('s2', index, 'down')} disabled={index === section2FixedQuestions.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Question Title"
                  value={q.title}
                  onChange={(e) => handleQuestionChange('s2', q.id, 'title', e.target.value)}
                  className="mb-2 font-bold w-full"
                />
              </div>
              <Editor
                value={q.helpText || ''}
                onChange={(e) => handleQuestionChange('s2', q.id, 'helpText', e.target.value)}
              >
              </Editor>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`isInstruction-s2-${q.id}`}
                  checked={q.isInstruction}
                  onCheckedChange={(checked) => handleQuestionChange('s2', q.id, 'isInstruction', checked)}
                />
                <label
                  htmlFor={`isInstruction-s2-${q.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is an instruction (no answer required)
                </label>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  type="number"
                  placeholder="Min Chars"
                  value={q.minLength || ''}
                  onChange={(e) => handleQuestionChange('s2', q.id, 'minLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
                <Input
                  type="number"
                  placeholder="Max Chars"
                  value={q.maxLength || ''}
                  onChange={(e) => handleQuestionChange('s2', q.id, 'maxLength', e.target.value)}
                  className="w-24"
                  disabled={q.isInstruction}
                />
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => deleteQuestion('s2', q.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => addQuestion('s2')}><Plus className="mr-2 h-4 w-4" /> Add Question</Button>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? <LoadingSpinner /> : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
