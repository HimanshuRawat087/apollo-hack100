# Automation Milestone

## Milestone 1: **Send Email to candidate**

    1. HR uploads Candidate PDF and interviewer details. 
    2. Backend passes the  Candidate PDF and interviewer details to `AI parser/ LLM Service`.
    3. `AI parser/ LLM Service` will parse the details and saves the entry in database collection(interviewer, interviewee, interview).
    4. Backend with the help of `AI parser/ LLM Service`, will generate an initial email for candidate, and passes it to `Email service` (To:, From:, TemplateEmail:)
    5. `Email service` sends initial email to the candidate.
    6. Backend will update the status in Interview Colleciton(status: "awaiting_candidate")

## Milestone 2: **listen the response mail**

    1. In every 5 minuets the "Email listner Service" will check mail box of "recruiter" for the new mails.
    2. When found new mail from candidate "Email listner Service" will send it to `AI parser/ LLM Service` to extract time from it 
    3. if not found time slot:
        3.1 update interview collection(status: "awaiting_candidate").
        3.2 slot collection ( participant: "candidate", status: "needs_clarification").
        3.3 "email service" will resend mail to candidate.
    4. When found time slot 
        4.1 update interview collection(status: "awaiting_interviewer") 
        4.2 update slot collection with participant: "candidate", givenSlots: "time slot", and status: "parsed"
    5. then Backend with the help of `AI parser/ LLM Service` will generate a template email for the interviewer and passes it to "email service"
    6. "email service" then sends the email to the interviewer with candidate time slot.
    7. In every 5 minuets the "Email listner Service" will check mail box for the new mails.
    8. When found new mail from interviewer it will send it to `AI parser/ LLM Service` to extract time from it.
    9. if not found time slot:
        9.1 update interview collection(status: "awaiting_interviewer").
        9.2 slot collection (participant: "interviewer",  status: "needs_clarification").
        9.3 "email service" will resend mail to interviewer.
    10. When found time slot 
        10.1 update interview collection(status: "awaiting_scheduler")
        10.2 update slot collection with participant: "interviewer", givenSlots: "time slot", and status: "parsed"
    
## Milestone 3: **scheduler matching logic**

    1. `Scheduler service` checks for the time slots of interviewer and candidate.
    2. if no overlapping time slots found in the "givenSlots" of interviewer and candidate:
        2.1 "email_service" retries.
        2.2 update interview collection (status:"awaiting_candidate")
    3. if overlapping time slots found in the "givenSlots" of interviewer and candidates:
        3.1 `Scheduler service` will generate a meeting link fot the overlapped time slot.
        3.2 update the interview collection with meeting link , meeting time , status: "Scheduled"