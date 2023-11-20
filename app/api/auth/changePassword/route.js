import {connectToDb} from "@/utils/database";
import User from '/models/user'
import bcrypt from "bcrypt";

export const POST = async (req, res) => {
    const {oldPassword, newPassword, confirmPassword, email} = await req.json()

    try{
        await connectToDb()
        const You = await User.findOne({email: email})
        const isSamePassword = await bcrypt.compare(oldPassword, You.password)
        const isSameNewPassword = await bcrypt.compare(newPassword, You.password)

        if(!oldPassword || oldPassword.length < 8 || !newPassword || newPassword.length < 8 || !confirmPassword || confirmPassword.length < 8){
            return new Response(JSON.stringify('erreur taille passwords'), {status: 400})
        }

        if(!isSamePassword){
            return new Response(JSON.stringify('erreur same password'), {status: 400})
        }

        if(isSameNewPassword){
            return new Response(JSON.stringify('erreur same new password'), {status: 400})
        }

        if(newPassword !== confirmPassword){
            return new Response(JSON.stringify('erreur new & confirm'), {status: 400})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        You.password = hashedPassword;
        await You.save();


        return new Response(JSON.stringify('password change succeed'), {status: 200})
    }catch (e){
        return new Response(JSON.stringify('error global'), {status: 501})
    }
}