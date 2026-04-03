interface SiteLogoProps {
  size?: number;
  showText?: boolean;
}

export default function SiteLogo({ size = 38, showText = true }: SiteLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: 10 }}
      >
        {/* Background */}
        <rect width="64" height="64" rx="13" fill="#00b5a3"/>

        {/* Wood plank — horizontal bar */}
        <rect x="8" y="28" width="48" height="10" rx="3" fill="rgba(255,255,255,0.18)"/>
        <line x1="8" y1="33" x2="56" y2="33" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>

        {/* Left scissor blade */}
        <circle cx="19" cy="19" r="7" fill="none" stroke="white" strokeWidth="2.8"/>
        <circle cx="19" cy="19" r="2.5" fill="white"/>

        {/* Right scissor blade */}
        <circle cx="45" cy="19" r="7" fill="none" stroke="white" strokeWidth="2.8"/>
        <circle cx="45" cy="19" r="2.5" fill="white"/>

        {/* Left handle going down-right */}
        <line x1="24" y1="24" x2="44" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>

        {/* Right handle going down-left */}
        <line x1="40" y1="24" x2="20" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>

        {/* Cut indicator line on plank */}
        <line x1="32" y1="26" x2="32" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7"/>
      </svg>

      {/* Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, overflow: 'hidden' }}>
          <span style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            fontFamily: 'Tajawal, sans-serif',
          }}>
            MASTER <span style={{ color: '#00b5a3' }}>Y</span>
          </span>
          <span style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: 'Tajawal, sans-serif',
            whiteSpace: 'nowrap',
          }}>
            Wood Cutting System
          </span>
        </div>
      )}
    </div>
  );
}
