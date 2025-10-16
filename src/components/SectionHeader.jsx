export default function SectionHeader({ title, count }) {
  return (
    <div className="container-app mt-10 mb-4 flex items-end justify-between">
      <h3 className="title-fn text-2xl md:text-3xl">{title}</h3>
      {typeof count === "number" && (
        <span className="badge chip-fn bg-white/5 border border-white/10 text-[11px]">{count} items</span>
      )}
    </div>
  );
}
