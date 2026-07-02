import * as eventService from "../services/event.service.js";

export const createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(
            req.user.userId,
            req.body,
            req.files
        );

        res.status(201).json({
            success: true,
            data: event,
        });
    } catch (err) {
        next(err);
    }
};

export const getPublishedEvents = async (req, res, next) => {
    try {
        const { page = "1", limit = "10", search = "" } = req.query;

        const timezone = req.headers["x-timezone"] || "UTC";

        const events = await eventService.getPublishedEvents(
            timezone,
            Number(page),
            Number(limit),
            search
        );

        res.status(200).json({
            success: true,
            data: events,
        });
    } catch (error) {
        next(error);
    }
};

export const softDelete = async (req, res, next) => {
    try {
        await eventService.deleteEvent(req.params.id);

        res.status(200).json({
            success: true,
            message: "Soft deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const permanentDelete = async (req, res, next) => {
    try {
        await eventService.permanentDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Permanently deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

export const adminEvents = async (req, res, next) => {
    try {
        const events = await eventService.adminEvents(req.query.status);

        res.status(200).json({
            success: true,
            data: events,
        });
    } catch (err) {
        next(err);
    }
};