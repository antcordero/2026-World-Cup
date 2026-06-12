import { cn } from "@/lib/utils"

export function Flag({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  return (
    <img
      // eslint-disable-next-line @next/next/no-img-element
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={26}
      height={20}
      alt=""
      crossOrigin="anonymous"
      loading="lazy"
      className={cn(
        "h-[18px] w-[26px] shrink-0 rounded-[3px] object-cover ring-1 ring-white/15",
        className,
      )}
    />
  )
}
