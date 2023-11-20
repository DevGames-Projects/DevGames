import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        require: [true, 'Email is required']
    },
    username: {
        type: String,
        unique: [true, 'Username already exists'],
        match: [/^[a-zA-Z0-9._-]{4,20}$/, "Username invalid, it should contain 4-20 alphanumeric letters and be unique!"]
    },
    password: {
        type: String,
        require: [true, 'Password already exists']
    },
    level: {
        type: Number,
        default: 1
    },

})

const User = models.User || model('User', UserSchema)

export default User