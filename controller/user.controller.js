import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import CustomError from "../utils/CustomError.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
};

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email }});
        if (existingUser) {
            throw new CustomError("User already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email }});
        if (!user) {
            throw new CustomError("Invalid credentials", 401);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new CustomError("Invalid credentials", 401);
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        });
        res.cookie("accessToken", token, cookieOptions).json({ token });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res) => {



    try {
        res.clearCookie("accessToken", cookieOptions);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" }); // Or handle the error more gracefully.
    }
};

