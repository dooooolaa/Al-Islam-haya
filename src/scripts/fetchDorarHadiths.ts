import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'ضع_مفتاحك_هنا';
const BASE_URL = `https://hadithapi.com/api/hadiths/?apiKey=${API_KEY}`;

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

async function fetchHadithsFromAPI(page: number = 1): Promise<{ hadiths: Hadith[], hasNext: boolean }> {
  try {
    const response = await axios.get(BASE_URL + `&page=${page}`);
    if (response.data && response.data.data && response.data.data.hadiths) {
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
      return { hadiths, hasNext };
    }
    return { hadiths: [], hasNext: false };
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return { hadiths: [], hasNext: false };
  }
}

async function fetchAllHadiths() {
  const allHadiths: Hadith[] = [];
  let page = 1;
  let hasNext = true;

  console.log('Starting to fetch hadiths from HadithAPI.com...');

  while (hasNext) {
    console.log(`Fetching page ${page}...`);
    const { hadiths, hasNext: next } = await fetchHadithsFromAPI(page);
    if (hadiths.length === 0) break;
    allHadiths.push(...hadiths);
    // Save progress after each page
    const outputPath = path.join(__dirname, '../data/hadithapi_hadiths.json');
    fs.writeFileSync(outputPath, JSON.stringify(allHadiths, null, 2), 'utf-8');
    await new Promise(resolve => setTimeout(resolve, 1000));
    page++;
    hasNext = next;
  }

  console.log(`Finished fetching ${allHadiths.length} hadiths`);
  return allHadiths;
}

// Run the script
fetchAllHadiths().catch(console.error); 