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
    // Спочатку спробуємо завантажити меню з Cloudinary
    try {
      const result = await cloudinary.api.resource('tamada-menu/menu-data', {
        resource_type: 'raw'
      });

      // Конвертуємо base64 в JSON
      const menuData = JSON.parse(Buffer.from(result.bytes, 'base64').toString());
      
      res.status(200).json({ 
        success: true,
        menu: menuData,
        source: 'cloudinary'
      });
      return;
    } catch (cloudinaryError) {
      // Якщо файл не знайдено в Cloudinary, повертаємо порожнє меню
      if (cloudinaryError.http_code === 404) {
        console.log('Menu not found in Cloudinary, returning empty menu');
        
        res.status(200).json({ 
          success: true,
          menu: {},
          source: 'empty'
        });
        return;
      } else {
        throw cloudinaryError;
      }
    }
    
  } catch (error) {
    console.error('Error loading menu:', error);
    res.status(500).json({ error: 'Error loading menu data: ' + error.message });
  }
}
