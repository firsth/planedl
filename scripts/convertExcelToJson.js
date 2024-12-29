import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Excel dosyasını oku
const workbook = XLSX.readFile(path.join(__dirname, '../ucak_modelleri_cleaned.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// JSON'a çevir
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Veriyi düzenle
const cleanedData = jsonData.map(plane => ({
    model: String(plane['Uçak Modeli'] || ''),
    manufacturer: String(plane['Üretici'] || ''),
    maxRange: Number(plane['Max Range (km)'] || 0),
    engineCount: Number(plane['Motor Sayısı'] || 0),
    productionYear: Number(plane['Üretim Yılı'] || 0),
    totalProduced: Number(plane['Üretim Miktarı'] || 0)
}));

// JSON dosyasını oluştur
const outputPath = path.join(__dirname, '../src/data/planes.json');

// Dizin yoksa oluştur
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// JSON dosyasını yaz
fs.writeFileSync(
    outputPath,
    JSON.stringify(cleanedData, null, 2),
    'utf-8'
);

console.log('JSON dosyası başarıyla oluşturuldu:', outputPath); 