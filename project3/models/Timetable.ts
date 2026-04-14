import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  period: { type: Number, required: true },
  subject: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);