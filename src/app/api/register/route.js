import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

require('dotenv').config()

export async function POST(req) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL);

  if (!body.password || body.password.length < 5) {
    return NextResponse.json({ error: 'Password must be at least 5 characters long' }, { status: 400 });

  }

  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(body.password, salt);

  try {
    const createdUser = await User.create({ ...body, password: hashedPassword });
    return Response.json(createdUser);
  } catch (error) {
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
  }
}