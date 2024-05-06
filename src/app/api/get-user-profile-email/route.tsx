import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {z} from 'zod'
import { emailValidation } from "@/schemas/signInSchema";
const UserEmailQuerySchema=z.object({
    useremail:emailValidation
})

export async function GET(req:Request){
    await dbConnect()
    try {
        const {searchParams} =new URL(req.url)
        const queryParam={
            useremail:searchParams.get('email')
        }
        // validate with zod
        const result=UserEmailQuerySchema.safeParse(queryParam)
        // console.log(result)
        if(!result.success){
            const useremailErrors=result.error.format().useremail?._errors ||[]
            return Response.json({
                message:useremailErrors?.length>0?useremailErrors.join(', '):'Invalid Query Parameters',
                success:false
            },{status:400})
        }
        const {useremail}=result.data
        // const useremail='anand@gmila.com'
        // const useremail='anantkumar012002@gmail.com'
        // console.log(useremail)
        const user = await UserModel.findOne({ email:useremail });
        // console.log(user)
        
        if(!user){
            return Response.json({
                success:false,
                message:'User Not found'
            },{status:201})
        }
        const userDetails = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            followers: user.followers,
            following: user.following,
            image: user.image,
            imgPublicId: user.imgPublicId,
            message: user.message,
            __v: user.__v
          };
        // console.log(userDetails)
        return Response.json({
            success:true,
            userDetails,
            message:'user find success full'
        },{status:201})
    } catch (error:any) {
        console.error("Error during finding user ",error)
        return Response.json({
            success:false,
            message:"Error during finding user"
        },{status:500})
    }
}