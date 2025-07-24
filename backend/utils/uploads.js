// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crea cartella uploads se non esiste
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    // Mantieni estensione e aggiungi timestamp per unicità
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${name}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
