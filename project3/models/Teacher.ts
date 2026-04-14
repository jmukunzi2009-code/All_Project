import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: String, required: true, unique: true },
  subjects: [{ type: String }],
  classes: [{ type: String }],
  department: { type: String },
  hireDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);