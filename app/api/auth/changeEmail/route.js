import {connectToDb} from "@/utils/database";
import User from '/models/user'

export const POST = async (req, res) => {
    const {oldEmail, newEmail, confirmEmail, email} = await req.json()
    const You = await User.findOne({email: email})

    try{
        await connectToDb()
        if(!oldEmail || !newEmail  || !confirmEmail){
            return new Response(JSON.stringify('erreur content email'), {status: 400})
        }

        if(oldEmail !== email){
            return new Response(JSON.stringify('erreur same email'), {status: 400})
        }

        if(oldEmail === newEmail){
            return new Response(JSON.stringify('erreur same new email'), {status: 400})
        }

        if(newEmail !== confirmEmail){
            return new Response(JSON.stringify('erreur new & confirm'), {status: 400})
        }

        You.email = newEmail;
        await You.save();


        return new Response(JSON.stringify('email change succeed'), {status: 200})
    }catch (e){
        return new Response(JSON.stringify('error global'), {status: 501})
    }
}