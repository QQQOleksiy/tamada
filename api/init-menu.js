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
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Читаємо дані з локального JSON файлу
    const menuPath = path.join(process.cwd(), 'data', 'tm-menu.json');
    const menuFile = fs.readFileSync(menuPath, 'utf8');
    const menuData = JSON.parse(menuFile);
    
    // Беремо тільки меню (без обгортки "menu")
    const menuToUpload = menuData.menu || menuData;

    // Завантажуємо меню в Cloudinary
    const menuJson = JSON.stringify(menuToUpload, null, 2);
    const result = await cloudinary.uploader.upload(
      `data:application/json;base64,${Buffer.from(menuJson).toString('base64')}`,
      {
        folder: 'tamada-menu',
        resource_type: 'raw',
        public_id: 'menu-data',
        overwrite: true,
      }
    );

    res.status(200).json({ 
      success: true,
      message: 'Full menu data uploaded successfully from tm-menu.json',
      url: result.secure_url
    });
    
  } catch (error) {
    console.error('Error uploading menu:', error);
    res.status(500).json({ error: 'Error uploading menu data: ' + error.message });
  }
}