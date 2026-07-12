import React from 'react';
import { UserButton, OrganizationSwitcher, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import AIChatBot from './AIChatBot';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f9f7f4] text-slate-800 flex flex-col font-sans relative overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Light Clean Minimalist Top Navigation Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Left Side Grouping: BasecampLite Branding & Workspace Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <h1 className="text-xl font-black text-emerald-800 tracking-tight">
              Basecamp<span className="text-slate-500 font-light">Lite</span>
            </h1>
          </div>
          
          {/* Main Top Navigation Array Item Elements */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 transition-colors">Dashboard</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">Projects</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">Teams</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">Documents</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">Reports</button>
          </nav>
        </div>

        {/* Right Side Grouping: Organization Dropdown Switcher & User Profile Context */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-3">
              <OrganizationSwitcher 
                hidePersonal 
                afterCreateOrganizationUrl="/" 
                afterSelectOrganizationUrl="/"
                appearance={{
                  elements: {
                    rootBox: "bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200",
                    organizationSwitcherTrigger: "text-slate-700 py-1 px-2.5 font-semibold text-sm",
                  }
                }}
              />
              <div className="w-px h-5 bg-slate-200" />
              <UserButton afterSignOutButtonUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-lg transition-all shadow-sm">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* Primary Workspace View Area Canvas */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto relative z-10">
        {children}
      </main>

      {/* Floating System Documentation Assistant Overlay */}
      <AIChatBot />
    </div>
  );
}