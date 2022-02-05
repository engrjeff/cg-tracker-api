const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A series should be added by a registered user.'],
    },
    title: {
      type: String,
      required: [true, 'Series title is required.'],
      trim: true,
    },
    tags: {
      type: [String],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

SeriesSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'series',
  justOne: false,
});

const Series = mongoose.model('Series', SeriesSchema);

module.exports = Series;
