-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_properties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_kes" REAL NOT NULL,
    "price_usd" REAL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "size_sqft" REAL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "amenities" TEXT NOT NULL DEFAULT '[]',
    "title_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" DATETIME,
    "duration_days" INTEGER NOT NULL DEFAULT 30,
    "ownerId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_properties" ("amenities", "bathrooms", "bedrooms", "category", "created_at", "description", "id", "images", "lat", "lng", "location", "ownerId", "price_kes", "price_usd", "size_sqft", "status", "title", "title_verified", "updated_at") SELECT "amenities", "bathrooms", "bedrooms", "category", "created_at", "description", "id", "images", "lat", "lng", "location", "ownerId", "price_kes", "price_usd", "size_sqft", "status", "title", "title_verified", "updated_at" FROM "properties";
DROP TABLE "properties";
ALTER TABLE "new_properties" RENAME TO "properties";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
