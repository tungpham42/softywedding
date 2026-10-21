import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SignInButtons } from "@/components/auth/sign-in-buttons";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Login now",
  description: "Login now",
  openGraph: {
    title: "Login now",
    description: "Login now",
    images: [
      {
        url: "/login.jpg",
      },
    ],
  },
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-wide grid min-h-[calc(100vh-76px)] items-center gap-10 py-10 sm:py-14 lg:grid-cols-[.86fr_1.14fr] lg:gap-16 lg:py-16">
        <div className="mx-auto w-full max-w-[450px] py-5 lg:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-pine">
            <Icon name="flower" size={14} className="text-terra" /> Your little
            corner awaits
          </span>
          <p className="eyebrow mt-8 text-terra">Welcome back</p>
          <h1 className="font-display display-balance mt-4 text-[48px] leading-[.98] sm:text-[61px]">
            Your people.
            <br />
            <span className="italic text-pine">Your plans.</span>
          </h1>
          <p className="mt-5 max-w-[380px] text-sm leading-7 text-muted sm:text-base">
            Come back to the details you’ve gathered, the moments you’re
            dreaming about, and the story that’s taking shape.
          </p>
          <div className="mt-8 rounded-[24px] border border-white bg-paper p-6 shadow-[0_18px_55px_rgba(63,47,35,.08)] sm:p-8">
            <p className="font-display text-[25px]">
              Let’s pick up where you left off.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Sign in with Google or Facebook, or continue as a guest, to open
              your private wedding workspace.
            </p>
            <div className="mt-6">
              <SignInButtons />
            </div>
            <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4">
              <Icon
                name="shield"
                size={16}
                className="mt-0.5 shrink-0 text-pine"
              />
              <p className="text-[11px] leading-5 text-muted">
                Your wedding details and guest information are loaded from your
                account after you sign in.
              </p>
            </div>
          </div>
          <p className="mt-5 text-center text-[11px] leading-5 text-muted">
            New to Softy?{" "}
            <Link
              href="/couple"
              className="font-bold text-pine underline decoration-[#c5cbbd] underline-offset-4 hover:text-terra"
            >
              Start planning here
            </Link>
            .
          </p>
        </div>

        <div className="relative hidden min-h-[640px] overflow-hidden rounded-[28px] bg-sage lg:block">
          <div
            className="image-hover absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=90')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e3023]/85 via-[#1e3023]/12 to-[#1e3023]/5" />
          <div className="absolute left-7 top-7 rounded-full border border-white/40 bg-white/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md">
            Keep close to what matters
          </div>
          <div className="absolute bottom-10 left-8 right-8 text-white sm:bottom-12 sm:left-10 sm:right-10">
            <p className="eyebrow text-white/65">
              A shared space for the big day
            </p>
            <p className="font-display mt-4 max-w-[470px] text-[42px] leading-[1.02] sm:text-[52px]">
              The best part isn’t the plan.
              <br />
              <span className="italic text-[#f0cbb9]">It’s the people.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">
              Keep the moving pieces somewhere you trust, so you can be present
              for the memories.
            </p>
            <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-white/85">
              <Icon name="heart" size={15} className="text-[#f0cbb9]" /> Made
              for your kind of forever
            </div>
          </div>
          <div className="absolute bottom-7 right-7 rounded-[18px] border border-white/65 bg-paper/95 p-4 text-ink shadow-xl backdrop-blur">
            <p className="eyebrow text-terra">Your wedding, your way</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-pine">
                <Icon name="check" size={15} />
              </span>
              <span className="text-xs font-semibold">
                One lovely step at a time.
              </span>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
