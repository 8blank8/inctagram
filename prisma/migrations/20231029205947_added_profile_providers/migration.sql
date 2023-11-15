-- CreateTable
CREATE TABLE "GoogleProvider" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GoogleProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubProvider" (
    "id" TEXT NOT NULL,
    "providerId" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "gitName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GitHubProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "firstName" TEXT,
    "familyName" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleProvider_userId_key" ON "GoogleProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProvider_providerId_key" ON "GitHubProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProvider_email_key" ON "GitHubProvider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProvider_gitName_key" ON "GitHubProvider"("gitName");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProvider_userId_key" ON "GitHubProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "GoogleProvider" ADD CONSTRAINT "GoogleProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubProvider" ADD CONSTRAINT "GitHubProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
