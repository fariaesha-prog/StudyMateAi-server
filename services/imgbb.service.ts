import axios from 'axios';
import FormData from 'form-data';
import { AppError } from '../utils/appError';

export class ImgbbService {
  public static async uploadImage(fileBuffer: Buffer, fileName: string): Promise<string> {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      throw new AppError('Image upload service is not configured', 500);
    }

    const form = new FormData();
    form.append('image', fileBuffer.toString('base64'));
    form.append('name', fileName);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        form,
        { headers: form.getHeaders() }
      );

      const imageUrl = response.data?.data?.url;
      if (!imageUrl) {
        throw new AppError('ImgBB did not return an image URL', 502);
      }

      return imageUrl;
    } catch (error) {
      throw new AppError('Failed to upload image to ImgBB', 502);
    }
  }
}