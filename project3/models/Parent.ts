import mongoose from 'mongoose';

const ParentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: String, required: true, unique: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  relationship: { type: String, enum: ['father', 'mother', 'guardian'] },
}, { timestamps: true });

export default mongoose.models.Parent || mongoose.model('Parent', ParentSchema);