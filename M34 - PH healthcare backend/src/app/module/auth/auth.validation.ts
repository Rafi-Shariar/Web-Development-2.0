import z from "zod";

 const PatientRegistratinoZodSchema = z.object({
	name : z.string().min(3, "name must be atleast 3 characters").max(20),
	email : z.email(),
	password : z.string(),
	patient : z.object({
		contactNumber : z.string().optional()
	}).optional()
})


export const PatientValidation = {
	PatientRegistratinoZodSchema
}
