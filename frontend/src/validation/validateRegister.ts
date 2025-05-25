import type { user } from "@/Types/user";

type RegisterData = Omit<user, '_id'> & { confirmPassword: string };

export const validateRegister = (data: RegisterData) => {
    const { name, email, mobile, password, confirmPassword } = data;

    if (!name.trim()) return "Name is required";
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Valid email is required";
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) return "Valid 10-digit mobile number is required";
    if (!password?.trim() || password.trim().length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
};