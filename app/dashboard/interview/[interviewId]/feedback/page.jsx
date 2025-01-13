"use client"
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import * as React from "react";

function Feedback({ params }) {
  const { interviewId } = React.use(params);
  const [feedbackList, setFeedbackList] = useState([]);

  React.useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id)
      .then((result) => {
        console.log(result);
        setFeedbackList(result)
      });
  };
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is you interview feedback</h2>
      <h2 className="text-primary text-lg my-3">
        You overall interview rating: <strong>7/1-</strong>
      </h2>

      <h2 className="text-sm text-gray-500">
        Find below interview questions with correct answer, your answer and
        feedback for improvement
      </h2>
    </div>
  );
}

export default Feedback;
