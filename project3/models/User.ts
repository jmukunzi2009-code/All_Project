import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], required: true },
  // Additional fields based on role
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // for students
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }, // for teachers
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }, // for parents
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);