import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  grade: { type: String, required: true },
  class: { type: String, required: true },
  dateOfBirth: { type: Date },
  address: { type: String },
  phone: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);