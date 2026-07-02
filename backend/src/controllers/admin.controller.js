import * as adminService from "../services/admin.service.js";

export const getEvents = async (req, res, next) => {

    try {

        const result = await adminService.getAllEvents(req.query);

        res.json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }

};

export const dashboard = async (req, res, next) => {

    try {

        const stats = await adminService.dashboardStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (err) {
        next(err);
    }

};

export const permanentDelete = async (req, res, next) => {

    try {

        await adminService.permanentDelete(req.params.id);

        res.json({
            success: true,
            message: "Event permanently deleted."
        });

    } catch (err) {
        next(err);
    }

};