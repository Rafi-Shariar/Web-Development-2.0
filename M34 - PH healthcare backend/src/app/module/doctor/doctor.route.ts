import { Router } from "express";

import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { DoctorController } from "./doctor.controller";



const router = Router();

router.post('/apply',
    upload.fields([
        { name : "resume", maxCount : 1},
        { name : "additionalFiles", maxCount : 3}
    ]),
    DoctorController.applyAsDoctor)




export const DoctorRoutes = router;
