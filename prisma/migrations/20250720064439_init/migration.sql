-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('POPUP_TEXT', 'POPUP_FORM', 'EMAIL', 'DELAY', 'COUPON', 'TICKET');

-- CreateEnum
CREATE TYPE "FlowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "StageExecutionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'ERROR');

-- CreateTable
CREATE TABLE "flows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" TEXT NOT NULL,
    "flow_id" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "stage_type" "StageType" NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_executions" (
    "id" TEXT NOT NULL,
    "flow_id" TEXT NOT NULL,
    "user_id" TEXT,
    "status" "FlowExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "flow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_executions" (
    "id" TEXT NOT NULL,
    "flow_execution_id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "status" "StageExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "error_message" TEXT,

    CONSTRAINT "stage_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "flow_execution_id" TEXT NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "qr_code_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed_at" TIMESTAMP(3),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "flow_execution_id" TEXT NOT NULL,
    "qr_code_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed_at" TIMESTAMP(3),

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stages_flow_id_sequence_key" ON "stages"("flow_id", "sequence");

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_executions" ADD CONSTRAINT "flow_executions_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_executions" ADD CONSTRAINT "stage_executions_flow_execution_id_fkey" FOREIGN KEY ("flow_execution_id") REFERENCES "flow_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_executions" ADD CONSTRAINT "stage_executions_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_flow_execution_id_fkey" FOREIGN KEY ("flow_execution_id") REFERENCES "flow_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flow_execution_id_fkey" FOREIGN KEY ("flow_execution_id") REFERENCES "flow_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
