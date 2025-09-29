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

  // Перевіряємо Environment Variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Environment check:', {
    cloudName: cloudName ? 'SET' : 'NOT SET',
    apiKey: apiKey ? 'SET' : 'NOT SET',
    apiSecret: apiSecret ? 'SET' : 'NOT SET'
  });

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary environment variables');
    return res.status(500).json({ 
      error: 'Cloudinary configuration missing',
      details: {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      }
    });
  }

  try {
    // Спочатку спробуємо завантажити меню з Cloudinary
    try {
      console.log('Attempting to load menu from Cloudinary...');
      const result = await cloudinary.api.resource('tamada-menu/menu-data', {
        resource_type: 'raw'
      });

      console.log('Cloudinary result:', result);

      if (!result || !result.secure_url) {
        throw new Error('Invalid response from Cloudinary');
      }

      // Завантажуємо вміст файлу за URL
      const menuResponse = await fetch(result.secure_url);
      if (!menuResponse.ok) {
        throw new Error(`Failed to fetch menu content: ${menuResponse.statusText}`);
      }
      const menuData = await menuResponse.json();
      
      res.status(200).json({ 
        success: true,
        menu: menuData,
        source: 'cloudinary'
      });
      return;
    } catch (cloudinaryError) {
      console.log('Cloudinary error:', cloudinaryError);
      
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
    res.status(500).json({ 
      error: 'Error loading menu data: ' + (error.message || 'Unknown error'),
      details: error
    });
  }
}
