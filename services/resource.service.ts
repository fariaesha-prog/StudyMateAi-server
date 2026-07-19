import { Resource } from '../models/resource.model';
import { AppError } from '../utils/appError';
import { CreateResourceInput, ResourceQuery } from '../types/resource.interface';

export class ResourceService {
  public static async create(
    userId: string,
    input: CreateResourceInput,
    fileUrl: string,
    pages: number
  ) {
    return await Resource.create({
      user: userId,
      ...input,
      fileUrl,
      pages,
      status: 'Ready',
    });
  }

  public static async list(query: ResourceQuery, requestingUserId?: string) {
    const filter: Record<string, any> = {};

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

    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (query.sort === 'popular') sortStage = { downloads: -1 };
    if (query.sort === 'rating') sortStage = { rating: -1 };

    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '8', 10);

    const [data, total] = await Promise.all([
      Resource.find(filter)
        .sort(sortStage)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('user', 'fullName profilePicture'),
      Resource.countDocuments(filter),
    ]);

    return {
      data,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  public static async getById(id: string) {
    const resource = await Resource.findById(id).populate('user', 'fullName profilePicture');
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    return resource;
  }

  public static async delete(id: string, userId: string) {
    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    if (resource.user.toString() !== userId) {
      throw new AppError('You are not authorized to delete this resource', 403);
    }
    await resource.deleteOne();
    return resource;
  }
}