import { UploadApiResponse } from "cloudinary";
import { cloudinaryUpload } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";

const uploadProfileImage = async (buffer: Buffer, userId: string) => {

    const currentUser = await prisma.user.findUnique({
        where : {
            id : userId
        },
        select : {
            imagePublicId : true,
            image : true,
        }
    })




  const clodinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinaryUpload.uploader
        .upload_stream(
          {
            resource_type: "auto",
          },
          async (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("Not result from cloudinary"));
            }

            resolve(result);
          },
        )
        .end(buffer);
    },
  );

  const upadatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: clodinaryResult?.secure_url,
      imagePublicId: clodinaryResult?.public_id,
    },
    omit: {
      password: true,
    },
  });


   //delete previous image

  if(currentUser?.imagePublicId && currentUser.image){
    await cloudinaryUpload.uploader.destroy(currentUser.imagePublicId)
  }

  return upadatedUser;
};

export const userServices = {
  uploadProfileImage,
};
