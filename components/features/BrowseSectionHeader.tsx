type BrowseSectionHeaderProps = {
  count: number;
};

export function BrowseSectionHeader({ count }: BrowseSectionHeaderProps) {
  return (
    <p className="text-foreground/60 my-8 font-sans text-xs font-semibold tracking-widest uppercase">
      Browse All <span className="text-foreground/30">— {count} Titles</span>
    </p>
  );
}
