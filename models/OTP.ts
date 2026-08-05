import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema<IOTP> = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // Mongoose TTL index automatically removes expired docs
    },
  },
  {
    timestamps: true,
  }
);

export const OTP: Model<IOTP> =
  mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
