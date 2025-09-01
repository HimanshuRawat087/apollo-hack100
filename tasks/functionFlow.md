# Scheduling Automation:

## Step 1: HR Uploads PDF (Stage 0 + 1)

No  | Action              | Function                        | Params                                      | Service             |
    |---------------------|---------------------------------|---------------------------------------------|---------------------|
1,2 | HR uploads details  | `receivePDF(file)`              | `file: PDF`And interviewer details          | Frontend -> Backend |
3   | Data to parse       | `sendToParser(file)`            | `file: PDF`And interviewer details          | Backend -> AI parser|
4   | Extract details     | `extractUserDetailsFromPDF(pdf)`| `file: PDF`And interviewer details          | AI Parser -> Backend|
5   | Store data          | `storeParsedDetails(data)`      | eg `{ name, email }`                        | Backend -> database |
    | Creates an interview| Insert in Firestore `interviews`| `{interview_id candidate_ref, interviewer_ref,}`

    
## Step 2: Generate Email to Candidate (Stage 2)

No  | Action              | Function                     | Params                                                               | Service          |
    |---------------------|------------------------------|----------------------------------------------------------------------|------------------|
6,7 | Prepare prompt      | `createTemplatePrompt(data)` | `{candidateName, candidateEmail, interview_id}`                      | Backend          |
8   | Generate content    | `generateEmail(data)`        | "" same as above                                                     | AI Parser        |
9   | Log LLM request     | Insert `llm_requests`        | `{ type: 'generate_email_request_candidate', status: 'completed' }`  | Backend->Database|
10,11| Send email         |`sendTemplateEmail(emailData)`| `{ to, subject, body }`                                              | Backend->Email Service|
    | (backend calls Email service function)

