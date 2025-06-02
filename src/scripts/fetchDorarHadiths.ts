import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface Hadith {
  id: string;
  text: string;
  narrator: string;
  source: string;
  book: string;
  chapter: string;
}

async function fetchHadithsFromPage(pageNumber: number): Promise<Hadith[]> {
  try {
    const response = await axios.get(`https://dorar.net/=${pageNumber}`);
    const $ = cheerio.load(response.data);
    const hadiths: Hadith[] = [];

    // Select all hadith containers on the page
    $('.hadith-container').each((_, element) => {
      const hadith: Hadith = {
        id: $(element).find('.hadith-id').text().trim(),
        text: $(element).find('.hadith-text').text().trim(),
        narrator: $(element).find('.hadith-narrator').text().trim(),
        source: $(element).find('.hadith-source').text().trim(),
        book: $(element).find('.hadith-book').text().trim(),
        chapter: $(element).find('.hadith-chapter').text().trim()
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

  console.log('Starting to fetch hadiths...');

  while (hasMorePages) {
    console.log(`Fetching page ${pageNumber}...`);
    const pageHadiths = await fetchHadithsFromPage(pageNumber);
    
    if (pageHadiths.length === 0) {
      hasMorePages = false;
    } else {
      allHadiths.push(...pageHadiths);
      pageNumber++;
      
      // Save progress after each page
      const outputPath = path.join(__dirname, '../data/dorar_hadiths.json');
      fs.writeFileSync(outputPath, JSON.stringify(allHadiths, null, 2), 'utf-8');
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`Finished fetching ${allHadiths.length} hadiths`);
  return allHadiths;
}

// Run the script
fetchAllHadiths().catch(console.error); 