import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/checkout", auth(Role.USER, Role.AUTHOR, Role.ADMIN), subscriptionController.createCheckOutSession)
router.post("/webhook", subscriptionController.handleWebHook)
router.get("/status", auth(Role.USER, Role.AUTHOR, Role.ADMIN), subscriptionController.getSubscriptionStatus)

export const subscriptionRoutes = router