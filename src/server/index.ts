import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Initialize database
const db = new Database(path.join(__dirname, '../../data/hadiths.db'));

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/hadiths/search', (req, res) => {
  const { query, book, chapter, page = 1, limit = 20 } = req.query;
  
  let sql = 'SELECT * FROM hadiths WHERE 1=1';
  const params: any[] = [];

  if (query) {
    sql += ' AND (hadithArabic LIKE ? OR hadithEnglish LIKE ?)';
    params.push(`%${query}%`, `%${query}%`);
  }

  if (book) {
    sql += ' AND book LIKE ?';
    params.push(`%${book}%`);
  }

  if (chapter) {
    sql += ' AND chapter LIKE ?';
    params.push(`%${chapter}%`);
  }

  // Get total count
  const countStmt = db.prepare(sql);
  const total = countStmt.all(...params).length;

  // Add pagination
  sql += ' ORDER BY id LIMIT ? OFFSET ?';
  params.push(limit, (page - 1) * limit);

  const stmt = db.prepare(sql);
  const hadiths = stmt.all(...params);

  res.json({
    hadiths,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  });
});

app.get('/api/hadiths/books', (req, res) => {
  const books = db.prepare('SELECT DISTINCT book FROM hadiths ORDER BY book').all();
  res.json(books);
});

app.get('/api/hadiths/chapters', (req, res) => {
  const chapters = db.prepare('SELECT DISTINCT chapter FROM hadiths ORDER BY chapter').all();
  res.json(chapters);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 