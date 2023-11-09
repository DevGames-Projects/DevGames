import mongoose from "mongoose";

let isConnected = false

export const connectToDb = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected){
        console.log('Déja Connecter')
        return
    }else{

        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: 'DevGames',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })

            isConnected = true

            console.log('Vous etes connecter')
        }catch (e) {
            console.error(e)
        }
    }
}