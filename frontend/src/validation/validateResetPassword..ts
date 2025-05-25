
export const validateResetPassword = (otp: string, password: string, confirmPassword: string) => {
    if (!otp.trim()) return 'otp is required'
    if (!password.trim() || password.trim().length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    return null
}