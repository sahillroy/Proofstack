import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, BookOpen, Share2, Flame, Layers } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
      {/* Background radial/linear gradients for premium aesthetic */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none translate-y-1/3" />

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              ProofStack
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="shadow-sm">
              <Link href="/dashboard" className="gap-1">
                Get Started <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-xs text-muted-foreground mb-6 animate-fade-in">
            <Sparkles size={12} className="text-orange-500" />
            <span>Showcase Your Proof of Work</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Show the world what
            <span className="block mt-1 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
              you have built.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
            Turn project submissions and course completions into beautiful, Gemini-generated blog posts, LinkedIn content, and a live public portfolio page.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto text-base shadow-lg shadow-primary/10">
              <Link href="/dashboard" className="gap-2">
                Create Your Profile <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base">
              <Link href="/login">Continue with GitHub</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-24 text-left">
            <div className="border border-border/50 rounded-xl p-5 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Layers size={20} />
              </div>
              <h3 className="font-semibold text-base mb-2">Easy Submissions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log details about your projects, tech stack, achievements, and key learnings in seconds.
              </p>
            </div>

            <div className="border border-border/50 rounded-xl p-5 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 text-orange-600">
                <Sparkles size={20} />
              </div>
              <h3 className="font-semibold text-base mb-2">Gemini AI Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instantly write comprehensive blog posts and engaging, scroll-stopping LinkedIn posts.
              </p>
            </div>

            <div className="border border-border/50 rounded-xl p-5 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Share2 size={20} />
              </div>
              <h3 className="font-semibold text-base mb-2">Public Portfolio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Share a live public portfolio that details your completed projects, certificates, and posts.
              </p>
            </div>

            <div className="border border-border/50 rounded-xl p-5 bg-card/30 backdrop-blur-sm hover:border-border hover:bg-card/50 transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 text-orange-600">
                <Flame size={20} />
              </div>
              <h3 className="font-semibold text-base mb-2">Build Streaks</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep your momentum alive with automated weekly streak counts and badges recruiters love.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ProofStack. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
