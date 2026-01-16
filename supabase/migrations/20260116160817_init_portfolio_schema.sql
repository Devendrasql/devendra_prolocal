/*
  # Portfolio Website Initial Schema

  1. New Tables
    - `User` - Admin users with authentication
      - `id` (serial, primary key)
      - `email` (text, unique)
      - `password` (text, hashed)
      - `roleId` (integer, foreign key)
      - `createdAt` (timestamp)
    
    - `Role` - User roles (ADMIN, USER)
      - `id` (serial, primary key)
      - `name` (text, unique)
    
    - `Project` - Portfolio projects
      - `id` (serial, primary key)
      - `title` (text)
      - `summary` (text)
      - `content` (text, nullable)
      - `image` (text, nullable) - URL to project image
      - `featured` (boolean, default false)
      - `views` (integer, default 0)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
    
    - `Tag` - Project tags
      - `id` (serial, primary key)
      - `name` (text, unique)
    
    - `ProjectTag` - Many-to-many relation between projects and tags
      - `projectId` (integer)
      - `tagId` (integer)
    
    - `ProjectView` - Track project views
      - `id` (serial, primary key)
      - `projectId` (integer)
      - `ip` (text, nullable)
      - `userAgent` (text, nullable)
      - `createdAt` (timestamp)
    
    - `ProjectRanking` - Project ranking system
      - `id` (serial, primary key)
      - `projectId` (integer, unique)
      - `editorialRank` (integer, default 0)
      - `score` (double precision, default 0)
    
    - `RefreshToken` - JWT refresh tokens
      - `id` (serial, primary key)
      - `token` (text, unique)
      - `userId` (integer)
      - `expiresAt` (timestamp)
      - `createdAt` (timestamp)

  2. Security
    - All tables use foreign key constraints
    - Cascade delete for dependent records
*/

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectTag" (
    "projectId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("projectId","tagId")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectView" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProjectRanking" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "editorialRank" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProjectRanking_projectId_key" ON "ProjectRanking"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_roleId_fkey'
  ) THEN
    ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProjectTag_projectId_fkey'
  ) THEN
    ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProjectTag_tagId_fkey'
  ) THEN
    ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProjectView_projectId_fkey'
  ) THEN
    ALTER TABLE "ProjectView" ADD CONSTRAINT "ProjectView_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ProjectRanking_projectId_fkey'
  ) THEN
    ALTER TABLE "ProjectRanking" ADD CONSTRAINT "ProjectRanking_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'RefreshToken_userId_fkey'
  ) THEN
    ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Insert default roles
INSERT INTO "Role" ("id", "name") VALUES (1, 'ADMIN'), (2, 'USER')
ON CONFLICT ("name") DO NOTHING;
