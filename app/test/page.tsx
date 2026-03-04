import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"

export default async function DBTestPage() {
    try {
        await connectDB()

        return (
            <div className="p-10 font-mono">
                <h1 className="text-2xl font-bold text-green-600">
                    ✅ MongoDB Connected Successfully
                </h1>

                <p className="mt-4">
                    Connection State: {mongoose.connection.readyState}
                </p>

                <p className="mt-2 text-gray-600">
                    0 = disconnected <br />
                    1 = connected <br />
                    2 = connecting <br />
                    3 = disconnecting
                </p>
            </div>
        )
    } catch (error: any) {
        return (
            <div className="p-10 font-mono">
                <h1 className="text-2xl font-bold text-red-600">
                    ❌ MongoDB Connection Failed
                </h1>

                <pre className="mt-4 bg-red-100 p-4 rounded text-red-700">
                    {error.message}
                </pre>
            </div>
        )
    }
}