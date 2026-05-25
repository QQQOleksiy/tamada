import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Дозволяємо тільки GET запити
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  // Функція для перевірки та мапінгу локальних зображень
  const mapLocalImages = (menuData) => {
    const actualMenu = menuData.menu || menuData;
    const imagesDir = path.join(process.cwd(), 'public', 'menu-images');

    for (const sectionKey in actualMenu) {
      const section = actualMenu[sectionKey];
      if (section && section.items && Array.isArray(section.items)) {
        section.items.forEach(item => {
          if (item.image && (item.image.includes('cloudinary.com') || item.image.includes('vercel-storage.com'))) {
            try {
              const parts = item.image.split('/');
              const filename = parts[parts.length - 1];
              const cleanFilename = filename.split('?')[0]; // Прибираємо query параметри
              const localFilePath = path.join(imagesDir, cleanFilename);

              // Якщо файл зображення існує локально в проєкті, замінюємо URL на локальний шлях
              if (fs.existsSync(localFilePath)) {
                item.image = `/menu-images/${cleanFilename}`;
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
    // Якщо немає токена Vercel Blob, одразу переходимо до локального файлу
    if (!blobToken) {
      console.warn('BLOB_READ_WRITE_TOKEN is not set, skipping Vercel Blob and using local fallback');
      throw new Error('BLOB_READ_WRITE_TOKEN is missing');
    }

    // Спроба завантажити меню з Vercel Blob
    try {
      console.log('Attempting to list blobs from Vercel Storage...');
      const { blobs } = await list({
        token: blobToken,
      });

      // Шукаємо файли конфігурації меню та сортуємо їх від найновішого до найстарішого
      const menuBlobs = blobs
        .filter(b => b.pathname.startsWith('tamada-menu/menu-data'))
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      const menuBlob = menuBlobs[0];

      if (!menuBlob || !menuBlob.url) {
        throw new Error('Menu data file not found in Vercel Storage');
      }

      console.log('Found latest menu blob:', menuBlob.url);
      const menuResponse = await fetch(menuBlob.url);
      if (!menuResponse.ok) {
        throw new Error(`Failed to fetch menu content from Blob: ${menuResponse.statusText}`);
      }
      
      let menuData = await menuResponse.json();
      
      // Застосовуємо локальну підміну зображень
      menuData = mapLocalImages(menuData);
      
      res.status(200).json({ 
        success: true,
        menu: menuData.menu || menuData,
        source: 'blob'
      });
      return;
    } catch (blobError) {
      console.log('Vercel Blob error, trying local fallback:', blobError.message);
      
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
            warning: 'Vercel Blob failed, loaded local backup'
          });
          return;
        }
      } catch (localError) {
        console.error('Failed to load local fallback:', localError);
      }
      
      // Якщо файл взагалі не знайдено, повертаємо пусте меню
      res.status(200).json({ 
        success: true,
        menu: {},
        source: 'empty',
        warning: 'All storage sources failed'
      });
    }
    
  } catch (error) {
    console.error('Error loading menu:', error);
    res.status(500).json({ 
      error: 'Error loading menu data: ' + (error.message || 'Unknown error'),
      details: error.message
    });
  }
}
