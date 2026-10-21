import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/ui/icon";

const images = {
  hero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90",
  ceremony:
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=88",
  dinner:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=88",
  flowers:
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=88",
};

const roles = [
  {
    eyebrow: "For wedding planners",
    title: "Your best work, with room to breathe.",
    description:
      "Keep client weddings, timelines, guest updates, and all those tiny details together.",
    href: "/planner",
    action: "Explore planner tools",
    icon: "layout" as const,
    image: images.dinner,
    number: "01",
    accent: "bg-[#f1ddd2] text-[#9e533c]",
  },
  {
    eyebrow: "For couples",
    title: "Make space for the feeling.",
    description:
      "A calmer place for the checklist, the people, and the day you can’t stop imagining.",
    href: "/couple",
    action: "Build your wedding space",
    icon: "heart" as const,
    image: images.ceremony,
    number: "02",
    accent: "bg-[#e5e8dc] text-pine",
  },
  {
    eyebrow: "For wedding guests",
    title: "Every little detail, all together.",
    description:
      "Find your invite, share your RSVP, and know when and where to celebrate.",
    href: "/guest",
    action: "Find your invitation",
    icon: "mail" as const,
    image: images.flowers,
    number: "03",
    accent: "bg-[#eee5d3] text-[#80663e]",
  },
];

