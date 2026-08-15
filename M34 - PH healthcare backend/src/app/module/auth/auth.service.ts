import bcrypt from "bcryptjs";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import type {
	IForgotPasswordPayload,
	IGoogleLoginPayload,
	ILoginUserPayload,
	IRegisterPatientPayload,
	IRequestUser,
	IResetPasswordPayload,
	IVerifyEmailPayload,
} from "./auth.interface";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { googleClient } from "../../lib/googleAuth";
import crypto from 'crypto'
import { redisClient } from "../../lib/redis";
import { transporter } from "../../lib/nodemailer";
import ejs from "ejs"
import path from "path";

const registerPatient = async (payload: IRegisterPatientPayload) => {
	const { name, password, patient : patiendData } = payload;
	const email = payload.email.trim().toLowerCase();

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExists) {
		throw new Error("User with this email already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 8);

	const otp = crypto.randomInt(100000, 1000000).toString()
	const OTPkey = `patient-registration-otp:${email}`
	await redisClient.set(OTPkey, otp, {
		expiration : {
			type : "EX",
			value : 5 * 60
		}
	})


	const patientRegistrationKey = `patient-registration-data:${email}`

	const redisUserDataPayload = {
		name,
		email,
		password : hashedPassword,
		patient : patiendData
	}

	await redisClient.set(patientRegistrationKey,
		JSON.stringify(redisUserDataPayload),
		{
		expiration : {
			type : "EX",
			value : 5 * 60
		}
	})

	//sending OTP in mail
	const templatePath = path.join(process.cwd(), "src/app/templates/registration-otp.ejs");

	const templateData = {
		OTP : otp,
		email
	}

	const html = await ejs.renderFile(templatePath, templateData)


	await transporter.sendMail({
		from : config.email_sender,
		to : email,
		subject : "Email Varification",
		// text : `Your OTP is ${otp}`
		html
	})


	

	
};

const verifyPatientEmail = async(payload : IVerifyEmailPayload) => {


	const email = payload.email.trim().toLowerCase();
	const otp = payload.otp

	const isUserExists = await prisma.user.findUnique({
		where: { email },
	});


	if (isUserExists?.emailVerified) {
		throw new Error("Email already verified.");
	}

	if(isUserExists?.status === "BLOCKED"){
		throw new Error("User is blocked!")
	}

	if(isUserExists?.isDeleted || isUserExists?.status === "DELETED"){
		throw new Error("User is deleted")
	}

	const OTPkey = `patient-registration-otp:${email}`


	const redisOTP = await redisClient.get(OTPkey)

	if(!redisOTP){
		throw new Error("invalid OTP")
	}

	if(redisOTP !== otp){
		throw new Error("Incorrect OTP")
	}

	await redisClient.del(OTPkey)

	const patientRegistrationKey = `patient-registration-data:${email}`
	const redisData = await redisClient.get(patientRegistrationKey)

	if(!redisData) throw new Error("User does not exists.")

	const patientPayload : IRegisterPatientPayload = JSON.parse(redisData)

	const createdUser = await prisma.user.create({
		data: {
			name: patientPayload.name,
			email : patientPayload.email,
			password: patientPayload.password,
			role: Role.PATIENT,
			status: UserStatus.ACTIVE,
			emailVerified: true,
			patient: {
				create: { 
					name : patientPayload.name, 
					email : patientPayload.email, 
					contactNumber : patientPayload?.patient?.contactNumber || null },
			},
		},
		omit: { password: true },
		include: { patient: true },
	});

	await redisClient.del(patientRegistrationKey)

	const { patient, ...user } = createdUser;
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user,
		patient,
		accessToken,
		refreshToken,
	};






}

