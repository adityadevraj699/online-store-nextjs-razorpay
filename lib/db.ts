/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';




const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error('MONGODB_URI is not defined');
}


let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectTODatabase() {
    if(cached.conn){
        console.log("DataBase  is already connected");
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose.connection;
    });

    try {
        cached.conn = await cached.promise;
        console.log('Database connected successfully');
    } catch (error) {
        cached.promise = null;
    }

    return cached.conn;
}
}