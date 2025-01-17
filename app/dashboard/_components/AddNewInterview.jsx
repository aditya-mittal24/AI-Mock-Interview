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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { ChevronsUpDown, Info, LoaderCircle, Paperclip } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from 'axios';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobDesc, setJobDesc] = useState();
  const [interviewRound, setInterviewRound] = useState();
  const [duration, setDuration] = useState("20");
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState();
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState();
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const companies = [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast("Please upload PDF files only.");
      e.target.value = null; // Clear the input
      return;
    }
    setResumeData("")
    uploadResume(file);
    setResume(file.name);
  };
  const uploadResume = async (file) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8000/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumeData(JSON.stringify(response.data))
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setLoading(false)
  };

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log();

    const inputPrompt = `
    Act as a professional interviewer conducting an interview for the role described in the job description. Generate realistic and conversational questions for the candidate based on the given attributes. Follow this structured flow:

    Introduction and Ice-Breaker:
    Start with a warm introduction to make the candidate comfortable. For example:
      "Hello [name], I am your interviewer today. How are you doing?"
      "Can you introduce yourself or tell me about yourself briefly?"

    Resume-Based Questions:
    Ask questions directly tied to the candidate's resume content:
      Education: "I see you studied at [university] with a degree in [degree]. Can you share how this prepared you for a role in [job's relevant field]?"
      Experience: "You worked as a [designation] at [company_names]. Can you discuss one of the most impactful projects you worked on there?"
      Projects: "You developed [project name]. Can you explain the challenges you faced while implementing [specific feature]?"
      Skills: "You list [skill]. Can you provide an example of how you've applied this skill in a practical scenario?"

    Job-Specific and Skill Questions:
    Gradually transition to questions relevant to the job description:
      For technical or coding rounds: "Based on the required skills for this role, how would you approach implementing [specific technology or concept]?"
      For HR rounds: "What motivates you to apply for this role, and how do you see yourself contributing to our company culture?"

    Progressive Difficulty:
    Begin with direct and simple questions, then move to deeper and more detailed ones:
      "Can you walk me through your approach to improving [specific outcome or metric] in your past role?"
      "What strategies would you use to tackle [specific challenge] based on your prior experience?"

    Closing and Candidate Input:
    Conclude with open-ended questions to encourage candidate input:
      "Do you have any questions for me about the role or the company?"
      "That marks the end of the interview, best of luck, etc."

  Return the questions in the following JSON format:
  {
  "introduction": ["Hello [name], I am your interviewer today. How are you doing?", "Can you introduce yourself?"],
  "resume_based": ["You worked as a [designation] at [company_names]. Can you discuss one of the most impactful projects you worked on?", "I see you developed [project name]. Can you explain the challenges you faced while implementing [specific feature]?"],
  "job_specific": ["Based on the job description, how would you approach implementing [specific technology or concept]?", "What strategies would you use to tackle [specific challenge] in this role?"],
  "closing": ["Do you have any questions for me about the role or the company?", "That marks the end of the interview, best of luck, etc."]
  }

  NOTE: Assume each question takes around 2-3 minutes or so, give the number of questions according to the interview duration.

  Use the following attributes to tailor the questions:
  Interview Round: ${interviewRound}
  Interview Duration: ${duration}
  Candidate Resume: ${resumeData}
  Job Description: ${jobDesc}
  Make the interview engaging and as realistic as possible while staying professional.
    `;

    // const inputPrompt =
    //   "A candidate's professional information(Job Position, Job Description, Experience) is delimited in triple backticks. Make " +
    //   process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
    //   " real life interview questions based on the details along with their answers. Send the response in JSON format. Give question and answer field in JSON. ```Job Position: " +
    //   jobPosition +
    //   ", Job Description/Tech Stack: " +
    //   jobDesc +
    //   ", Experience: " +
    //   jobExperience +
    //   " ```";

    const result = await chatSession.sendMessage(inputPrompt);
    const jsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(jsonResp));
    setJsonResponse(jsonResp);

    // if (jsonResp) {
    //   const resp = await db
    //     .insert(MockInterview)
    //     .values({
    //       mockId: uuidv4(),
    //       jsonMockResp: jsonResp,
    //       jobDesc: jobDesc,
    //       createdBy: user?.primaryEmailAddress?.emailAddress,
    //       createdAt: moment().format("DD-MM-yyyy"),
    //     })
    //     .returning({ mockId: MockInterview.mockId });

    //   console.log("Inserted ID:", resp);
    //   if (resp) {
    //     setOpenDialog(false);
    //     router.push("/interview/" + resp[0]?.mockId);
    //   }
    // } else {
    //   console.log("Error");
    // }

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
            {/* Interview round */}
            <div className="">
              <label>Interview Round</label>
              <fieldset className="space-y-2 mt-2">
                {/* Technical Round */}
                <div>
                  <label
                    htmlFor="TechnicalRound"
                    className="flex cursor-pointer w-[50%] items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                  >
                    <p className="text-gray-700">Technical Round</p>

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

                    <input
                      type="radio"
                      name="TechnicalRound"
                      value="Technical Round"
                      id="TechnicalRound"
                      className="sr-only"
                      checked={interviewRound == "Technical Round"}
                      onChange={(event) => {
                        setInterviewRound(event.target.value);
                      }}
                    />
                  </label>
                </div>
                {/* Coding Round  */}
                <div>
                  <label
                    htmlFor="CodingRound"
                    className="flex w-[50%] cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                  >
                    <p className="text-gray-700">Coding Round</p>

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

                    <input
                      type="radio"
                      name="CodingRound"
                      value="Coding Round"
                      id="CodingRound"
                      className="sr-only"
                      checked={interviewRound == "Coding Round"}
                      onChange={(event) => {
                        setInterviewRound(event.target.value);
                      }}
                    />
                  </label>
                </div>
                {/* Technical + Coding Round  */}
                <div>
                  <label
                    htmlFor="TechnicalCodingRound"
                    className="flex w-[50%] cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                  >
                    <p className="text-gray-700">Technical + Coding Round</p>

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

                    <input
                      type="radio"
                      name="TechnicalCodingRound"
                      value="Technical + Coding Round"
                      id="TechnicalCodingRound"
                      className="sr-only"
                      checked={interviewRound == "Technical + Coding Round"}
                      onChange={(event) => {
                        setInterviewRound(event.target.value);
                      }}
                    />
                  </label>
                </div>
                {/* HR Round  */}
                <div>
                  <label
                    htmlFor="HRRound"
                    className="flex w-[50%] cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500"
                  >
                    <p className="text-gray-700">HR Round</p>

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

                    <input
                      type="radio"
                      name="HRRound"
                      value="HR Round"
                      id="HRRound"
                      className="sr-only"
                      checked={interviewRound == "HR Round"}
                      onChange={(event) => {
                        setInterviewRound(event.target.value);
                        setDuration('20');
                      }}
                    />
                  </label>
                </div>
              </fieldset>
              {/* <RadioGroup
                onValueChange={(event) => setInterviewRound(event.target.value)}
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
              </RadioGroup> */}
            </div>
            {/* Duration of interview  */}
            <div className="flex gap-4 items-center">
              <label htmlFor="">Duration (minutes)</label>
              <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
                <button
                  className={
                    duration === "20"
                      ? "inline-block rounded-md bg-white px-6 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                      : "inline-block rounded-md px-6 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
                  }
                  onClick={() => setDuration("20")}
                >
                  20
                </button>

                <button
                  className={
                    duration === "30"
                      ? "inline-block rounded-md bg-white px-6 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                      : "inline-block rounded-md px-6 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
                  }
                  onClick={() => setDuration("30")}
                >
                  30
                </button>

                <button
                  className={
                    duration === "45"
                      ? "inline-block rounded-md bg-white px-6 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                      : "inline-block rounded-md px-6 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
                  }
                  onClick={() => setDuration("45")}
                  disabled={interviewRound == "HR Round"}
                >
                  45
                </button>
              </div>
            </div>
            {/* Company  */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="">Company</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !company && "text-muted-foreground"
                    )}
                  >
                    {company
                      ? companies.find((company) => company.value === company)
                          ?.label
                      : "Select company"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search company..." />
                    <CommandList>
                      <CommandEmpty>No company found.</CommandEmpty>
                      <CommandGroup>
                        {companies.map((company) => (
                          <CommandItem
                            value={company.label}
                            key={company.value}
                            onSelect={() => {}}
                          >
                            {company.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                company.value === company
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Resume */}
            <div className="flex gap-4 items-center">
            <label htmlFor="">Upload Resume</label>
            <div className="flex justify-center items-center gap-2">
      <label
        htmlFor="pdf-upload"
        className="flex items-center space-x-2 px-4 py-2 text-blue-500 text-sm font-medium rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300 cursor-pointer"
      >
        <Paperclip className="w-5 h-5" />
        <span>Upload</span>
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <span>{resume}</span>
    </div>
            </div>
            {/* Job description  */}
            <div className="">
              <label>Job Description/Tech Stack (In Short)</label>
              <Textarea
                placeholder="Ex. Sprint Boot, MERN, Angular"
                required
                onChange={(event) => setJobDesc(event.target.value)}
              />
            </div>
            {/* Start cancel buttons  */}
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
                      <LoaderCircle className="animate-spin" /> {resumeData ? "Preparing Interview" : "Parsing Resume"}
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

<div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
  <button className="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative">
    Edit
  </button>

  <button className="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative">
    View
  </button>

  <button className="inline-block rounded-md bg-white px-4 py-2 text-sm text-blue-500 shadow-sm focus:relative">
    Delete
  </button>
</div>;

// appdynamics
// arista networks
// arista
// asana
// blackrock
//blizzard
// bloomreach
// booking.com - booking
// clutter
// codenation
// cohesity
// coursera
// DE Shaw
// DeliveryHero
// Deutsche bank
// DiDi
// Docusign


// to remove
// bank of america
// bolt
// cognizant
// coinbase
// Deloitte
