type BrowseSectionHeaderProps = {
  count: number;
  total?: number;
};

export function BrowseSectionHeader({ count, total }: BrowseSectionHeaderProps) {
  const isFiltered = total !== undefined && count !== total;

  return (
    <p className="text-foreground/60 font-sans text-xs font-semibold tracking-widest uppercase">
      Browse All{" "}
      <span className="text-foreground/30">
        — {isFiltered ? `${count} of ${total}` : count} Titles
      </span>
    </p>
  );
}
