import { v2 as cloudinary } from 'cloudinary';

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Завантажуємо зображення в Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'tamada-menu',
      resource_type: 'auto',
    });

    res.status(200).json({ 
      success: true,
      filePath: result.secure_url,
      publicId: result.public_id
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
}

// Відключаємо body parsing для цього API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
