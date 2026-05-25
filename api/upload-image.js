import { put } from '@vercel/blob';

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
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    let buffer;
    let contentType = 'image/jpeg';
    let filename = 'image.jpg';

    // Перевіряємо, чи це base64 рядок
    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contentType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        
        // Визначаємо розширення
        const ext = contentType.split('/')[1] || 'jpg';
        filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      } else {
        throw new Error('Invalid base64 format');
      }
    } else {
      // Якщо це чистий base64
      buffer = Buffer.from(image, 'base64');
      filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;
    }

    // Завантажуємо зображення в Vercel Blob
    const blob = await put(`tamada-menu/${filename}`, buffer, {
      contentType,
      access: 'public',
      token: blobToken,
    });

    res.status(200).json({ 
      success: true,
      filePath: blob.url,
      publicId: blob.url // Використовуємо URL як publicId
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image: ' + error.message });
  }
}

// Відключаємо body parsing для цього API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
