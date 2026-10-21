import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <><SiteHeader/><main className="container-wide flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-pine"><Icon name="flower" size={26}/></span><p className="eyebrow mt-6 text-terra">A little detour</p><h1 className="font-display mt-3 text-[44px]">This page has wandered off.</h1><p className="mt-3 max-w-md text-sm leading-6 text-muted">The link may be old, or the invitation code may need a second look.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-white"><Icon name="arrow-right" size={15} className="rotate-180"/> Back home</Link><Link href="/guest" className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-5 text-sm font-semibold"><Icon name="mail" size={15}/> Find an invitation</Link></div></main><SiteFooter/></>
  );
}
