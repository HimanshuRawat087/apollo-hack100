import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Import necessary date-fns functions and types
import { addDays, format as formatDate } from 'date-fns';
import type { SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail'; // Assuming this type is appropriate

// Input task type for the utility function might only need a subset of SavedProjectTask,
// specifically duration and any other fields that should be passed through.
// For now, let's assume tasks passed in are at least { duration: number, ...otherData }
// and the output will be full SavedProjectTask with calculated dates.
interface InputTask {
  taskId: number; // Or string, depending on original structure
  taskName: string;
  duration: number | string; // Accept string as well, parse within function
  // Include other fields that should be preserved
  [key: string]: any;
}

export interface CalculatedTask extends SavedProjectTask {
  // Inherits taskId, taskName, startDate, endDate, duration from SavedProjectTask
  [key: string]: any; // Allow other properties to be present
}

/**
 * Calculates start and end dates for a list of tasks based on a project start date.
 * @param tasks The list of tasks. Each task must have a `duration`.
 * @param projectStartDateString The project's start date in 'yyyy-MM-dd' format.
 * @returns A new array of tasks with calculated `startDate` and `endDate`.
 */
export function calculateTaskDates(
  tasks: InputTask[],
  projectStartDateString: string
): CalculatedTask[] {
  if (!tasks || tasks.length === 0) {
    return [];
  }

  const newTasks: CalculatedTask[] = [];
  // Ensure projectStartDateString is valid and parse it, handling potential timezone issues by setting time to noon.
  // Using 'T12:00:00' helps avoid issues with date changes due to DST when only the date is relevant.
  let currentTaskStartDate = new Date(projectStartDateString + 'T12:00:00');

  if (isNaN(currentTaskStartDate.getTime())) {
    // Invalid start date string
    console.error("Invalid project start date provided to calculateTaskDates:", projectStartDateString);
    // Fallback: use current date, or could throw error
    currentTaskStartDate = new Date(); 
    currentTaskStartDate.setHours(12,0,0,0); // Normalize time
  }


  tasks.forEach(task => {
    let taskDurationDays: number;

    if (typeof task.duration === 'number') {
      taskDurationDays = task.duration;
    } else if (typeof task.duration === 'string') {
      // Basic parsing for "X days" string, can be expanded
      const match = task.duration.match(/(\d+)/);
      taskDurationDays = match ? parseInt(match[1], 10) : 1;
    } else {
      taskDurationDays = 1; // Default if duration is missing or invalid type
    }
    
    // Ensure duration is at least 1 day
    taskDurationDays = Math.max(1, Math.floor(taskDurationDays));

    const taskStartDateStr = formatDate(currentTaskStartDate, 'yyyy-MM-dd');
    const taskEndDate = addDays(currentTaskStartDate, taskDurationDays - 1); // -1 because duration includes start day
    const taskEndDateStr = formatDate(taskEndDate, 'yyyy-MM-dd');

    newTasks.push({
      // Spread original task properties first to preserve them
      ...task, 
      // Then override/add the calculated and processed ones
      // Ensure taskId and taskName are present, default if not (though they should be)
      taskId: task.taskId || 0, 
      taskName: task.taskName || 'Unnamed Task',
      startDate: taskStartDateStr,
      endDate: taskEndDateStr,
      duration: taskDurationDays, // Use the processed numerical duration
    });

    // Next task starts the day after the current one ends
    currentTaskStartDate = addDays(taskEndDate, 1);
  });

  return newTasks;
}

import ExcelJS from 'exceljs';

export async function generateExcel(projectTitle: string, tasks: SavedProjectTask[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Project Plan');

  // Define columns with headers and widths
  worksheet.columns = [
    { header: 'Task Name', key: 'taskName', width: 40 },
    { header: 'Task ID', key: 'taskId', width: 10 },
    { header: 'Duration (Days)', key: 'duration', width: 15 },
    { header: 'Start Date', key: 'startDate', width: 15 },
    { header: 'End Date', key: 'endDate', width: 15 },
    { header: 'Task Hints', key: 'hints', width: 120 }
  ];

  // Add rows with data
  tasks.forEach(task => {
    worksheet.addRow({
      taskName: task.taskName,
      taskId: task.taskId,
      duration: task.duration,
      startDate: task.startDate,
      endDate: task.endDate,
      hints: task.hints ? task.hints.map((hint, index) => `${index + 1}. ${hint}`).join('\n\n') : ''
    });
  });

  // Apply styling
  worksheet.eachRow((row, rowNumber) => {
    // Set row height based on whether it's the header or a data row
    if (rowNumber === 1) {
      row.height = 30; // Smaller height for the header row
    } else {
      row.height = 200; // Keep current height for data rows
    }

    row.eachCell((cell, colNumber) => {
      // Apply borders to all cells
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };

      // Header row styling
      if (rowNumber === 1) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        // Make bottom border of header row slightly thicker
        cell.border.bottom = { style: 'medium', color: { argb: 'FF000000' } };
      } else { // Data rows
        // Alternating row colors
        const rowColor = (rowNumber % 2 === 0) ? 'FFE6F0FA' : 'FFD9E6F5';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowColor } };

        // Default vertical alignment for data rows
        cell.alignment = { vertical: 'middle' };

        // Center alignment for specific columns (Task ID, Duration, Start Date, End Date)
        if (colNumber >= 2 && colNumber <= 5) { 
          cell.alignment = { ...cell.alignment, horizontal: 'center' };
        }

        // Apply wrapText and top vertical alignment to the Task Hints column (column 6 in 1-based indexing)
        if (colNumber === 6) {
          cell.alignment = { ...cell.alignment, wrapText: true, vertical: 'top' };
        }

        // Style for Task Name column (column 1) in data rows
        if (colNumber === 1) {
          cell.font = { bold: true, size: 14 };
          cell.alignment = { ...cell.alignment, horizontal: 'center', wrapText: true };
          // Add a subtle background color to Task Name column in data rows
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } }; // Very light blue
        }
      }
    });
  });

  // Freeze the header row (row 1)
  worksheet.views = [
    {
      state: 'frozen',
      xSplit: 0,
      ySplit: 1, // Freeze rows above this line (i.e., row 1)
      topLeftCell: 'A2',
      activeCell: 'A1',
      pane: 'topRight'
    }
  ];

  // Generate and write the Excel file
  const fileName = `${projectTitle.replace(/[^a-zA-Z0-9_ -]/g, '')}_Project_Plan.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