const loginUser = async (payload: ILoginUserPayload) => {
	const { password } = payload;
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("User not found");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is blocked");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted");
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		user.password as string,
	);

	if (!isPasswordMatched) {
		throw new Error("Invalid credentials");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const getMe = async (user: IRequestUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},
		include: {
			patient: true,
		},
		omit: {
			password: true,
		},
	});

	if (!isUserExists) {
		throw new Error("User not found");
	}

	return isUserExists;
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new Error(
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
		throw new Error("User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const googleLogin = async (payload: IGoogleLoginPayload) => {
	let googleIdTokenPayload: TokenPayload | null | undefined = null;

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google ID Token Varification Failed", error);
		throw new Error("Invalid or expired google id token");
	}

	if (!googleIdTokenPayload) {
		throw new Error("Invalid or expired google id token");
	}

	if (!googleIdTokenPayload.email) {
		throw new Error("Google email not found!");
	}

	if (!googleIdTokenPayload.name) {
		throw new Error("Google name not found!");
	}

	const isPatientExitsWithGoogleAuth = await prisma.user.findUnique({
		where: {
			email: googleIdTokenPayload.email,
			role: Role.PATIENT,
			googleId: googleIdTokenPayload.sub,
		},
	});

	let user = isPatientExitsWithGoogleAuth;

	if (!isPatientExitsWithGoogleAuth) {
		const ifPatientExistsWithCredentials = await prisma.user.findUnique({
			where: {
				email: googleIdTokenPayload.email,
				role: Role.PATIENT,
				authProvider: AuthProvider.CREDENTIAL,
			},
		});

		if (ifPatientExistsWithCredentials) {
			if (!ifPatientExistsWithCredentials.emailVerified) {
				throw new Error("Email Not Varified");
			}

			if (ifPatientExistsWithCredentials.status === UserStatus.BLOCKED) {
				throw new Error("User is blocked");
			}

			if (
				ifPatientExistsWithCredentials.isDeleted ||
				ifPatientExistsWithCredentials.status === UserStatus.DELETED
			) {
				throw new Error("User is deleted!");
			}

			user = await prisma.user.update({
				where: {
					id: ifPatientExistsWithCredentials.id,
				},
				data: {
					googleId: googleIdTokenPayload.sub,
				},
			});

			
		} else {
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email: googleIdTokenPayload.email,
					role: Role.PATIENT,
					googleId: googleIdTokenPayload.sub,
					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,
					patient: {
						create: {
							name: googleIdTokenPayload.name,
							email: googleIdTokenPayload.email,
						},
					},
				},
			});
		}
	}

	if (!user) {
		throw new Error("User not found!");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new Error("User is blocked");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new Error("User is deleted!");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const forgotPassword = async(payload : IForgotPasswordPayload) => {

	const {email} = payload;

	const isUserExists = await prisma.user.findUnique({
		where : {email}
	})

	if(!isUserExists){
		throw new Error("User does not exists!")
	}

	if(isUserExists.status === "BLOCKED"){
		throw new Error("User is blocked!")
	}

	if(!isUserExists.emailVerified){
		throw new Error("User not varified.")
	}

	if(isUserExists.isDeleted || isUserExists.status === "DELETED"){
		throw new Error("User is deleted")
	}

	if(isUserExists.authProvider !== 'CREDENTIAL'){
		throw new Error('User Has Account With Google.')
	}

	const otp = crypto.randomInt(100000, 1000000).toString()

	const key = `forgot-password-otp:${isUserExists.email}`

	await redisClient.set(key, otp, {
		expiration : {
			type : "EX",
			value : 5 * 60
		}
	})

	const templatePath = path.join(process.cwd(), "src/app/templates/forgot-password.ejs");

	const html = await ejs.renderFile(templatePath, {
		OTP : otp
	})



	await transporter.sendMail({
		from : config.email_sender,
		to : isUserExists.email,
		subject : "OTP for reset password",
		// text : `Your OTP is ${otp}`
		html
	})

}

const resetPassword = async(payload : IResetPasswordPayload) => {

	const {email, otp, newPassword} = payload;

	const isUserExists = await prisma.user.findUnique({
		where : {email}
	})

	if(!isUserExists){
		throw new Error("User does not exists!")
	}

	if(isUserExists.status === "BLOCKED"){
		throw new Error("User is blocked!")
	}

	if(!isUserExists.emailVerified){
		throw new Error("User not varified.")
	}

	if(isUserExists.isDeleted || isUserExists.status === "DELETED"){
		throw new Error("User is deleted")
	}

	if(isUserExists.authProvider !== 'CREDENTIAL'){
		throw new Error('User Has Account With Google.')
	}

	const key = `forgot-password-otp:${isUserExists.email}`


	const redisOTP = await redisClient.get(key)

	if(!redisOTP){
		throw new Error("invalid OTP")
	}

	if(redisOTP !== otp){
		throw new Error("Incorrect OTP")
	}

	const hashedPassword = await bcrypt.hash(newPassword, 8);

	const updatedUser = await prisma.user.update({
		where : {
			email : isUserExists.email
		},
		data : {
			password : hashedPassword
		}
	})

	await redisClient.del([key])

	await transporter.sendMail({
		from : config.email_sender,
		to : isUserExists.email,
		subject : "PH HealthCare - Your Password is changed.",
		text : `Your password is changed sucessfully. please login to check.`
	})

}

export const AuthService = {
	registerPatient,
	loginUser,
	verifyPatientEmail,
	getMe,
	refreshToken,
	googleLogin,
	forgotPassword,
	resetPassword
};



/* 




*/