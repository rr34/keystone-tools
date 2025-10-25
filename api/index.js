// index.js
import express from 'express';
import cors from 'cors';
import { pool } from './database.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (!process.env.CLIENT_IP) {
  console.error("CLIENT_IP environment variable not set!");
  process.exit(1);
}

const allowedOrigins = [
  process.env.CLIENT_IP,
	'http://localhost:5173',
	'http://localhost',
];

console.log("Allowed origins:", allowedOrigins);
console.log("Current working directory:", process.cwd());
console.log("CLIENT_IP environment variable:", process.env.CLIENT_IP);

app.use(cors({
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback (null, true);
		}
		return callback(new Error(`CORS not allowed from origin: ${origin}`));
	},
	credentials: true
}));


// Route to get files data
app.get('/files', async (req, res) => {
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
