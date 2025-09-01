import { Timestamp } from "firebase/firestore";

export interface AIReviewInput {
  studentProjectStatus: 'on-track' | 'off-track' | undefined;
  textStatus: string | undefined;
}

export interface AIReviewResult {
  rating: number; // 0-10
  note: string;
  timestamp: Timestamp; // When the AI review was generated
  sourceTextStatus?: string; // Text status used to generate this AI review
  sourceStudentProjectStatus?: 'on-track' | 'off-track' | undefined; // Student project status used to generate this AI review
}

/**
 * Generates an AI-based rating and a short note for a student's project submission.
 * This is a placeholder for actual AI model integration, using simplified inputs.
 * @param input AIReviewInput containing metrics derived from the student's latest report.
 * @returns AIReviewResult containing the calculated rating and a descriptive note.
 */
export function generateAIReview(input: AIReviewInput): AIReviewResult {
  const { studentProjectStatus, textStatus } = input;

  let rating: number;
  let note: string;

  // Base rating and note based on studentProjectStatus
  switch (studentProjectStatus) {
    case 'on-track':
      rating = 8; // Good base for on-track
      note = "The student indicates being on track and progressing well.";
      break;
    case 'off-track':
      rating = 3; // Lower base for off-track
      note = "The student reports being off track, indicating potential issues.";
      break;
    default:
      rating = 0; // Set to 0 for no report/undefined status
      note = "AI Note: No recent report details available, no activity detected.";
  }

  // Refine rating and note based on textStatus sentiment
  if (textStatus && textStatus.trim() !== '') {
    const lowerCaseText = textStatus.toLowerCase();
    let sentimentScore = 0; // -1 for negative, 0 for neutral, +1 for positive
    const sentimentDetails: string[] = [];

    // Positive keywords
    const positiveKeywords = ["completed", "finished", "successful", "progress", "ahead", "good", "achieved", "done"];
    positiveKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword)) {
        sentimentScore += 1;
        sentimentDetails.push(`mentioned '${keyword}'`);
      }
    });

    // Negative keywords
    const negativeKeywords = ["struggling", "challenge", "blocked", "issue", "difficult", "behind", "problem", "stuck"];
    negativeKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword)) {
        sentimentScore -= 1;
        sentimentDetails.push(`mentioned '${keyword}'`);
      }
    });

    // Adjust rating based on sentiment
    if (sentimentScore > 0) {
      rating = Math.min(10, rating + sentimentScore * 1.5); // Boost rating for positive sentiment
      if (studentProjectStatus !== 'on-track') note += " Text indicates positive developments.";
    } else if (sentimentScore < 0) {
      rating = Math.max(0, rating + sentimentScore * 2); // Lower rating for negative sentiment, more aggressive drop
      if (studentProjectStatus !== 'off-track') note += " Text highlights potential difficulties.";
    }

    // Append detailed sentiment to note
    if (sentimentDetails.length > 0) {
      note += ` Student ${sentimentDetails.join(", ")}.`;
    }

    // Override default note for no status if text provides strong sentiment
    if (studentProjectStatus === undefined && sentimentScore !== 0) {
      if (sentimentScore > 0) {
        note = `Based on the report: Student ${sentimentDetails.join(", ")}. Seems to be making good progress.`;
      } else if (sentimentScore < 0) {
        note = `Based on the report: Student ${sentimentDetails.join(", ")}. Appears to be facing challenges.`;
      }
    }

    // Refine note for very high/low ratings regardless of initial status
    if (rating >= 9) {
      note = "Exceptional progress reported! " + note;
    } else if (rating <= 2) {
      note = "Significant concerns identified. " + note;
    }

  } else if (studentProjectStatus !== undefined) {
      // If textStatus is empty, but studentProjectStatus is set, refine the note slightly
      if (studentProjectStatus === 'on-track') {
          note = "The student reports being on track. No additional details provided.";
      } else if (studentProjectStatus === 'off-track') {
          note = "The student reports being off track. Further details are needed.";
      }
  }

  // Ensure rating is within 0-10 bounds
  rating = Math.min(Math.max(0, Math.round(rating)), 10); // Round to nearest integer

  return {
    rating,
    note,
    timestamp: Timestamp.now(), // Use client-side timestamp for generation time
    sourceTextStatus: textStatus,
    sourceStudentProjectStatus: studentProjectStatus,
  };
} 