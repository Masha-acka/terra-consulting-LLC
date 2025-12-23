-- CreateTable
CREATE TABLE "properties" (
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
