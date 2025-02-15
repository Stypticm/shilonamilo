-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userid" VARCHAR(255),
    "thingid" VARCHAR(255),
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thing" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "country" VARCHAR(255),
    "city" VARCHAR(255),
    "category" VARCHAR(255),
    "youneed" TEXT,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userid" VARCHAR(255),
    "photothing" VARCHAR(255),
    "photoyouneed" VARCHAR(255),
    "addedcategory" BOOLEAN,
    "addeddescription" BOOLEAN,
    "addedlocation" BOOLEAN,
    "addedyouneed" BOOLEAN,

    CONSTRAINT "Thing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "photourl" VARCHAR(255),
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_thingid_fkey" FOREIGN KEY ("thingid") REFERENCES "Thing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Thing" ADD CONSTRAINT "Thing_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
