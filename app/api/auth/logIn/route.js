import {connectToDb} from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";

export const POST = async (req, res) => {
    const {email, password} = await req.json()
    let isSamePassword = null

    try {
        await connectToDb()

        if(!email && !password){
            return new Response(JSON.stringify('erreur email and password'), { status: 500})
        }

        if(!email){
            return new Response(JSON.stringify('erreur email'), { status: 500})
        }

        if(!password || password.length < 8){
            return new Response(JSON.stringify('erreur password'), { status: 500})
        }


        const userExist = await User.find({email : email})

        if (userExist.length > 0){
            isSamePassword =  await bcrypt.compare(password, userExist[0].password)
        }

        if(userExist.length === 0 || !isSamePassword){
            return new Response(JSON.stringify("erreur user"), { status: 500})
        }


        return new Response(JSON.stringify(userExist), {status: 200})
    }catch (e){
        return new Response(JSON.stringify(e), {status: 501})
    }
}