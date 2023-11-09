import bcrypt from "bcrypt";
import User from "@/models/user";
import {connectToDb} from "@/utils/database";

export const POST = async (req, res) => {
    const {email, password, username} = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)


    try {
        await connectToDb()
        const userExist = await User.find({email : email})
        const usernameExist = await User.find({username: username})


        if(!username){
            return new Response(JSON.stringify('erreur username'), {status: 400})
        }
        if(usernameExist.length > 0){
            return new Response(JSON.stringify('erreur username exist'), {status: 400})
        }
        if(!email){
            return new Response(JSON.stringify('erreur email'), {status: 400})
        }
        if(!password || password.length < 8){
            return new Response(JSON.stringify('erreur password'), {status: 400})
        }
        if (userExist.length > 0){
            return new Response(JSON.stringify('erreur user'), {status: 400})
        }

        const newUser = new User({
            email: email,
            username: username,
            password: hashedPassword,
            level: []
        })


        await newUser.save()
        return new Response(JSON.stringify(newUser), {status: 200})

    }catch (e){
        return new Response(JSON.stringify(e), {status: 501})
    }
}