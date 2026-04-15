export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-100 aspect-[3/4] w-full mb-3" />
      <div className="h-3 bg-zinc-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-zinc-100 rounded w-1/4 mb-4" />
      <div className="h-10 bg-zinc-100 rounded w-full" />
    </div>
  );
}
