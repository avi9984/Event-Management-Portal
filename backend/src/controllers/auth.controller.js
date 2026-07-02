import { loginAuth, logoutService } from "../services/auth.service.js";
import { success, error } from "../utils/apiResponse.js";

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return error(res, "All fields are required", 400);
        }

        const result = await loginAuth(username, password);
        return success(res, result, "Login successful", 200);

    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        await logoutService(req.user);

        return success(res, null, "Logout successful", 200);
    } catch (err) {
        next(err);
    }
};