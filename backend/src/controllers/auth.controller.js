import { loginAuth } from "../services/auth.service.js";
import { success, error } from "../utils/apiResponse.js";

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error("All fields are required");
        }

        const result = await loginAuth(username, password);
        return success(res, result, "Login successful", 201);

    } catch (err) {
        next(err);
    }
}

