import {connectToDb} from "@/utils/database";
import User from "@/models/user";

export const POST = async (req, res) => {
    const {email} = await req.json()

    try {
        await connectToDb()

        await User.deleteOne({email})
        return new Response(JSON.stringify('Account Delete'), {status: 200})
    }catch (e){
        return new Response(JSON.stringify('global error'), {status: 500})
    }
}