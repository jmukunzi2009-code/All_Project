import mongoose from 'mongoose';

const AcademicResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
}, { timestamps: true });

export default mongoose.models.AcademicResult || mongoose.model('AcademicResult', AcademicResultSchema);