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

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [interviewRound, setInterviewRound] = useState();
  const [duration, setDuration] = useState("20");
  const [company, setCompany] = useState();
  const [resume, setResume] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const companies = [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Please upload only PDF files!");
      e.target.value = null; // Clear the input
    }
    setResume(file.name);
  };

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
            {/* Job position  */}
            <div className="">
              <label>Job Role/Job Position</label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                onChange={(event) => setJobPosition(event.target.value)}
              />
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
            {/* Years of experience */}
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
