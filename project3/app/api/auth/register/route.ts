import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Parent from '@/models/Parent';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { name, email, password, role, ...details } = await request.json();

  // In production, check if requester is admin via token
  // For now, allow

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    let profile;
    if (role === 'student') {
      profile = new Student({ user: user._id, ...details });
      await profile.save();
      user.studentId = profile._id;
    } else if (role === 'teacher') {
      profile = new Teacher({ user: user._id, ...details });
      await profile.save();
      user.teacherId = profile._id;
    } else if (role === 'parent') {
      profile = new Parent({ user: user._id, ...details });
      await profile.save();
      user.parentId = profile._id;
    }

    await user.save();

    return NextResponse.json({ message: 'User created successfully', user: { id: user._id, name, role } });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}