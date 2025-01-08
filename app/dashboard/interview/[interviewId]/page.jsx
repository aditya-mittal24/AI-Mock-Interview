"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import * as React from "react";
import Webcam from "react-webcam";
import { Skeleton } from "@/components/ui/skeleton";

function Interview({ params }) {
  const { interviewId } = React.use(params);
  const [interviewData, setInterviewData] = React.useState({});
  const [webcamEnabled, setWebcamEnabled] = React.useState(false);

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
      });
  }

  return (
    <div className="my-10 flex justify-center flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg flex gap-2 items-center">
              <strong>Job Position:</strong>
              {interviewData.jobPosition ? (
                interviewData.jobPosition
              ) : (
                <Skeleton className="h-4 w-[200px]" />
              )}
            </h2>
            <h2 className="text-lg flex gap-2 items-center">
              <strong>Job Description/Tech Stack:</strong>
              {interviewData.jobDesc ? (
                interviewData.jobDesc
              ) : (
                <Skeleton className="h-4 w-[200px]" />
              )}
            </h2>
            <h2 className="text-lg flex gap-2 items-center">
              <strong>Experience:</strong>
              {interviewData.jobExperience ? (
                interviewData.jobExperience
              ) : (
                <Skeleton className="h-4 w-[200px]" />
              )}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <div className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Important Instructions</strong>
            </div>
            <ol className="list-decimal my-2">
              <li>
                Please ensure your webcam and microphone are enabled for the
                session.
              </li>
              <li>
                Sit in a quiet environment to minimize background noise and
                distractions.
              </li>
              <li>
                During the interview:
                <ul className="list-disc ml-3">
                  <li>
                    The AI interviewer will ask you a series of questions.
                  </li>
                  <li>
                    Provide clear and thoughtful responses, as these will be
                    analyzed to generate a detailed report.
                  </li>
                </ul>
              </li>
            </ol>
            <h2 className="mt-4">
              <strong>Note:</strong> Your video and audio data will not be
              stored at any point. This ensures your privacy and data security.
              Good luck with your interview!
            </h2>
          </div>
        </div>
        <div className="">
          {webcamEnabled ? (
            <Webcam
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              mirrored={true}
              
            />
          ) : (
            <div className="flex flex-col">
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button onClick={() => setWebcamEnabled(true)}>
                Enable Webcam and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Button disabled={!webcamEnabled}>Start Interview</Button>
      </div>
    </div>
  );
}

export default Interview;
