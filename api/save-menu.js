export default function handler(req, res) {
  // Дозволяємо тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const menuData = req.body;
    
    // Тут ми будемо зберігати меню в файлі
    // Для Vercel це буде тимчасове сховище
    // В реальному проєкті краще використовувати базу даних
    
    // Поки що просто повертаємо успіх
    res.status(200).json({ 
      success: true, 
      message: 'Menu data saved successfully',
      data: menuData 
    });
    
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ error: 'Error saving menu data' });
  }
}
