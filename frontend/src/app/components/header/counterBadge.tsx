interface CounterBadgeProps {
  count: number;
}

export function CounterBadge({ count }: CounterBadgeProps) {
  if (count === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-black text-white text-xs">
      {count}
    </div>
  );
}
