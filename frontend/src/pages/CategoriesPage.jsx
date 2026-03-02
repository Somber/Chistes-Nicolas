import { categories } from '../data/mockData';

export default function CategoriesPage() {
  return (
    <section>
      <h2>Categorías</h2>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </section>
  );
}