const features = [
  {
    icon: "clipboard" as const,
    title: "A plan that feels lighter",
    body: "Keep tasks, important dates, and notes in one shared space. One little win at a time.",
  },
  {
    icon: "globe" as const,
    title: "A story worth sharing",
    body: "Make a wedding website with the story, schedule, and details your guests need.",
  },
  {
    icon: "users" as const,
    title: "Everyone in the loop",
    body: "Create personal invitations, collect real RSVPs, and keep the right people informed.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative pb-20 pt-9 sm:pb-28 sm:pt-14 lg:pb-32 lg:pt-16">
          <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#eed7c8]/35 blur-3xl" />
          <div className="pointer-events-none absolute right-[-80px] top-48 h-72 w-72 rounded-full bg-[#dce2d2]/50 blur-3xl" />
          <div className="container-wide relative grid items-center gap-12 lg:grid-cols-[.94fr_1.06fr] lg:gap-12 xl:gap-16">
            <div className="relative z-10 max-w-[610px] pb-1 lg:pb-7">
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#e6d5c8] bg-paper/80 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.15em] text-pine shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f1dfd5] text-terra">
                  <Icon name="sparkles" size={12} />
                </span>
                A more soulful way to plan a wedding
              </div>
              <h1 className="font-display display-balance max-w-[650px] text-[54px] leading-[.97] tracking-[-.06em] sm:text-[72px] lg:text-[82px] xl:text-[92px]">
                Big love.
                <br />
                <span className="relative inline-block italic text-terra">
                  Little less
                </span>
                <br />
                logistics.
              </h1>
              <p className="mt-7 max-w-[450px] text-[15px] leading-7 text-muted sm:text-[17px] sm:leading-8">
                A little home for the big feelings and tiny details. Plan
                beautifully, bring your people together, and stay close to what
                this day is really about.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/couple"
                  className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-pine px-6 text-[13px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-pine-dark hover:shadow-lg"
                >
                  Start your story{" "}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                    <Icon name="arrow-right" size={15} />
                  </span>
                </Link>
                <Link
                  href="/planner"
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-[#ded2c6] bg-paper/60 px-5 text-[13px] font-semibold text-ink transition-colors hover:bg-white"
                >
                  I’m a wedding planner <Icon name="arrow-up-right" size={15} />
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#e8ddd2] pt-5 text-[11px] font-medium text-muted sm:mt-10">
                <span className="inline-flex items-center gap-2">
                  <Icon name="check-circle" size={15} className="text-pine" />{" "}
                  Your plans, in one place
                </span>
                <span className="inline-flex items-center gap-2">
                  <Icon name="heart" size={15} className="text-terra" /> Made
                  for real-life love stories
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[650px] lg:mr-0">
              <div className="absolute -right-2 top-[-22px] z-0 h-36 w-36 rounded-full border border-[#d8c8b8] sm:-right-6 sm:h-44 sm:w-44" />
              <div className="absolute -bottom-7 -left-4 z-0 h-36 w-36 rounded-full border border-[#d8c8b8] sm:-bottom-9 sm:-left-8 sm:h-48 sm:w-48" />
              <div className="relative z-10 grid grid-cols-[1fr_.43fr] items-end gap-3 sm:gap-4">
                <div className="relative h-[390px] overflow-hidden rounded-t-[48%] rounded-b-[22px] bg-sage shadow-xl sm:h-[530px] lg:h-[590px]">
                  <div
                    className="image-hover absolute inset-0 bg-cover bg-[center_43%]"
                    style={{ backgroundImage: `url('${images.hero}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#29392c]/65 via-transparent to-[#29392c]/5" />
                  <div className="absolute left-5 top-5 rounded-full border border-white/35 bg-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[.17em] text-white backdrop-blur-md sm:left-7 sm:top-7 sm:text-[10px]">
                    Your forever starts here
                  </div>
                  <div className="absolute bottom-7 left-5 right-5 text-white sm:bottom-10 sm:left-8 sm:right-8">
                    <p className="eyebrow text-white/70">
                      A thousand little moments
                    </p>
                    <p className="font-display mt-2 text-[34px] leading-[1.02] sm:text-[46px]">
                      Make it
                      <br />
                      <span className="italic text-[#f0cbb9]">meaningful.</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pb-3 sm:gap-4 sm:pb-5">
                  <div className="relative h-[156px] overflow-hidden rounded-t-[40%] rounded-b-[18px] bg-[#e7e0d4] sm:h-[210px]">
                    <div
                      className="image-hover absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${images.flowers}')` }}
                    />
                  </div>
                  <div className="relative h-[185px] overflow-hidden rounded-[18px] bg-[#ead9cc] sm:h-[240px]">
                    <div
                      className="image-hover absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${images.dinner}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#32241d]/45 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-3 text-white sm:bottom-5 sm:left-5">
                      <p className="eyebrow text-white/70">
                        All the little things
                      </p>
                      <p className="font-display mt-1 text-xl leading-tight sm:text-2xl">
                        In good company.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="surface-shadow absolute -bottom-7 left-4 z-20 w-[242px] rounded-[20px] border border-white/75 bg-paper/95 p-4 backdrop-blur sm:bottom-[-30px] sm:left-9 sm:w-[270px] sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f1dfd5] text-terra">
                    <Icon name="heart" size={19} />
                  </span>
                  <div>
                    <p className="font-display text-[19px] leading-tight">
                      The wedding workspace
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      One place for everything that matters
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1.5 border-t border-line pt-3">
                  <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-sage-soft px-2 py-2 text-[9px] font-semibold text-pine">
                    <Icon name="clipboard" size={12} /> Your plans
                  </span>
                  <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f5e8df] px-2 py-2 text-[9px] font-semibold text-terra">
                    <Icon name="users" size={12} /> Your people
                  </span>
                </div>
              </div>
              <div className="absolute -right-2 top-[48%] z-20 hidden rounded-full border border-white/80 bg-paper px-3.5 py-3 shadow-lg sm:flex sm:items-center sm:gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-pine">
                  <Icon name="flower" size={16} />
                </span>
                <span className="pr-1 text-[10px] font-semibold text-ink">
                  Thoughtfully, always.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8ddd2] bg-paper/65">
          <div className="container-wide grid gap-4 py-6 sm:grid-cols-3 sm:gap-7 sm:py-7">
            {[
              {
                value: "The whole story",
                label: "Plans, details, and memories",
              },
              {
                value: "The right people",
                label: "Couples, planners, and guests",
              },
              {
                value: "A little more ease",
                label: "Less chasing, more celebrating",
              },
            ].map((item, index) => (
              <div
                key={item.value}
                className={`flex items-center gap-3.5 sm:justify-center ${index !== 0 ? "sm:border-l sm:border-line" : ""}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] ${index === 1 ? "bg-[#f1dfd5] text-terra" : "bg-sage-soft text-pine"}`}
                >
                  <Icon
                    name={
                      index === 0 ? "layout" : index === 1 ? "users" : "heart"
                    }
                    size={19}
                  />
                </span>
                <div>
                  <p className="font-display text-[18px] leading-tight">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 sm:py-28 lg:py-32">
          <div className="container-wide">
            <div className="mx-auto max-w-[700px] text-center">
              <p className="eyebrow text-terra">
                The lovely things, minus the overwhelm
              </p>
              <h2 className="font-display display-balance mt-4 text-[40px] leading-[1.05] sm:text-[54px] lg:text-[62px]">
                A little order for the plans.
                <br />
                <span className="italic text-pine">
                  A lot more room for the magic.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-[510px] text-sm leading-7 text-muted sm:text-base">
                The best celebrations are full of feeling, not frantic
                follow-ups. Softy keeps the moving pieces together so the
                meaningful moments stay front and center.
              </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[24px] border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                >
                  <div className="absolute right-[-22px] top-[-28px] h-28 w-28 rounded-full border border-[#e8ddd2] transition-transform duration-500 group-hover:scale-125" />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={`flex h-[50px] w-[50px] items-center justify-center rounded-[17px] ${index === 1 ? "bg-sage-soft text-pine" : index === 0 ? "bg-[#f1dfd5] text-terra" : "bg-[#efe7d5] text-[#8b7047]"}`}
                    >
                      <Icon name={feature.icon} size={22} />
                    </span>
                    <span className="font-display text-[22px] text-[#c7b9a9]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display mt-7 text-[26px] leading-[1.12] sm:text-[29px]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 min-h-[70px] text-sm leading-6 text-muted">
                    {feature.body}
                  </p>
                  <div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-[11px] font-bold text-pine">
                    Thoughtfully brought together{" "}
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#eeeadf] py-20 sm:py-24 lg:py-28">
          <div className="pointer-events-none absolute -left-28 top-[-100px] h-80 w-80 rounded-full border border-[#d6d2c4]" />
          <div className="container-wide relative">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-terra">
                  A place for every kind of “I do”
                </p>
                <h2 className="font-display display-balance mt-4 max-w-[680px] text-[40px] leading-[1.04] sm:text-[52px] lg:text-[60px]">
                  One celebration.
                  <br />
                  <span className="italic">Three ways to feel at home.</span>
                </h2>
              </div>
              <p className="max-w-[330px] text-sm leading-7 text-muted">
                Whether you’re guiding many weddings, planning your own, or
                celebrating someone you love, there’s a place for you here.
              </p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {roles.map((role) => (
                <article
                  key={role.href}
                  className="group overflow-hidden rounded-[24px] border border-white/75 bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    href={role.href}
                    className="relative block h-[220px] overflow-hidden bg-cover bg-center sm:h-[245px]"
                    aria-label={role.eyebrow}
                  >
                    <div
                      className="image-hover absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${role.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#25372a]/50 via-transparent to-[#25372a]/5 transition-opacity group-hover:opacity-80" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-paper/85 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-pine backdrop-blur">
                      {role.eyebrow}
                    </span>
                    <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-pine shadow-sm transition-transform group-hover:rotate-45">
                      <Icon name="arrow-up-right" size={20} />
                    </span>
                    <span className="font-display absolute bottom-4 left-5 text-[27px] text-white/75">
                      {role.number}
                    </span>
                  </Link>
                  <div className="p-6 sm:p-7">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${role.accent}`}
                    >
                      <Icon name={role.icon} size={19} />
                    </span>
                    <h3 className="font-display mt-5 text-[27px] leading-[1.08] sm:text-[30px]">
                      {role.title}
                    </h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-muted">
                      {role.description}
                    </p>
                    <Link
                      href={role.href}
                      className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-pine transition-colors hover:text-terra"
                    >
                      {role.action}
                      <Icon
                        name="arrow-right"
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 lg:py-32">
          <div className="container-wide grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-[550px]">
              <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full border border-[#d7c8b7] sm:-left-7 sm:-top-7 sm:h-32 sm:w-32" />
              <div className="relative h-[390px] overflow-hidden rounded-t-[42%] rounded-b-[22px] bg-sage shadow-lg sm:h-[500px]">
                <div
                  className="image-hover absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${images.flowers}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#29392c]/60 via-transparent to-transparent" />
                <div className="absolute bottom-7 left-6 right-6 text-white sm:bottom-9 sm:left-9">
                  <p className="eyebrow text-white/70">
                    A little more room to breathe
                  </p>
                  <p className="font-display mt-3 text-[34px] leading-[1.05] sm:text-[44px]">
                    Remember how
                    <br />
                    <span className="italic text-[#f0cbb9]">it felt.</span>
                  </p>
                </div>
              </div>
              <div className="surface-shadow absolute -bottom-5 right-0 rounded-[18px] border border-white bg-paper p-4 sm:right-[-18px] sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-soft text-pine">
                    <Icon name="check" size={16} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted">
                      One thing at a time
                    </p>
                    <p className="font-display mt-0.5 text-[20px]">
                      You’re doing lovely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-3 lg:pl-5">
              <p className="eyebrow text-terra">The Softy feeling</p>
              <h2 className="font-display display-balance mt-4 text-[41px] leading-[1.04] sm:text-[53px] lg:text-[61px]">
                Less “did we forget?”
                <br />
                <span className="italic text-pine">More “look at us.”</span>
              </h2>
              <p className="mt-5 max-w-[500px] text-sm leading-7 text-muted sm:text-base">
                A beautiful celebration takes care. But it shouldn’t take over
                your life. Put the logistics somewhere you trust, then give your
                attention back to the people, promises, and moments that brought
                you here.
              </p>
              <div className="mt-7 space-y-4">
                {[
                  {
                    title: "One shared source of truth",
                    text: "Keep the details together, so nobody has to chase the latest version.",
                  },
                  {
                    title: "Little wins worth celebrating",
                    text: "Turn an overwhelming list into small steps you can actually finish.",
                  },
                  {
                    title: "A keepsake, not just a plan",
                    text: "Give your guests a thoughtful place to find your wedding story.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-pine">
                      <Icon name="check" size={14} />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold">{item.title}</p>
                      <p className="mt-1 text-[12px] leading-5 text-muted">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/couple"
                className="group mt-8 inline-flex h-[50px] items-center gap-3 rounded-full bg-pine px-6 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-pine-dark"
              >
                Make a little plan{" "}
                <span className="transition-transform group-hover:translate-x-1">
                  <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="container-wide">
            <div className="relative overflow-hidden rounded-[28px] bg-[#344637] px-6 py-12 text-center text-white sm:rounded-[34px] sm:px-12 sm:py-16 lg:py-20">
              <div className="paper-grid pointer-events-none absolute inset-0 opacity-[.17]" />
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/15" />
              <div className="pointer-events-none absolute -right-2 -top-7 h-40 w-40 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-36 -left-14 h-72 w-72 rounded-full border border-white/15" />
              <div className="relative mx-auto max-w-[700px]">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/25 bg-white/[.06] text-[#efc5b1]">
                  <Icon name="flower" size={23} />
                </span>
                <p className="eyebrow mt-5 text-white/60">
                  A lovely place to begin
                </p>
                <h2 className="font-display display-balance mt-4 text-[40px] leading-[1.04] sm:text-[56px] lg:text-[64px]">
                  Here’s to your{" "}
                  <span className="italic text-[#efc5b1]">ever after.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-[490px] text-sm leading-7 text-white/70 sm:text-base">
                  Bring your people, your plans, and all your big feelings.
                  We’ll help you hold it all, beautifully.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/couple"
                    className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-paper px-6 text-[12px] font-bold text-pine transition-colors hover:bg-[#f0e2d6]"
                  >
                    Let’s begin <Icon name="arrow-right" size={15} />
                  </Link>
                  <Link
                    href="/guest"
                    className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-[12px] font-bold text-white transition-colors hover:bg-white/10"
                  >
                    I have an invitation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
