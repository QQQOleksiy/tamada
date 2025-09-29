import { v2 as cloudinary } from 'cloudinary';

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  // Дозволяємо тільки GET запити
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Спробуємо завантажити меню з Cloudinary
    const result = await cloudinary.api.resource('tamada-menu/menu-data', {
      resource_type: 'raw'
    });

    // Конвертуємо base64 в JSON
    const menuData = JSON.parse(Buffer.from(result.bytes, 'base64').toString());
    
    res.status(200).json({ 
      success: true,
      menu: menuData
    });
    
  } catch (error) {
    // Якщо файл не знайдено, повертаємо порожнє меню
    if (error.http_code === 404) {
      res.status(200).json({ 
        success: true,
        menu: {}
      });
    } else {
      console.error('Error loading menu:', error);
      res.status(500).json({ error: 'Error loading menu data' });
    }
  }
}
