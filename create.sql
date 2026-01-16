CREATE TABLE "public"."teacher" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "deleted_at" timestamp(6),
  CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
)
;