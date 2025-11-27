import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Theme, THEME_VALUES, DEFAULT_THEME } from '../constants/theme';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    theme: Theme;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    theme: {
        type: String,
        enum: THEME_VALUES,
        default: DEFAULT_THEME
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

export default mongoose.model<IUser>('User', userSchema);
