const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
    },
    name: String,
    photoURL: String,
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password should be at least 8 characters long.'],
      maxlength: [24, 'Password should not exceed 24 characters.'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['admin', 'primary', 'leader', 'member'],
      default: 'member',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.name = `${this.firstName} ${this.lastName}`;
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.generateToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    role: this.role,
    email: this.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

UserSchema.methods.generateRefreshToken = function () {
  const payload = {
    id: this._id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REF_EXPIRES_IN,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
