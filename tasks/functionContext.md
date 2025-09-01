# Interview Scheduling System Architecture Documentation

---

## 🖥️ Frontend HR Portal

- Accepts PDF upload from HR.
- Sends uploaded PDF to the backend service.
- Displays scheduling statuses and errors to HR.

---

## ⚙️ Backend

- **Receives the PDF** and passes it to the AI Parser.
- Controls **workflow and orchestration** between parser, DB, email service, and scheduler.
- Handles:
  - Decision making (retries, error handling, scheduler triggers)
  - Updating the DB with statuses and link details

### Functions:

- `receivePDF(file)`: Receives the uploaded PDF and passes it to the AI Parser.
- `sendToParser(file)`: Interfaces with the AI Parser to extract candidate/interviewer data.
- `storeParsedDetails(data)`: Stores the extracted data in the database.
- `createTemplatePrompt(data)`: Prepares prompt inputs for email templates.
- `handleParsedCandidateResponse(mailContent)`: Receives parsed response from candidate (via Email Listener and AI Parser).
- `handleParsedInterviewerResponse(mailContent)`: Same as above, for interviewer.
- `triggerSlotCheckAndUpdate(data)`: Verifies slot presence and updates DB.
- `callScheduler(candidateSlots, interviewerSlots)`: Passes slots to the Scheduler for matching logic.
- `updateWithMeetingDetails(data)`: Updates the database with meeting link and status.
- `prepareFinalEmailPrompt(data)`: Prepares input to generate final meeting email.

---

## 🧠 AI Parser

> Extracts structured data (email IDs, candidate/interviewer names, job details) from the uploaded PDF.

- Parses candidate/interviewer email replies to extract available time slots.
- Handles "NO SLOT" and malformed responses.
- Triggers templating prompts for email generation.

### Functions:

- `extractDetailsFromPDF(pdf)`: Extracts structured data (candidate name, interviewer name, email, etc.).
- `extractSlotsFromEmail(emailContent)`: Parses time slot responses from candidate or interviewer emails.
- `generateEmailPrompt(data)`: Returns a prompt with necessary context for generating a template (for LLMs).
- `formatParsedResponse(data)`: Formats the extracted slot data for use downstream.

---

## 🗃️ Database

Stores:
- Parsed candidate/interviewer data
- Interview ID
- Scheduling status
- Time slot responses
- Final matched slot
- Meeting link

Tracks state transitions: `awaiting responses`, `retries`, `failed`, `success`.

### Functions:

- `saveCandidateInterviewerDetails(details)`: Stores parsed info along with interview ID.
- `updateCandidateSlotsResponse(interviewID, slots)`: Updates candidate slot responses.
- `updateInterviewerSlotResponse(interviewID, slots)`: Updates interviewer slot responses.
- `saveFinalMeetingLink(interviewID, link, time)`: Saves matched slot and generated link.
- `getInterviewDetails(interviewID)`: Retrieves info needed for slot matching and email generation.

---

## ✉️ Email Service

> Sends templated emails to candidates and interviewers requesting time slots.

- Sends meeting invitation emails with the final matched time and link.

### Functions:

- `sendTemplateEmail(emailData)`: Sends an email template to candidate/interviewer.
- `sendFinalMeetingEmail(emailData)`: Sends the final meeting email once the slot is matched and meeting is created.
- `sendReminderEmail(emailData)`: *(Optional)* Follow-ups on no responses.

---

## ⏰ Scheduler (Matching Logic + Link Generator)

> Contains logic to match overlapping time slots between candidate and interviewer.

- Triggers only after both slots are available.
- Generates meeting links (Zoom, Meet, etc.)
- Updates database with matched slot and link.
- Notifies backend to initiate email generation for both parties.

### Functions:

- `matchTimeSlots(candidateSlots, interviewerSlots)`: Checks for overlapping slots.
- `generateMeetingLink(interviewID, matchedSlot)`: Creates a meeting link (Zoom/Google Meet/etc.).
- `notifyBackendOfMatch(details)`: Sends matched data and link back to the backend.

---

## 🔁 Email Listener (/cron)

> Listens to incoming email replies from candidates and interviewers.

- Routes the email content to the AI Parser for time slot extraction.
- Works on a cron schedule to poll and check for responses.

### Functions:

- `listenForEmailResponse()`: Polls email inbox for new responses.
- `parseEmailWithParser(emailContent)`: Sends response email content to AI Parser.
- `notifyBackendOfResponse(parsedData)`: Sends structured slot response to backend for handling.
