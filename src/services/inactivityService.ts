import { collection, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectReport } from "@/types";

/**
 * Defines the criteria for detecting student inactivity for a given project.
 * Inactivity is currently defined as the absence of any new project reports
 * within a specified weekly period from the last activity or project assignment date.
 * 
 * @param projectId The ID of the project to check for inactivity.
 * @param studentUid The UID of the student associated with the project.
 * @param lastActivityDate The last known activity date for the student on this project (e.g., project assignment date or last report submission date).
 * @returns A boolean indicating if the student is inactive, and a reason string.
 */
export async function checkStudentInactivity(
  projectId: string,
  studentUid: string,
  lastActivityDate: Date
): Promise<{ isInactive: boolean; reason: string }> {
  const sevenDaysAgo = new Date(lastActivityDate.getTime() - (7 * 24 * 60 * 60 * 1000));

  try {
    const reportsRef = collection(db, "projectReports");
    const q = query(
      reportsRef,
      where("projectId", "==", projectId),
      where("studentUid", "==", studentUid),
      where("submittedAt", ">=", Timestamp.fromDate(sevenDaysAgo)), // Check for reports in the last 7 days
      orderBy("submittedAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { isInactive: true, reason: "No project reports or activity detected in the last week." };
    } else {
      return { isInactive: false, reason: "Active." };
    }
  } catch (error) {
    console.error("Error checking student inactivity:", error);
    return { isInactive: false, reason: "Error checking activity." }; // Default to not inactive on error
  }
} 