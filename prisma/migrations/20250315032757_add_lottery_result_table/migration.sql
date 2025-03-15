/*
  Warnings:

  - The primary key for the `LotteryResult` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `drawDate` on the `LotteryResult` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `LotteryResult` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LotteryResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numbers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_LotteryResult" ("id", "numbers") SELECT "id", "numbers" FROM "LotteryResult";
DROP TABLE "LotteryResult";
ALTER TABLE "new_LotteryResult" RENAME TO "LotteryResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
