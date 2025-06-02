import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Hadith {
  id: string;
  text: string;
  narrator: string;
  source: string;
  book: string;
  chapter: string;
  grade: string;
  explanation: string;
  references: string[];
}

async function fetchHadithsFromPage(pageNumber: number): Promise<Hadith[]> {
  try {
    // Using the actual Dorar.net search endpoint
    const response = await axios.get(`https://dorar.net/hadith/search?q=&page=${pageNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const hadiths: Hadith[] = [];

    // Updated selectors to match Dorar.net's actual HTML structure
    $('.hadith-item').each((_: number, element: cheerio.Element) => {
      const hadith: Hadith = {
        id: $(element).find('.hadith-number').text().trim(),
        text: $(element).find('.hadith-text').text().trim(),
        narrator: $(element).find('.hadith-narrator').text().trim(),
        source: $(element).find('.hadith-source').text().trim(),
        book: $(element).find('.hadith-book').text().trim(),
        chapter: $(element).find('.hadith-chapter').text().trim(),
        grade: $(element).find('.hadith-grade').text().trim(),
        explanation: $(element).find('.hadith-explanation').text().trim(),
        references: $(element).find('.hadith-references li').map((_: number, el: cheerio.Element) => $(el).text().trim()).get()
      };
      hadiths.push(hadith);
    });

    return hadiths;
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error);
    return [];
  }
}

async function fetchAllHadiths() {
  const allHadiths: Hadith[] = [];
  let pageNumber = 1;
  let hasMorePages = true;
  let retryCount = 0;
  const maxRetries = 3;

  console.log('Starting to fetch hadiths from Dorar.net...');

  while (hasMorePages) {
    try {
      console.log(`Fetching page ${pageNumber}...`);
      const pageHadiths = await fetchHadithsFromPage(pageNumber);
      
      if (pageHadiths.length === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`No hadiths found on page ${pageNumber}, retrying (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          continue;
        }
        hasMorePages = false;
      } else {
        retryCount = 0;
        allHadiths.push(...pageHadiths);
        console.log(`Successfully fetched ${pageHadiths.length} hadiths from page ${pageNumber}`);
        
        // Save progress after each page
        const outputPath = path.join(__dirname, '../data/dorar_hadiths.json');
        fs.writeFileSync(outputPath, JSON.stringify(allHadiths, null, 2), 'utf-8');
        
        // Add a delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1500));
        pageNumber++;
      }
    } catch (error) {
      console.error(`Error on page ${pageNumber}:`, error);
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying page ${pageNumber} (${retryCount}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
        continue;
      }
      hasMorePages = false;
    }
  }

  console.log(`Finished fetching ${allHadiths.length} hadiths`);
  
  // Create a backup copy
  const backupPath = path.join(__dirname, '../data/dorar_hadiths_backup.json');
  fs.copyFileSync(path.join(__dirname, '../data/dorar_hadiths.json'), backupPath);
  
  return allHadiths;
}

// Run the script
fetchAllHadiths().catch(console.error); 