import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/ui/icon";

const image = {
  hero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1500&q=88",
  ceremony: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
  dinner: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=85",
  flowers: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=85",
};

const features = [
  { icon: "clipboard" as const, number: "01", title: "A plan that feels lighter", body: "Timelines, budgets, tasks, and vendor details finally living in the same place.", tone: "bg-[#f2e5dd]" },
  { icon: "globe" as const, number: "02", title: "A story worth sharing", body: "Make a wedding website that looks like you, with all the details guests need.", tone: "bg-[#e4eadf]" },
  { icon: "users" as const, number: "03", title: "Everyone in the loop", body: "Send invitations, collect RSVPs, and keep family and vendors on the same page.", tone: "bg-[#eee6d7]" },
];

const roles = [
  { label: "For wedding planners", title: "More meaningful work. Less chasing details.", description: "Bring every couple, vendor, and event timeline together in one calm workspace.", href: "/planner", action: "Explore planner tools", icon: "layout" as const, image: image.dinner },
  { label: "For couples", title: "Keep the joy. Lose the spreadsheet chaos.", description: "From your first checklist to the final song, plan a day that feels like yours.", href: "/couple", action: "Build your wedding", icon: "heart" as const, image: image.ceremony },
  { label: "For guests", title: "All the little details, in one lovely place.", description: "Find your invitation, RSVP in a moment, and know exactly where to be.", href: "/guest", action: "Find an invitation", icon: "mail" as const, image: image.flowers },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative py-10 sm:py-14 lg:py-20">
          <div className="container-wide grid items-center gap-12 lg:grid-cols-[.93fr_1.07fr] lg:gap-14">
            <div className="relative z-10 pb-1 lg:pb-8">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e4d8c9] bg-white/55 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-pine">
                <Icon name="sparkles" size={14} className="text-terra" /> The thoughtful way to say “I do”
              </div>
              <h1 className="font-display max-w-[600px] text-[52px] leading-[.99] sm:text-[64px] lg:text-[76px]">A day to remember.<br /><span className="italic text-terra">A journey</span> made simpler.</h1>
              <p className="mt-7 max-w-[445px] text-[15px] leading-7 text-muted sm:text-base">A little home for all the big feelings and tiny details. Plan beautifully, bring everyone together, and be there for the moments that matter.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/couple" className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-pine px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pine-dark">Start your story <Icon name="arrow-right" size={17} /></Link>
                <Link href="/login" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d9d8ce] px-6 text-sm font-semibold text-ink transition-colors hover:bg-white">Sign in to your workspace <Icon name="arrow-up-right" size={16} /></Link>
              </div>
              <div className="mt-9 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft text-pine"><Icon name="heart" size={17}/></span><div className="text-xs leading-5 text-muted"><span className="font-semibold text-ink">Made for real-life love stories</span><br />and all the people in them.</div></div>
            </div>

            <div className="relative mx-auto w-full max-w-[610px] lg:mr-0">
              <div className="absolute -right-8 -top-7 hidden h-40 w-40 rounded-full border border-[#d8d8c8] lg:block" />
              <div className="absolute -bottom-8 -left-8 hidden h-48 w-48 rounded-full border border-[#d8d8c8] lg:block" />
              <div className="relative h-[440px] overflow-hidden rounded-t-[48%] rounded-b-[18px] bg-sage sm:h-[540px] lg:h-[610px]">
                <div className="absolute inset-0 bg-cover bg-[center_45%]" style={{ backgroundImage: `url('${image.hero}')` }} />
                <div className="photo-wash absolute inset-0" />
                <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.17em] text-white backdrop-blur-md sm:left-7 sm:top-7">Your forever starts here</div>
                <div className="absolute bottom-8 left-7 right-7 text-white sm:bottom-10 sm:left-10 sm:right-10">
                  <p className="eyebrow text-white/75">One love, a thousand little moments</p>
                  <p className="font-display mt-2 text-4xl sm:text-5xl">Make it yours.</p>
                </div>
              </div>
              <div className="surface-shadow absolute -bottom-7 right-2 w-[220px] rounded-2xl border border-white/80 bg-paper p-4 sm:-bottom-6 sm:right-[-18px] sm:w-[246px] sm:p-5">
                <div className="flex items-start justify-between"><div><p className="eyebrow text-terra">Your big day</p><p className="font-display mt-1 text-[22px]">Your wedding</p></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-pine"><Icon name="heart" size={16} /></span></div>
                <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted"><Icon name="calendar" size={15} /> Date and schedule</div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted"><Icon name="map-pin" size={15} /> Venue and guest details</div>
                <Link href="/login" className="mt-4 flex items-center justify-between rounded-xl bg-sage-soft px-3 py-2.5 text-xs font-semibold text-pine">Set up your website <Icon name="arrow-up-right" size={15} /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-paper/70">
          <div className="container-wide grid gap-5 py-6 sm:grid-cols-3 sm:gap-8 sm:py-7">
            {[
              { value: "One calm space", label: "for every moving piece" },
              { value: "Every guest", label: "in the know, without the group chat" },
              { value: "More presence", label: "for the day you worked toward" },
            ].map((item, index) => <div key={item.value} className={`flex items-center gap-3 sm:justify-center ${index !== 0 ? "sm:border-l sm:border-line" : ""}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-pine"><Icon name={index === 0 ? "layout" : index === 1 ? "users" : "heart"} size={19} /></span><div><p className="text-sm font-semibold text-ink">{item.value}</p><p className="mt-0.5 text-xs text-muted">{item.label}</p></div></div>)}
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="container-wide">
            <div className="mx-auto max-w-[660px] text-center">
              <p className="eyebrow text-terra">All the moving pieces, in harmony</p>
              <h2 className="font-display mt-4 text-[42px] leading-[1.05] sm:text-[56px]">The magic is in the details.<br /><span className="italic text-pine">We’ll mind the details.</span></h2>
              <p className="mx-auto mt-5 max-w-[480px] text-sm leading-7 text-muted sm:text-base">From the first “what if?” to the last dance, Everafter makes the work feel a little more wonderful.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {features.map((feature) => <article key={feature.number} className="group rounded-[22px] border border-line bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-7"><div className="flex items-center justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${feature.tone} text-pine`}><Icon name={feature.icon} size={22} /></span><span className="font-display text-xl text-[#c6b9a7]">{feature.number}</span></div><h3 className="font-display mt-7 text-[26px] leading-tight">{feature.title}</h3><p className="mt-3 min-h-[70px] text-sm leading-6 text-muted">{feature.body}</p><div className="mt-6 h-px w-full bg-line"/><p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-pine">Designed to feel effortless <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" /></p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-[#ebece3] py-18 sm:py-24">
          <div className="container-wide">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="eyebrow text-terra">A place for every kind of “I do”</p><h2 className="font-display mt-4 max-w-[620px] text-[41px] leading-[1.06] sm:text-[54px]">Your role in the story.<br /><span className="italic">Your own little corner.</span></h2></div>
              <p className="max-w-[330px] text-sm leading-6 text-muted">Whether you’re guiding ten weddings or saying yes to one, there’s a better way to bring people together.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {roles.map((role) => <article key={role.href} className="overflow-hidden rounded-[22px] bg-paper shadow-sm">
                <Link href={role.href} className="group relative block h-[210px] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${role.image}')` }} aria-label={role.label}>
                  <div className="absolute inset-0 bg-[#1c3329]/20 transition-colors group-hover:bg-[#1c3329]/5" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-pine backdrop-blur">{role.label}</span>
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-pine transition-transform group-hover:rotate-45"><Icon name="arrow-up-right" size={20} /></span>
                </Link>
                <div className="p-6 sm:p-7"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-pine"><Icon name={role.icon} size={20} /></div><h3 className="font-display mt-4 text-[27px] leading-[1.1]">{role.title}</h3><p className="mt-3 min-h-[70px] text-sm leading-6 text-muted">{role.description}</p><Link href={role.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-pine hover:text-terra">{role.action}<Icon name="arrow-right" size={16} /></Link></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="container-wide grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full border border-[#cfcbbd]" />
              <div className="relative h-[390px] overflow-hidden rounded-[18px] sm:h-[470px]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image.flowers}')` }} />
                <div className="photo-wash absolute inset-0" />
                <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8"><p className="eyebrow text-white/70">A little more room to breathe</p><p className="font-display mt-2 text-3xl sm:text-4xl">The good stuff,<br />without the guesswork.</p></div>
              </div>
              <div className="absolute -bottom-5 right-[-4px] rounded-2xl border border-line bg-paper p-4 shadow-lg sm:right-[-25px] sm:p-5"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-muted">Checklist feeling</p><div className="mt-2 flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-pine"><Icon name="check" size={15} /></span><span className="text-sm font-semibold">One thing at a time.</span></div></div>
            </div>
            <div className="pt-4 lg:pl-5">
              <p className="eyebrow text-terra">The Everafter feeling</p>
              <h2 className="font-display mt-4 text-[42px] leading-[1.04] sm:text-[56px]">Less “did we forget?”<br /><span className="italic text-pine">More “look at us.”</span></h2>
              <p className="mt-5 max-w-[470px] text-sm leading-7 text-muted sm:text-base">A beautiful celebration takes care. But it shouldn’t take over your life. Put the logistics somewhere you trust, then give your attention back to the people, promises, and moments that brought you here.</p>
              <div className="mt-7 space-y-4">
                {[
                  { title: "One shared source of truth", text: "Everyone sees the right details, at the right time." },
                  { title: "Little wins worth celebrating", text: "Turn a long list into small, satisfying steps." },
                  { title: "A keepsake, not just a plan", text: "Give your guests a home for your wedding story." },
                ].map((item) => <div key={item.title} className="flex gap-3"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-pine"><Icon name="check" size={14} /></span><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-sm leading-5 text-muted">{item.text}</p></div></div>)}
              </div>
              <Link href="/couple" className="mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-pine px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pine-dark">Make a little plan <Icon name="arrow-right" size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="container-wide">
            <div className="relative overflow-hidden rounded-[28px] bg-pine px-6 py-12 text-center text-white sm:px-12 sm:py-16">
              <div className="paper-grid pointer-events-none absolute inset-0 opacity-[.16]" />
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/15" /><div className="absolute -bottom-32 -left-14 h-72 w-72 rounded-full border border-white/15" />
              <div className="relative mx-auto max-w-[650px]"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-[#e9c4b3]"><Icon name="flower" size={24} /></span><p className="eyebrow mt-5 text-white/60">A lovely place to begin</p><h2 className="font-display mt-4 text-[42px] leading-[1.04] sm:text-[58px]">Here’s to your <span className="italic text-[#e9c4b3]">ever after.</span></h2><p className="mx-auto mt-5 max-w-[480px] text-sm leading-7 text-white/70 sm:text-base">Bring your people, your plans, and all your big feelings. We’ll help you hold it all, beautifully.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/couple" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-paper px-6 text-sm font-semibold text-pine transition-colors hover:bg-[#f0e7da]">Let’s begin <Icon name="arrow-right" size={16} /></Link><Link href="/guest" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10">I have an invitation</Link></div></div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
