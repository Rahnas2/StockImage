type LoginData = {
    email: string;
    password: string;
};
export const validateLogin = (data: LoginData) => {
    const { email, password } = data;
    console.log('herer ', data)

    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return "Valid email is required";
    if (!password.trim()) return "Password is required";

    return null;
};
