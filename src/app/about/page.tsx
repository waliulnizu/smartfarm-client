import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h1 className="text-4xl font-bold text-zinc-900">About SmartKhamar</h1>
          <p className="mt-4 text-lg text-zinc-500">Empowering Bangladeshi farmers with AI-driven livestock management</p>

          <div className="mt-10 space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Our Mission</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                SmartKhamar aims to transform traditional livestock farming in Bangladesh by providing modern digital tools. 
                We help farmers track individual animals, monitor health, analyze profitability, and make data-driven decisions 
                that increase farm productivity and income.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Why SmartKhamar?</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Traditional farm management relies on memory and paper records. With SmartKhamar, every cow gets a digital identity. 
                You can track weight growth, vaccination schedules, daily milk production, pregnancy cycles, and even calculate 
                per-animal profitability. Our AI assistant helps answer questions and generate insights from your farm data.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">Our Technology</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Built with modern web technologies including Next.js, TypeScript, Tailwind CSS, and MongoDB. 
                AI features are powered by Google Gemini, providing intelligent content generation and conversational assistance 
                tailored to Bangladeshi farming practices.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
