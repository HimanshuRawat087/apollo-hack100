## Milestone 0: create basic portal for hr and get access
    1. frontend:
        1.1 upload pdf input and button,
        1.2 input for interviewer email,
        1.3 get access to : gmailservice , callender , googlemeet of the logged in user.

## Milestone 1:

    1. get interviewer and candidate email:
        1.1 `pdf parsing` using some library and regex -> {candidate email}
        1.2 {interviewer email} through input field by recruiter.
    2. create "Interview" document and persist resume.
        2.1 save resume to firebase storage.
        2.2 create and save document in "Interview" collection {interview_id:"123", candidate_email: "xyz", interviewer_email:"abc", status: "email_to_candidate", resume: "url"}
    3.  Sending email to candidate and update Interview status.
        3.1 check email send permission of recruiter mailbox.
        3.2 `emailService` -> send email to candidate, takes parameter{to:"", from:"", subject:"" , content:""}
            3.2.1 add interview id in subject: for future references.
            3.2.2 create Conversation document{conversation_id:"", message_id:"", interview_id:"", to:"", from:"", subject:"" , content:""}
        3.3 update {status: "email_to_candidate"} in `Interview` document

## Milestone 2: listen email

    4. catch incomming emails- `email_listner`
        4.1 check read permission of recruiter emailbox
        4.2 In every 5min. check for new email. (eg: using cron)
            4.2.1 is it possible to get realtime email triggers from gmail api ?
        4.3 fetch incomming message on existing conversation
            4.3.1 if realtime email trigger is not possible 
                4.3.1.1 fetch all Interview document with status!="completed".
                4.3.1.2 fetch all email from recruiter mail box based on the email id since last 10 minuets.
                4.3.1.3 when found one, saves 'email message id' as {message_id:""}, process state as "false" and 'email response' to `Conversation` collection
                {conversation_id:"", interview_id"", message_id:"", to:"", from:"", content:"", subject:"", processState:"false"} 
            4.3.2 if realtime email trigger is possible
                4.3.2.1 check for the email id(from:"") in incomming email.
                4.3.2.2 fetch the Interview document for the email id and check for the Interview {status!="completed"}
                4.3.2.3 saves 'email message id' as {message_id:""},process state as "false" and 'email response' to `Conversation` collection
                {conversation_id:"", interview_id"", message_id:"", to:"", from:"", content:"", subject:"", processState:"false"}
        4.4 deligate intelligence work to intelligence service with message id.

## Milestone 3: Process AI

    5. process the Conversation and suggest next step accordingly - `Intelligent_service`
        5.1 get the conversation document: parameter- {conversation_id:"", message_id:""} only if current process state: false.
        5.2 processes the "Conversation" document 
            5.2.1 check the email {from:""} of Conversation is interviewer or candidate from Interview collection.
            5.2.1 processes the content of Conversation document and checks for a 
                5.2.1.1 if meeting slot found save it to "slots" document. {interview id:"", role:"interviewer"|"candidate", time_stamp:""}
                system promp:   
                    1. pass context of full conversation, interviewer email, candidate email.
                    2. return format: interviewer slots, candidate slots, matching slots.
                    3. next action taker: scheduler | interviewer | candidate | human
                    4. next action metadata: email content for interviewer | email content for candidate , message for human
                cases on response:
                    1 matching meeting slot - call scheduling service(interview id, and matched slot informantion)
                    2 interviewer action needed - call email service with next action.
                    3 candidate action needed- call email service with next action.
                    4 human action needed - update the interview collection status to 'failed'
                    5 save the ai response as {response""}to "Ai request" collection {interview_id:"", nextStep:"email to candidate" | "email to interviewer" | "human intervention needed" | "confirmation of event", response:""}
        5.3 update the "conversation" collection {processState:"true"}
        5.4 call appropriate service

## Milestone 4: Act on Intelligent service response (orchestrator)

    6. `Scheduler` checks for response of "Intelligent_service"
        6.1 fetches the "Ai request" document: {interview_id:"", nextStep:"", response:""}
        6.2 acts on the basis of ai response
            6.2.1 case `Intelligent_service` response: {interview id:"", nextStep:"email_to_candidate", response:""}:
                6.2.1.2 `emailService`-> sends email to candidate takes parameter-> {from:"logged in user(recruiter)",to:"",content:"", subject:""}
                    6.2.1.1.1 update the Conversation document{message_id:"", interview_id:"", to:"", from:"", subject:"" , content:"", processState:""}
                6.2.1.2 update {status: "email_to_candidate"} in `Interview` document
            6.2.2 case `Intelligent_service` response: {interview id:"", nextStep:"email to interviewer", response:""}:
                6.2.2.1 `emailService`-> sends email to interviewer takes parameter-> {from:"logged in user(recruiter)",to:"",content:""}
                    6.2.2.1.1 update the Conversation document{conversation_id:"", message_id:"", interview_id:"", to:"", from:"", subject:"" , content:""}
                6.2.2.2 update {status: "email_to_interviewer"} in `Interview` document
            6.2.3 case `Intelligent_service` response: {nextStep:"human intervention needed"} : 
                6.2.3.1 update the interview document status to 'failed'
            6.2.4 case `Intelligent_service` response: {nextStep:"confirmation of event"} : `Schedule_event`
                6.2.4.1 update matching slot(overlapping slot) as {meetingTime:""} in interview collection {meetingTime:{timeStamp}}

## Milestone 5: Schedule Event

    1. `Schedule_event`
        1.1 fetch the meeting time stamp, interviewer email, and candidate email from "Interview" collection{}
        1.2 create a calender event of the fetched timestamp
        1.3 adds meeting link and email addresses of interviewer and candidate
        1.3 saves the event.
        1.4 update the "Interview" collection {status:"Scheduled", meeting:{link:"", time:"", callender_event_id:"", paltform:""}}

    
## Database collection:

1 **Interview**

```ts
type Interview = {
  interview_id: string;
  candidateEmail: string;
  interviewerEmail: string;
  resume: url; //stored in storage
  created_by: string; //recruiter email
  meeting?: {
    link: string;
    timeStamp: string;
    calendar_event_id?: string;
    platform: string;
}
  status: 'awaiting_candidate' | 'awaiting_interviewer' | 'Scheduled' | 'completed' | 'failed';
  created_at: FirebaseFirestore.Timestamp;
  updated_at: FirebaseFirestore.Timestamp;
};
```

2 **Conversation**

```ts
type Conversation = {
    conversation_id: string;
    interview_id: string;
    message_id: string; 
    to: string;
    from: string; 
    content: any;
    subject: string;
    processState: boolean
}
```

2 **AIRequest**

```ts
type AiRequest = {
    conversation_id: string;
    interview_id: string;
    message_id: string;
    nextStep: "email to candidate" | "email to interviewer" | "human intervention needed" | "confirmation of event";
    output?: any;
    status: 'pending' | 'completed' | 'failed';
    error?: string;
}
```

3 **Slot**

```ts
type Slot = {
    interview_id: string;
    timeStamp: string;
    role: interviewer | candidate

}