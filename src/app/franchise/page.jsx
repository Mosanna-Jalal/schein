import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Code,
} from "lucide-react";
import FranchiseForm from "./FranchiseForm";

export const metadata = {
  title: "Franchise — Schein",
  description:
    "Own a Schein franchise. Premium clothing brand expanding across India.",
};

const BENEFITS = [
  {
    icon: Award,
    title: "Established Brand",
    desc: "Sell under the Schein name with full branding support, signage, and marketing material.",
  },
  {
    icon: TrendingUp,
    title: "High Margin Products",
    desc: "Premium pricing with healthy margins. Average ticket size Rs. 1,500–4,000 per customer.",
  },
  {
    icon: Users,
    title: "Training & Support",
    desc: "Complete onboarding, staff training, inventory guidance, and ongoing operational support.",
  },
  {
    icon: MapPin,
    title: "Exclusive Territory",
    desc: "Protected territory per franchise. No competing Schein outlet within your zone.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Submit Inquiry",
    desc: "Fill the form below with your details and investment capacity.",
  },
  {
    num: "02",
    title: "Initial Call",
    desc: "Our team contacts you within 48 hours to discuss the opportunity.",
  },
  {
    num: "03",
    title: "Site Visit",
    desc: "We evaluate your proposed location and provide feedback.",
  },
  {
    num: "04",
    title: "Agreement & Setup",
    desc: "Sign the franchise agreement, complete setup, and launch.",
  },
];

const REQUIREMENTS = [
  "Minimum shop area: 200–400 sq ft",
  "Investment range: Rs. 5L – 15L (setup + inventory)",
  "Prime location — market, mall, or high footfall street",
  "Dedicated owner or manager on-site",
  "Agreement term: 2 years (renewable)",
];

export default function FranchisePage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-black text-white py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="font-black text-white leading-none tracking-tighter"
            style={{ fontSize: "clamp(80px, 20vw, 280px)", opacity: 0.04 }}
          >
            FRANCHISE
          </span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-amber-500 mb-5">
            Grow With Us
          </p>
          <h1
            className="font-black text-white tracking-tight mb-6"
            style={{ fontSize: "clamp(32px, 6vw, 72px)" }}
          >
            Own a SCHEIN Franchise
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-base leading-relaxed mb-10">
            Join India's growing premium minimalist fashion brand. We're
            expanding across cities and looking for passionate entrepreneurs to
            carry the Schein name.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all"
          >
            Apply Now <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-400 mb-3">
              Why Schein
            </p>
            <h2 className="text-3xl font-black text-black tracking-tight">
              What You Get
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="border border-zinc-100 p-8 hover:border-zinc-300 transition-colors"
              >
                <div className="w-10 h-10 bg-black flex items-center justify-center mb-5">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="font-bold text-black mb-3 text-sm tracking-wide">
                  {title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-amber-500 mb-4">
              Eligibility
            </p>
            <h2 className="text-3xl font-black text-white tracking-tight mb-8">
              Requirements
            </h2>
            <ul className="space-y-4">
              {REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="text-amber-500 mt-0.5 shrink-0"
                  />
                  <span className="text-zinc-400 text-sm leading-relaxed">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-8">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-6">
              Investment Overview
            </p>
            {[
              ["Franchise Fee", "Rs. 1,00,000"],
              ["Store Setup", "Rs. 2L – 8L"],
              ["Opening Inventory", "Rs. 2L – 5L"],
              ["Working Capital", "Rs. 1L – 2L"],
              ["Total Estimate", "Rs. 5L – 15L"],
            ].map(([label, val], i) => (
              <div
                key={label}
                className={`flex justify-between py-3 text-sm ${i < 4 ? "border-b border-white/5" : "pt-4 font-bold text-white"}`}
              >
                <span className={i < 4 ? "text-zinc-500" : "text-white"}>
                  {label}
                </span>
                <span className={i < 4 ? "text-zinc-300" : "text-amber-400"}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-400 mb-3">
              Process
            </p>
            <h2 className="text-3xl font-black text-black tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <p className="text-5xl font-black text-zinc-100 mb-4 leading-none">
                  {num}
                </p>
                <h3 className="font-bold text-black mb-2 text-sm tracking-wide">
                  {title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="apply" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-400 mb-3">
              Get Started
            </p>
            <h2 className="text-3xl font-black text-black tracking-tight mb-4">
              Apply for a Franchise
            </h2>
            <p className="text-zinc-500 text-sm">
              Fill in your details and we'll get back to you within 48 hours.
            </p>
          </div>
          <FranchiseForm />
        </div>
      </section>
    </main>
  );
}
