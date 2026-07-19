import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-6 relative selection:bg-white selection:text-black">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />

      <div className="text-center space-y-6 max-w-md relative z-10">
        {/* Large stylized status code */}
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-gray-500 block mb-2">Error 404</span>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none text-transparent [text-stroke:2px_rgba(255,255,255,0.8)] [-webkit-text-stroke:2px_rgba(255,255,255,0.8)]">
          Lost.
        </h1>
        
        {/* Descriptive message */}
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          The piece or page you are looking for has been moved, removed, or is temporarily unavailable in this drop.
        </p>

        {/* Helpful links */}
        <div className="pt-8 flex flex-col gap-4 items-center">
          <Link 
            href="/shop" 
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold bg-white text-black px-6 py-4 rounded-none hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
          >
            Shop Collection <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/" 
            className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors py-2"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Subtle branding footer */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="text-[10px] tracking-[0.3em] uppercase text-gray-600">KYU? Streetwear</span>
      </div>
    </div>
  );
}
