import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview',{
    id: serial('id').primaryKey(),
    interviewRound: varchar('interviewRound').notNull(),
    interviewDuration: varchar('interviewDuration').notNull(),
    company: varchar('company'),
    resumeContent: text('resumeContent').notNull(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull()
})

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockIdRef').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),
})