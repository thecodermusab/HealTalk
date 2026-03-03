-- Add richer profile fields for psychologists
ALTER TABLE "Psychologist"
ADD COLUMN "location" TEXT,
ADD COLUMN "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "education" JSONB,
ADD COLUMN "certifications" JSONB;

-- Add admin-managed testimonials per psychologist
CREATE TABLE "PsychologistTestimonial" (
  "id" TEXT NOT NULL,
  "psychologistId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT,
  "text" TEXT NOT NULL,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PsychologistTestimonial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PsychologistTestimonial_psychologistId_createdAt_idx"
ON "PsychologistTestimonial"("psychologistId", "createdAt");

ALTER TABLE "PsychologistTestimonial"
ADD CONSTRAINT "PsychologistTestimonial_psychologistId_fkey"
FOREIGN KEY ("psychologistId") REFERENCES "Psychologist"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
