// src/components/ShopGrid.jsx
import ItemCard from "./ItemCard";

export default function ShopGrid({ items }) {
  return (
    <div className="container-app grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 auto-rows-fr">
      {items.map((it) => (
        <ItemCard key={it.id} item={it} />
      ))}
    </div>
  );
}
