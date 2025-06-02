import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '$2y$10$7NhGyC1Ljp9y2DGF6wx6CeyOE34FVy0WOnrMHYhA87H056nHHaWi';
const BASE_URL = `https://hadithapi.com/api/hadiths/?apiKey=${API_KEY}`;

// Initialize database
const db = new Database(path.join(__dirname, '../data/hadiths.db'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS hadiths (
    id TEXT PRIMARY KEY,
    hadithKey TEXT,
    hadithArabic TEXT,
    hadithEnglish TEXT,
    book TEXT,
    chapter TEXT,
    reference TEXT,
    grade TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_hadith_key ON hadiths(hadithKey);
  CREATE INDEX IF NOT EXISTS idx_book ON hadiths(book);
  CREATE INDEX IF NOT EXISTS idx_chapter ON hadiths(chapter);
`);

interface Hadith {
  id: string;
  hadithKey: string;
  hadithArabic: string;
  hadithEnglish: string;
  book: string;
  chapter: string;
  reference: string;
  grade: string;
}

async function fetchHadithsFromAPI(page: number = 1): Promise<{ hadiths: Hadith[], hasNext: boolean, total: number }> {
  try {
    console.log(`Fetching page ${page}...`);
    const response = await axios.get(BASE_URL + `&page=${page}&limit=100`);
    
    if (response.data && response.data.data) {
      const hadiths = response.data.data.hadiths.map((h: any) => ({
        id: h.id,
        hadithKey: h.hadithKey,
        hadithArabic: h.hadithArabic,
        hadithEnglish: h.hadithEnglish,
        book: h.book,
        chapter: h.chapter,
        reference: h.reference,
        grade: h.grade
      }));

      const hasNext = !!response.data.data.nextPageUrl;
      const total = response.data.data.total || 0;
      
      console.log(`Fetched ${hadiths.length} hadiths from page ${page}`);
      return { hadiths, hasNext, total };
    }
    return { hadiths: [], hasNext: false, total: 0 };
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return { hadiths: [], hasNext: false, total: 0 };
  }
}

function saveHadithsToDatabase(hadiths: Hadith[]) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO hadiths (
      id, hadithKey, hadithArabic, hadithEnglish,
      book, chapter, reference, grade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((hadiths: Hadith[]) => {
    for (const hadith of hadiths) {
      stmt.run(
        hadith.id,
        hadith.hadithKey,
        hadith.hadithArabic,
        hadith.hadithEnglish,
        hadith.book,
        hadith.chapter,
        hadith.reference,
        hadith.grade
      );
    }
  });

  insertMany(hadiths);
}

async function fetchAllHadiths() {
  let page = 1;
  let hasNext = true;
  let totalHadiths = 0;
  let totalPages = 0;

  console.log('Starting to fetch hadiths from HadithAPI.com...');

  while (hasNext) {
    const { hadiths, hasNext: next, total } = await fetchHadithsFromAPI(page);
    
    if (hadiths.length === 0) {
      console.log('No more hadiths to fetch.');
      break;
    }
    
    saveHadithsToDatabase(hadiths);
    totalHadiths += hadiths.length;
    
    if (total && !totalPages) {
      totalPages = Math.ceil(total / 100);
      console.log(`Total hadiths to fetch: ${total} (${totalPages} pages)`);
    }
    
    console.log(`Progress: ${totalHadiths} hadiths saved (Page ${page}/${totalPages})`);
    
    // Add a delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    page++;
    hasNext = next;
  }

  console.log(`Finished fetching and saving ${totalHadiths} hadiths to database`);
  
  // Create a backup of the database
  const backupPath = path.join(__dirname, '../data/hadiths_backup.db');
  fs.copyFileSync(path.join(__dirname, '../data/hadiths.db'), backupPath);
  console.log(`Database backup created at: ${backupPath}`);
  
  return totalHadiths;
}

// Run the script
fetchAllHadiths().catch(console.error); 