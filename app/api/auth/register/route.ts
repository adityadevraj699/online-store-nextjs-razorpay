import { connectTODatabase } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
export async function POST(request: NextRequest){
    try {
        
        const {email, password } = await request.json();
        if(!email || !password){
            return NextResponse.json({error: "Email and password are required"}, {status: 400});
        }
        await connectTODatabase();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({email, password: hashedPassword});
        await user.save();
        return NextResponse.json({message: "User created"});




    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 501});
    }
}