import mongoose from "mongoose"


export const connectDb = async () => {
    try {

        const database = await mongoose.connect(`${process.env.DATABASE_URL}/nodeSetup`)
        console.log("🚀 ~ connectDb ~ database DB Host :", database.connection.host )

    } catch (error) {
        console.log("🚀 ~ connectDb ~ error:", error)
        process.exit(1)

    }
}