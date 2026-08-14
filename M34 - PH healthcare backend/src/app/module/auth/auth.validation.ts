import z from "zod";

 const PatientRegistratinoZodSchema = z.object({
	name : z.string().min(3, "name must be atleast 3 characters").max(20),
	email : z.email(),
	password : z.string(),
	patient : z.object({
		contactNumber : z.string().optional()
	}).optional()
})


const resetPasswordZonSchema = z.object({
	email : z.email(),
	password : z.string().min(5, "Password must be atleast 5 characters"),
	otp : z.string().length(6)
	
})


export const PatientValidation = {
	PatientRegistratinoZodSchema,
	resetPasswordZonSchema
}
