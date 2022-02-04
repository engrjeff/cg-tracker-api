const mongoose = require('mongoose');

const DiscipleSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A disciple should be added by a leader.'],
    },
    userDocId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [
        function () {
          return !this.isAddedManually;
        },
        'A disciple added through a registration link must be a registered user.',
      ],
    },
    lessonsTaken: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
    },
    address: String,
    birthdate: Date,
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    cellStatus: {
      type: String,
      enum: ['1T', '2T', '3T', '4T', 'R'],
      default: '1T',
    },
    churchStatus: {
      type: String,
      enum: ['NACS', 'ACS', 'CICS'],
      default: 'NACS',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isDeleted: { type: Boolean, default: false },
    isAddedManually: Boolean,
  },
  { timestamps: true }
);

const Disciple = mongoose.model('Disciple', DiscipleSchema);

module.exports = Disciple;
