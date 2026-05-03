import Image from "next/image";

const SPINE_GRADIENT = "linear-gradient(to right, rgba(0,0,0,0.3), transparent)";
const PAGE_EDGES =
  "repeating-linear-gradient(to bottom, #c8c2b0 0px, #c8c2b0 1px, #b8b2a0 1px, #b8b2a0 2px)";

type BookCardImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export function BookCardImage({ src, alt, width = 90, height = 150 }: BookCardImageProps) {
  return (
    <div className="flex justify-center p-3">
      <div className="relative">
        {/* Spine shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-4 rounded-l-md"
          style={{ background: SPINE_GRADIENT }}
        />

        {/* Page edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2px] right-0 bottom-[2px] z-10 w-[4px] rounded-r-sm"
          style={{ background: PAGE_EDGES }}
        />

        <Image
          src={src}
          alt={`Book cover of ${alt}`}
          width={width}
          height={height}
          sizes={`${width}px`}
          className="rounded-md border border-transparent object-contain shadow-lg"
          style={{ width, height }}
        />
      </div>
    </div>
  );
}
