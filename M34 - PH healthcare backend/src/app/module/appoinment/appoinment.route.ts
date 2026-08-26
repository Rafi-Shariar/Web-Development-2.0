import { Router } from "express";

import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { appointmentController } from "./appoinment.controller";


const router = Router();

router.post('/book-appoinment',auth(Role.PATIENT), appointmentController.bookAppointment)

//book appointment callback url
router.get('/book-appoinment/payment/callback', appointmentController.bookAppointmentCallback)


export const AppointmentRoutes = router;
