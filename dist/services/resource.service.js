"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = void 0;
const resource_model_1 = require("../models/resource.model");
const appError_1 = require("../utils/appError");
class ResourceService {
    static async create(userId, input, fileUrl, pages) {
        return await resource_model_1.Resource.create({
            user: userId,
            ...input,
            fileUrl,
            pages,
            status: 'Ready',
        });
    }
    static async list(query, requestingUserId) {
        const filter = {};
        if (query.mine === 'true' && requestingUserId) {
            filter.user = requestingUserId;
        }
        if (query.search) {
            filter.title = { $regex: query.search, $options: 'i' };
        }
        if (query.category && query.category !== 'All') {
            filter.category = query.category;
        }
        if (query.subject && query.subject !== 'All') {
            filter.subject = query.subject;
        }
        if (query.status && query.status !== 'All') {
            filter.status = query.status;
        }
        let sortStage = { createdAt: -1 };
        if (query.sort === 'popular')
            sortStage = { downloads: -1 };
        if (query.sort === 'rating')
            sortStage = { rating: -1 };
        const page = parseInt(query.page || '1', 10);
        const pageSize = parseInt(query.pageSize || '8', 10);
        const [data, total] = await Promise.all([
            resource_model_1.Resource.find(filter)
                .sort(sortStage)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .populate('user', 'fullName profilePicture'),
            resource_model_1.Resource.countDocuments(filter),
        ]);
        return {
            data,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }
    static async getById(id) {
        const resource = await resource_model_1.Resource.findById(id).populate('user', 'fullName profilePicture');
        if (!resource) {
            throw new appError_1.AppError('Resource not found', 404);
        }
        return resource;
    }
    static async delete(id, userId) {
        const resource = await resource_model_1.Resource.findById(id);
        if (!resource) {
            throw new appError_1.AppError('Resource not found', 404);
        }
        if (resource.user.toString() !== userId) {
            throw new appError_1.AppError('You are not authorized to delete this resource', 403);
        }
        await resource.deleteOne();
        return resource;
    }
}
exports.ResourceService = ResourceService;
