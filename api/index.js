// index.js
import express from 'express';
import cors from 'cors';
import { pool } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

// Route to get files data
app.get('/api/files', async (req, res) => {
  try {
    const query = `
      SELECT Filename, FileType, FileSource, COUNT(fid) AS PointsCount
      FROM keystonedata.all_points_cte
      GROUP BY fid
      ORDER BY FileSource, PointsCount DESC;
    `;

    const [rows] = await pool.query(query);
    res.json({
      totalFiles: rows.length,
      files: rows,
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
