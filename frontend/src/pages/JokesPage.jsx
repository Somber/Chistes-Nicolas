import { Link } from 'react-router-dom';
import { jokes } from '../data/mockData';

export default function JokesPage() {
  return (
    <section>
      <h2>Chistes</h2>
      <ul>
        {jokes.map((j) => (
          <li key={j.id}>
            <Link to={`/jokes/${j.id}`}>{j.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
