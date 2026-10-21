import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-wide grid min-h-[calc(100vh-78px)] items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div className="mx-auto w-full max-w-[430px]">
          <p className="eyebrow text-terra">Welcome back</p>
          <h1 className="font-display mt-4 text-[46px] leading-[1.03] sm:text-[56px]">Your people.<br /><span className="italic text-pine">Your plans.</span></h1>
          <p className="mt-4 text-sm leading-6 text-muted">Sign in to continue where your story left off.</p>
          <div className="mt-8 rounded-[22px] border border-line bg-paper p-6 sm:p-8">
            <GoogleSignInButton />
            <p className="mt-4 text-center text-xs leading-5 text-muted">Your wedding details, guest list, and planning progress are loaded from your account after you sign in.</p>
          </div>
          <p className="mt-6 text-center text-xs text-muted">By continuing, you agree to keep the celebration kind and welcoming.</p>
        </div>
        <div className="relative hidden min-h-[570px] overflow-hidden rounded-[26px] lg:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=90')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d352a]/75 via-[#1d352a]/10 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white"><p className="eyebrow text-white/70">Keep close to what matters</p><p className="font-display mt-3 max-w-[470px] text-[42px] leading-[1.04]">The best part isn’t the plan. It’s the people.</p><p className="mt-4 max-w-sm text-sm leading-6 text-white/75">A shared space for the details, so you can be present for the memories.</p><div className="mt-6 flex items-center gap-2 text-sm"><Icon name="heart" size={16} className="text-[#e9c4b3]"/> Made for your kind of forever</div></div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
