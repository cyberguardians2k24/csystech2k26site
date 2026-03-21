-- Add registration type to support solo/team pricing
DO $$
BEGIN
  CREATE TYPE "RegistrationType" AS ENUM ('SOLO', 'TEAM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE "Registration"
ADD COLUMN IF NOT EXISTS "registrationType" "RegistrationType" NOT NULL DEFAULT 'SOLO';
