"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { Info, LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [interviewRound, setInterviewRound] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log();

    const inputPrompt =
      "A candidate's professional information(Job Position, Job Description, Experience) is delimited in triple backticks. Make " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " real life interview questions based on the details along with their answers. Send the response in JSON format. Give question and answer field in JSON. ```Job Position: " +
      jobPosition +
      ", Job Description/Tech Stack: " +
      jobDesc +
      ", Experience: " +
      jobExperience +
      " ```";

    const result = await chatSession.sendMessage(inputPrompt);
    const jsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(jsonResp));
    setJsonResponse(jsonResp);

    if (jsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: jsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("Error");
    }

    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 
      hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog} close={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Job Interview
            </DialogTitle>
            <DialogDescription>
              Add Details about your job position/role, Job Description and
              years of experience
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-y-5 mt-1" onSubmit={onSubmit}>
            <div className="">
              <label>Interview Round</label>
              <RadioGroup
                onChange={(event) => {
                  console.log(event.target.value)
                  setInterviewRound(event.target.value);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Technical Round"
                    id="Technical Round"
                  />
                  <label
                    htmlFor="Technical Round"
                    className="flex gap-1 items-center"
                  >
                    Technical Round
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Programming and DSA concepts. No coding.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Coding Round" id="Coding Round" />
                  <label
                    htmlFor="Coding Round"
                    className="flex gap-1 items-center"
                  >
                    Coding Round
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>1-2 DSA questions. Coding + concepts.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Technical + Coding Round"
                    id="Technical + Coding Round"
                  />
                  <label
                    htmlFor="Technical + Coding Round"
                    className="flex gap-1 items-center"
                  >
                    Technical + Coding Round
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Technical questions + coding topics</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HR Round" id="HR Round" />
                  <label htmlFor="HR Round" className="flex gap-1 items-center">
                    HR Round
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>HR questions only. No technical questions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                </div>
              </RadioGroup>
            </div>
            <div className="">
              <label>Job Role/Job Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                onChange={(event) => setJobPosition(event.target.value)}
              />
            </div>
            <div className="">
              <label>Job Description/Tech Stack (In Short)</label>
              <Textarea
                placeholder="Ex. Sprint Boot, MERN, Angular"
                required
                onChange={(event) => setJobDesc(event.target.value)}
              />
            </div>
            <div className="">
              <label>Years of experience</label>
              <Input
                placeholder="0-40"
                type="number"
                max="40"
                required
                onChange={(event) => setJobExperience(event.target.value)}
              />
            </div>
            <DialogFooter>
              <div className="flex gap-5 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disable={loading.toString()}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Preparing
                      Interview
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
