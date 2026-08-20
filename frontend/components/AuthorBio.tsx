import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AuthorBio() {
  return (
    <div className="mt-12 mb-8 group relative glass-card p-6 md:p-8 rounded-2xl border border-accent-purple/20 bg-accent-purple/5 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-accent-purple/30 shadow-md shrink-0">
          <Image
            src="/images/abhishek-kumar.jpg"
            alt="Abhishek - Founder & Lead Developer of MeetMind AI"
            fill
            sizes="96px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            Founder & Lead Developer
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Written by Abhishek</h3>
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            I created MeetMind AI to eliminate manual note-taking and ensure teams never lose critical decisions or action items after a call. All technical content is verified against our current codebase.
          </p>
          <Link 
            href="/authors/abhishek" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-purple hover:text-accent-blue transition-colors pt-1"
          >
            <span>Read Founder Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
