"use client";
import * as React from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function StartInterview({ params }) {
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = React.useState({});
  const [mockInterviewQuestions, setMockInterviewQuestions] = React.useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = React.useState(0);

  React.useEffect(() => {
    GetInterviewDetails();
  }, []);

  async function GetInterviewDetails() {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))
      .then((result) => {
        setInterviewData(result[0]);
        setMockInterviewQuestions(
          JSON.parse(result[0].jsonMockResp).interview_questions
        );
      });
  }
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        {
          <QuestionsSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
          />
        }

        {/* Video audio recording */}
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />
      </div>
    </div>
  );
}

export default StartInterview;

// {  "interview_questions":
//     [    {
//             "question": "Since you're applying for a Software Engineer role with a
//             focus on Spring Boot and have no prior experience, can you describe your understanding of
//             what Spring Boot is and its purpose in building applications?",

//             "answer": "Spring Boot is a framework built on top of the Spring framework that simplifies
//             the process of creating standalone, production-ready Spring-based applications.
//             Its primary purpose is to reduce the boilerplate code and configuration required,
//             allowing developers to focus on business logic. It achieves this through features like auto-configuration,
//             embedded servers, and starter dependencies."
//         },
//         {
//               "question": "Even without professional experience, what steps have you taken to
//               learn Spring Boot? Can you give an example of a project you might have built or worked through?",
//                "answer": "I've primarily learned Spring Boot through online courses, tutorials, and
//                by following the official documentation. I've also worked on a personal project,
//                such as creating a simple REST API for managing a to-do list. This involved setting up a
//                Spring Boot project, defining REST endpoints, handling request/response cycles, and persisting
//                data in-memory. This hands-on experience helped solidify my understanding of the core concepts."
//         },
//         {
//                "question": "Given your lack of professional experience, what challenges do you anticipate
//                facing in your first role as a Software Engineer working with Spring Boot,
//                and how do you plan to address them?",
//               "answer": "I anticipate challenges such as understanding large, existing codebases,
//               debugging complex issues in a production environment, and collaborating effectively within a team.
//               To address these challenges, I plan to be proactive in asking questions, seek mentorship from
//               experienced colleagues, thoroughly review documentation, and commit to continuous learning.
//               I am also dedicated to refining my debugging skills, embracing code reviews, and practicing agile
//               principles."
//         },
// ]
