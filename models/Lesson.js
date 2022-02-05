const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A series should be added by a registered user.'],
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Series',
      required: [true, 'A lesson should be added inside a Series.'],
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required.'],
      trim: true,
    },
    references: [String],
    fileURL: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
