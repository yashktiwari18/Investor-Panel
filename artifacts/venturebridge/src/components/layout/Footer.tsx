import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import type { Role } from '../../types';
import IdeaBridgeLogo from '../common/IdeaBridgeLogo';

export interface FooterProps {
  role: Role | null;
  displayName: string;
  enterWorkspace: (role: Role, name: string) => void;
  setPage: (page: 'investor-auth' | 'creator-auth' | 'overview') => void;
  inform: (msg: string) => void;
}

export default function Footer({
  role,
  displayName,
  enterWorkspace,
  setPage,
  inform,
}: FooterProps) {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#0a1e36] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Main Footer Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Brand & Tagline */}
          <div className="space-y-1">
            <IdeaBridgeLogo light />
            <p className="text-xs text-blue-200/70">
              Connecting innovative minds with growth opportunities.
            </p>
          </div>

          {/* Middle Nav Links */}
          <nav className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-medium text-slate-300">
            <button
              type="button"
              onClick={() => inform('IdeaBridge connects campus creators with grant programs and angel investors.')}
              className="hover:text-white transition"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Browse Projects
            </button>
            <button
              type="button"
              onClick={() => {
                if (role === 'investor') {
                  enterWorkspace('investor', displayName || 'Northstar Ventures');
                } else {
                  setPage('investor-auth');
                }
              }}
              className="hover:text-white transition"
            >
              For Investors
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight - 700, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Blog
            </button>
            <button
              type="button"
              onClick={() => inform('Contact us at support@ideabridge.io')}
              className="hover:text-white transition"
            >
              Contact
            </button>
          </nav>

          {/* Divider line and Social Icons */}
          <div className="flex items-center gap-4">
            <span className="hidden lg:block h-6 w-px bg-white/20" />
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href="#linkedin"
                onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on LinkedIn'); }}
                className="p-1 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on X / Twitter'); }}
                className="p-1 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#instagram"
                onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on Instagram'); }}
                className="p-1 hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => { e.preventDefault(); inform('Watch IdeaBridge on YouTube'); }}
                className="p-1 hover:text-white transition"
                aria-label="YouTube"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Legal Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-slate-400">
          <div>
            <span>© 2026 IdeaBridge. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => inform('Privacy Policy: All creator ideas remain proprietary.')}
              className="hover:text-slate-200 transition"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => inform('Terms of Service: Standard collegiate ecosystem terms apply.')}
              className="hover:text-slate-200 transition"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => inform('IdeaBridge Support: Reach out via support@ideabridge.io')}
              className="hover:text-slate-200 transition"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
