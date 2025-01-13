import { Lightbulb, LoaderCircleIcon, Volume2 } from "lucide-react";
import React, { useEffect } from "react";

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };
  return mockInterviewQuestions ? (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestions.map((question, index) => {
          return (
            <h2
              className={
                activeQuestionIndex == index
                  ? "p-2 text-white bg-purple-700 rounded-full text-xs md:text-sm text-center cursor-pointer"
                  : "p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer"
              }
              key={index}
            >
              Question #{index + 1}
            </h2>
          );
        })}
      </div>
      <h2 className="my-5 text-md md:text-lg">
        {mockInterviewQuestions[activeQuestionIndex].question}
      </h2>
      <Volume2
        className="cursor-pointer"
        onClick={() =>
          textToSpeech(mockInterviewQuestions[activeQuestionIndex].question)
        }
      />
      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-blue-600">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-blue-600 my-2">
          Click on record answer when you want to answer the question. At the
          end of the interview we will give you the feedback along with the
          correct answer for each of question and your answer for detailed
          analysis.
        </h2>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center my-10">
      <LoaderCircleIcon className="animate-spin h-24 w-24" />
    </div>
  );
}

export default QuestionsSection;
