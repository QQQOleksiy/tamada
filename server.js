const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;

// Папка для даних користувача (меню, зображення)
const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(dataDir, 'uploads');

// Створюємо папки, якщо їх не існує
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Налаштування Multer для збереження файлів
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));

// Віддаємо статичні файли React-додатку
app.use(express.static(path.join(__dirname, 'build')));


app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post('/api/save-menu', (req, res) => {
    const menuData = req.body;
    const filePath = path.join(dataDir, 'tm-menu.json');

    // Обертаємо дані в об'єкт з ключем "menu"
    const dataToWrite = { menu: menuData };

    fs.writeFile(filePath, JSON.stringify(dataToWrite, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error saving menu data.');
        }
        res.send('Menu data saved successfully.');
    });
});

// Обробка всіх інших запитів - віддаємо React-додаток
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
