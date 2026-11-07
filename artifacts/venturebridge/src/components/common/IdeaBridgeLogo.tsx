export interface IdeaBridgeLogoProps {
  onClick?: () => void;
  light?: boolean;
}

export default function IdeaBridgeLogo({ onClick, light = false }: IdeaBridgeLogoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 text-left transition hover:opacity-90"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#14539a] via-[#1a6ec9] to-[#2e88ed] text-white shadow-sm ring-1 ring-blue-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <circle cx="5" cy="18" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="18" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7" r="2.8" fill="currentColor" stroke="none" />
          <path d="M5 15.5C7.5 10 9.5 8 12 8s4.5 2 7 7.5" />
        </svg>
      </div>
      <div>
        <span className={`text-[20px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#0f2d52]'}`}>
          Idea<span className="text-[#3b82f6]">Bridge</span>
        </span>
      </div>
    </button>
  );
}
