-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "passwords" (
    "user_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "passwords_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "user_id" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("user_id","device","browser")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
