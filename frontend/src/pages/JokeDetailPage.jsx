import { useParams } from 'react-router-dom';
import { jokes, categories } from '../data/mockData';

export default function JokeDetailPage() {
  const { id } = useParams();
  const joke = jokes.find((j) => String(j.id) === String(id));

  if (!joke) return <p>Chiste no encontrado.</p>;

  const category = categories.find((c) => c.id === joke.categoryId);

  return (
    <section>
      <h2>{joke.title}</h2>
      <p>{joke.content}</p>
      <small>Categoría: {category?.name ?? 'N/A'}</small>
    </section>
  );
}
