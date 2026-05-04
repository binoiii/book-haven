import { Badge } from "@/components/ui/badge";

type StockBadgeProps = {
  stock: number;
};

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge className="absolute top-2 right-2 z-20 rounded-sm bg-black/50 pt-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
        Out of Stock
      </Badge>
    );
  }

  if (stock <= 5) {
    return (
      <Badge className="absolute top-2 right-2 z-20 rounded-sm bg-orange-500 pt-1 text-xs font-semibold text-white">
        Only {stock} left
      </Badge>
    );
  }

  return null;
}
