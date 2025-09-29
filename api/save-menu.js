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
    const menuData = req.body;
    
    // Конвертуємо меню в JSON рядок
    const menuJson = JSON.stringify(menuData, null, 2);
    
    // Завантажуємо JSON файл в Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(menuJson).toString('base64')}`,
      {
        folder: 'tamada-menu',
        resource_type: 'raw',
        public_id: 'menu-data',
        overwrite: true, // Перезаписуємо існуючий файл
      }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Menu data saved successfully',
      url: result.secure_url
    });
    
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ error: 'Error saving menu data' });
  }
}
