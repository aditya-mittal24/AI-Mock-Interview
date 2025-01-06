import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:laWKkCq3Frz4@ep-snowy-silence-a53vizgw.us-east-2.aws.neon.tech/ai-mock-interviewer?sslmode=require'
  }
});
