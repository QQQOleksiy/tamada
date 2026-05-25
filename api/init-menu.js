import { put, list, del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

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
    // Читаємо дані з локального JSON файлу
    const menuPath = path.join(process.cwd(), 'data', 'tm-menu.json');
    const menuFile = fs.readFileSync(menuPath, 'utf8');
    const menuData = JSON.parse(menuFile);

    // Беремо тільки меню (без обгортки "menu")
    const menuToUpload = menuData.menu || menuData;

    // Завантажуємо меню в Vercel Blob з унікальним суфіксом (щоб обійти кеш)
    const menuJson = JSON.stringify(menuToUpload, null, 2);
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
        console.log('Cleaned up old menu files during init:', oldUrls);
      }
    } catch (cleanupError) {
      console.error('Failed to clean up old menu files:', cleanupError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Full menu data uploaded successfully from tm-menu.json',
      url: blob.url
    });

  } catch (error) {
    console.error('Error uploading menu:', error);
    res.status(500).json({ error: 'Error uploading menu data: ' + error.message });
  }
}