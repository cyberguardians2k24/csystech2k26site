-- Add team members list for team registration (up to 3 enforced in backend validation)
ALTER TABLE "Registration"
ADD COLUMN IF NOT EXISTS "teamMembers" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
