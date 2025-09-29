import { v2 as cloudinary } from 'cloudinary';

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Початкові дані меню
const initialMenuData = {
  "side_dishes": {
    "title": {
      "en": "Side Entree",
      "uk": "Гарніри"
    },
    "items": [
      {
        "en": {
          "name": "Caucasian style potatoes",
          "weight": "250g",
          "price": "99₴"
        },
        "uk": {
          "name": "Картопля по-грузинськи",
          "weight": "300г",
          "price": "129₴"
        }
      },
      {
        "en": {
          "name": "Homemade potatoes",
          "weight": "250g",
          "price": "99₴"
        },
        "uk": {
          "name": "Картопля по-домашньому",
          "weight": "300г",
          "price": "129₴"
        }
      }
    ]
  },
  "salads_and_cold_appetizers": {
    "title": {
      "en": "Salads & Cold Appetizers",
      "uk": "Салати та холодні закуски"
    },
    "items": [
      {
        "en": {
          "name": "Georgian Salad with walnuts",
          "weight": "280g",
          "price": "229₴"
        },
        "uk": {
          "name": "Салат грузинський",
          "description": "(огірок, помідор, горіх.паста)",
          "weight": "300г",
          "price": "259₴"
        }
      }
    ]
  }
};

export default async function handler(req, res) {
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Завантажуємо початкові дані в Cloudinary
    const menuJson = JSON.stringify(initialMenuData, null, 2);
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
      message: 'Initial menu data uploaded successfully',
      url: result.secure_url
    });
    
  } catch (error) {
    console.error('Error uploading initial menu:', error);
    res.status(500).json({ error: 'Error uploading initial menu data: ' + error.message });
  }
}
