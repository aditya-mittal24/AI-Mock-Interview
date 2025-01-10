import { Button } from "@/components/ui/button";
import { WebcamIcon, Mic } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const [userAnswer, setUserAnswer] = useState("");
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    setUserAnswer("");
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result.transcript)
    );
  }, [results]);

  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        toast("Error while saving your answer, please record again!");
        return;
      }
      const feedbackPrompt =
        "Question: " +
        mockInterviewQuestions[activeQuestionIndex]?.question +
        ", User Answer: " +
        userAnswer +
        ", depeding on question and user answer for given interview question please give a rating for answer and feedback as area of improvement if any in just 3-5 lines to improve it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(mockJsonResp);
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <WebcamIcon className="w-40 h-40 absolute text-white" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button variant="outline" className="my-10" onClick={SaveUserAnswer}>
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 items-center">
            <Mic /> Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      <Button
        onClick={() => {
          console.log(userAnswer);
        }}
      >
        Show User Answer
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
