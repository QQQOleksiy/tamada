import { put, list, del } from '@vercel/blob';

export default async function handler(req, res) {
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    console.error('Missing BLOB_READ_WRITE_TOKEN env variable');
    return res.status(500).json({ error: 'Vercel Blob configuration missing' });
  }

  try {
    const menuData = req.body;
    
    // Конвертуємо меню в JSON рядок
    const menuJson = JSON.stringify(menuData, null, 2);
    
    // Завантажуємо JSON файл в Vercel Blob з унікальним суфіксом (щоб обійти кеш)
    const blob = await put('tamada-menu/menu-data.json', menuJson, {
      contentType: 'application/json',
      access: 'public',
      addRandomSuffix: true,
      token: blobToken,
    });

    // Очищаємо старі файли меню в сховищі, щоб не накопичувати сміття
    try {
      const { blobs } = await list({ token: blobToken });
      const oldBlobs = blobs
        .filter(b => b.pathname.startsWith('tamada-menu/menu-data') && b.url !== blob.url);
      
      if (oldBlobs.length > 0) {
        const oldUrls = oldBlobs.map(b => b.url);
        await del(oldUrls, { token: blobToken });
        console.log('Cleaned up old menu files:', oldUrls);
      }
    } catch (cleanupError) {
      console.error('Failed to clean up old menu files:', cleanupError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Menu data saved successfully',
      url: blob.url
    });
    
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ error: 'Error saving menu data: ' + error.message });
  }
}
