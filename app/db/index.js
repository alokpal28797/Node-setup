import mongoose from "mongoose"


export const connectDb = async () => {
    try {
        const database = await mongoose.connect(`${process.env.DATABASE_URL}/nodeSetup`)
    } catch (error) {
        process.exit(1)

    }
}