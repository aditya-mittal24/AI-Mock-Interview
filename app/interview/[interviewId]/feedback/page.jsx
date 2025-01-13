"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function Feedback({ params }) {
  const { interviewId } = React.use(params);
  const [feedbackList, setFeedbackList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

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
        setFeedbackList(result);
        setIsLoading(false);
      });
  };
  return (
    <div className="p-10">
      {isLoading ? (
        <div className="flex flex-col gap-y-4">
          <Skeleton className="h-5 w-[50%]" />
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-[100%]" />
        </div>
      ) : feedbackList?.length == 0 ? (
        <h2 className="text-3xl font-bold text-red-500">
          No question answered in interview!
        </h2>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-green-500">
            Congratulations!
          </h2>
          <h2 className="font-bold text-2xl">Here is you interview feedback</h2>
          <h2 className="text-primary text-lg my-3">
            You overall interview rating: <strong>7/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answer, your answer and
            feedback for improvement
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                  {item.question} <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating: </strong>
                      {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer: </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          <Button className="mt-3" onClick={() => router.replace("/dashboard")}>
            Go Home
          </Button>
        </div>
      )}
    </div>
  );
}

export default Feedback;
