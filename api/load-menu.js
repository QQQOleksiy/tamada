import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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

  // Функція для перевірки та мапінгу локальних зображень
  const mapLocalImages = (menuData) => {
    const actualMenu = menuData.menu || menuData;
    const imagesDir = path.join(process.cwd(), 'public', 'menu-images');

    for (const sectionKey in actualMenu) {
      const section = actualMenu[sectionKey];
      if (section && section.items && Array.isArray(section.items)) {
        section.items.forEach(item => {
          if (item.image && item.image.includes('cloudinary.com')) {
            try {
              const parts = item.image.split('/');
              const filename = parts[parts.length - 1];
              const localFilePath = path.join(imagesDir, filename);

              // Якщо файл зображення існує локально в проєкті, замінюємо URL на локальний шлях
              if (fs.existsSync(localFilePath)) {
                item.image = `/menu-images/${filename}`;
              }
            } catch (err) {
              console.error('Error mapping local image:', err);
            }
          }
        });
      }
    }
    return menuData;
  };

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
      let menuData = await menuResponse.json();
      
      // Застосовуємо локальну підміну зображень
      menuData = mapLocalImages(menuData);
      
      res.status(200).json({ 
        success: true,
        menu: menuData.menu || menuData,
        source: 'cloudinary'
      });
      return;
    } catch (cloudinaryError) {
      console.log('Cloudinary error, trying local fallback:', cloudinaryError);
      
      // Спроба завантажити локальний файл меню як резервний варіант
      try {
        const menuPath = path.join(process.cwd(), 'data', 'tm-menu.json');
        if (fs.existsSync(menuPath)) {
          console.log('Found local menu backup, loading...');
          const menuFile = fs.readFileSync(menuPath, 'utf8');
          let menuData = JSON.parse(menuFile);
          
          // Застосовуємо локальну підміну зображень
          menuData = mapLocalImages(menuData);
          const menuToReturn = menuData.menu || menuData;
          
          res.status(200).json({ 
            success: true,
            menu: menuToReturn,
            source: 'local_fallback',
            warning: 'Cloudinary failed, loaded local backup'
          });
          return;
        }
      } catch (localError) {
        console.error('Failed to load local fallback:', localError);
      }
      
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
