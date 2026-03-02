import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import JokesPage from './pages/JokesPage';
import JokeDetailPage from './pages/JokeDetailPage';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>🤣 Chistes Nicolas</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/categories">Categorías</Link>
          <Link to="/jokes">Chistes</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/jokes" element={<JokesPage />} />
          <Route path="/jokes/:id" element={<JokeDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
