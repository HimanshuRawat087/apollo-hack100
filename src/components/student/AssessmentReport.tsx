import React from 'react';

// This is a simplified version of the data structure from the assessment page
// In a real implementation, you would define these types in a shared `types` file.
interface Question {
  id: string;
  title: string;
  answer: string;
}

interface GoalSection {
  id: string;
  title: string;
  goal: string;
  questions: Question[];
}

interface ReportData {
  section1: {
    title: string;
    questions: Question[];
  };
  goalSetting: {
    title: string;
    questions: Question[];
  };
  goalSections: GoalSection[];
  section2Fixed: {
    title: string;
    questions: Question[];
  };
}

interface AssessmentReportProps {
  reportData: ReportData;
}

// This component is designed to be rendered to an invisible div
// and then captured by html2canvas. The styles are simple and print-friendly.
export const AssessmentReport: React.FC<AssessmentReportProps> = ({ reportData }) => {
  return (
    <div className="p-8 bg-white font-sans text-gray-800">
      <header className="text-center mb-10 border-b-2 pb-4 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900">Personality & Goals Assessment</h1>
        <p className="text-lg text-gray-600 mt-2">Your Personal Report</p>
      </header>

      <main>
        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{reportData.section1.title}</h2>
          {reportData.section1.questions.map(q => (
            <div key={q.id} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700">{q.title}</h3>
              <p className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">{q.answer || 'No answer provided.'}</p>
            </div>
          ))}
        </section>

        {/* Goal Setting Questions */}
        {reportData.goalSetting && reportData.goalSetting.questions.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{reportData.goalSetting.title}</h2>
            {reportData.goalSetting.questions.map(q => (
              <div key={q.id} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">{q.title}</h3>
                <p className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">{q.answer || 'No answer provided.'}</p>
              </div>
            ))}
          </section>
        )}

        {/* Goal Sections */}
        {reportData.goalSections.length > 0 && (
          <section className="mb-10">
             <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Goals</h2>
             {reportData.goalSections.map(goalSection => (
                <div key={goalSection.id} className="mb-8 p-6 bg-blue-50/50 rounded-lg border border-blue-100">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">Goal: {goalSection.goal}</h3>
                    {goalSection.questions.map(q => (
                        <div key={q.id} className="mb-4">
                            <h4 className="text-md font-semibold text-gray-700">{q.title}</h4>
                            <p className="mt-1 p-3 bg-white rounded-md border border-gray-200 whitespace-pre-wrap">{q.answer || 'No answer provided.'}</p>
                        </div>
                    ))}
                </div>
             ))}
          </section>
        )}

        {/* Section 2 Fixed */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{reportData.section2Fixed.title}</h2>
          {reportData.section2Fixed.questions.map(q => (
            <div key={q.id} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700">{q.title}</h3>
              <p className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">{q.answer || 'No answer provided.'}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="text-center mt-12 pt-4 border-t text-sm text-gray-500">
        <p>Report generated on {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
};
