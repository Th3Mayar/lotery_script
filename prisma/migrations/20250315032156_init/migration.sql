-- CreateTable
CREATE TABLE "LotteryResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numbers" TEXT NOT NULL,
    "drawDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
