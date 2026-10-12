import axios from 'axios';
import FormData from 'form-data';
import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary if credentials are provided in env
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// @desc    Upload single image to ImgBB or Cloudinary
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype } = req.file;

    // 1. Try ImgBB if IMGBB_API_KEY is configured
    if (process.env.IMGBB_API_KEY) {
      try {
        const formData = new FormData();
        formData.append('image', buffer.toString('base64'));

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        );

        if (response.data && response.data.data && response.data.data.url) {
          return res.json({
            success: true,
            provider: 'imgbb',
            url: response.data.data.display_url || response.data.data.url,
            delete_url: response.data.data.delete_url,
          });
        }
      } catch (imgbbErr) {
        console.warn('ImgBB upload error:', imgbbErr.response?.data || imgbbErr.message);
        // Fall through to next provider if ImgBB failed
      }
    }

    // 2. Try Cloudinary if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const streamUpload = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'portfolio',
                resource_type: 'image',
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            stream.write(buffer);
            stream.end();
          });
        };

        const result = await streamUpload();
        return res.json({
          success: true,
          provider: 'cloudinary',
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (cloudinaryErr) {
        console.warn('Cloudinary upload error:', cloudinaryErr.message);
        // Fall through to fallback
      }
    }

    // 3. Fallback: Base64 Data URI (works instantly out-of-the-box without external API keys!)
    const base64DataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
    return res.json({
      success: true,
      provider: 'base64_fallback',
      url: base64DataUri,
      message: 'Uploaded via Base64 fallback. Add IMGBB_API_KEY or CLOUDINARY credentials in .env for external cloud hosting.',
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
