// import { authController } from "../controllers/auth.controller.js";

// Route 공통
const createRouteOptions = ({ summary, description, response }) => ({
    schema: {
        tags: ["인증"],
        summary,
        description,
        response,
    },
});

const authRoutes = async (app) => {
    
};

export default authRoutes;