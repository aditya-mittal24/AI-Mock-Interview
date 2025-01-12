"use client";
import * as React from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";

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
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex((prev) => prev - 1)}>
            Previous Question
          </Button>
        )}
        {activeQuestionIndex !=
          process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT - 1 && (
          <Button onClick={() => setActiveQuestionIndex((prev) => prev + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIndex ==
          process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT - 1 && (
          <Button>End Interview</Button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
