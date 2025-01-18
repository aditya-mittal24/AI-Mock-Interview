import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function InterviewItemCard({ interview }) {
  const router = useRouter();
  const onStart = () => {
    router.push("/interview/" + interview?.mockId);
  };
  const onFeedback = () => {
    router.push("/interview/" + interview?.mockId + "/feedback");
  };
  return (
    <div className="border shadow-sm rounded-lg p-3">
      {interview.interviewRound !== undefined ? (
        <h2 className="font-bold text-primary">{interview?.interviewRound}</h2>
      ) : (
        <Skeleton className="h-3 w-20" />
      )}
      {interview.interviewDuration !== undefined ?
      <h2 className="text-sm text-gray-600">
        {interview?.interviewDuration} Minutes
      </h2> : <Skeleton className="h-2 w-40 my-2" />}
      <h2 className="text-xs text-gray-400 flex gap-2 items-center">
        Created At: {interview.createdAt!==undefined ? interview.createdAt : <Skeleton className="h-2 w-20 my-2" />}
      </h2>
      <div className="flex justify-between mt-2 gap-5">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onFeedback}
        >
          Feedback
        </Button>
        <Button size="sm" className="w-full" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
