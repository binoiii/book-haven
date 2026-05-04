type StockBadgeProps = {
  stock: number;
};

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <span className="absolute top-2 right-2 z-10 rounded-sm bg-black/50 px-2 py-0.5 font-sans text-[10px] font-medium text-white/80 backdrop-blur-sm">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="absolute top-2 right-2 z-10 rounded-sm bg-orange-500 px-2 py-0.5 font-sans text-[10px] font-medium text-white">
        Only {stock} left
      </span>
    );
  }

  return null;
}
