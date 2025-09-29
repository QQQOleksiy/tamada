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
      // Якщо файл не знайдено в Cloudinary, завантажуємо з локального файлу
      if (cloudinaryError.http_code === 404) {
        console.log('Menu not found in Cloudinary, loading from local file...');
        
        // Читаємо локальний файл меню
        const menuPath = path.join(process.cwd(), 'data', 'tm-menu.json');
        const menuFile = fs.readFileSync(menuPath, 'utf8');
        const menuData = JSON.parse(menuFile);
        
        // Завантажуємо меню в Cloudinary для майбутнього використання
        try {
          const menuJson = JSON.stringify(menuData.menu || menuData, null, 2);
          await cloudinary.uploader.upload(
            `data:application/json;base64,${Buffer.from(menuJson).toString('base64')}`,
            {
              folder: 'tamada-menu',
              resource_type: 'raw',
              public_id: 'menu-data',
              overwrite: true,
            }
          );
          console.log('Menu uploaded to Cloudinary successfully');
        } catch (uploadError) {
          console.error('Error uploading menu to Cloudinary:', uploadError);
        }
        
        res.status(200).json({ 
          success: true,
          menu: menuData.menu || menuData,
          source: 'local'
        });
        return;
      } else {
        throw cloudinaryError;
      }
    }
    
  } catch (error) {
    console.error('Error loading menu:', error);
    res.status(500).json({ error: 'Error loading menu data' });
  }
}
