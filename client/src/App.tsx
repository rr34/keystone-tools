import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface FileData {
  Filename: string
  FileType: string
  FileSource: string
  PointsCount: number
}

function App() {
  const [filesData, setFilesData] = useState<FileData[]>([])
  const [totalFiles, setTotalFiles] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {        
        const res = await fetch('http://localhost:5000/api/files');
        if (!res.ok) throw new Error('Failed to fetch files')
          const data = await res.json();
          console.log(data);
        setFilesData(data.files)
        setTotalFiles(data.totalFiles)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [])

  if (loading) return <p>Loading files...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="App">
      <h1>Keystone Files</h1>
      <p>Total files: {totalFiles}</p>
      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>FileType</th>
              <th>FileSource</th>
              <th>Points Count</th>
            </tr>
          </thead>
          <tbody>
            {filesData.map((f, i) => (
              <tr key={i}>
                <td>{f.Filename}</td>
                <td>{f.FileType}</td>
                <td>{f.FileSource}</td>
                <td>{f.PointsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>

    </div>
  )
}

export default App
