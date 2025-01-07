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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(jobExperience, jobDesc, jobPosition);
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
          <form className="flex flex-col gap-y-4 mt-1" onSubmit={onSubmit}>
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
                placeholder="5"
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
                <Button type="submit">Start Interview</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
