import React from 'react'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'

/**
 * Traditional Indian Lotus Corner Filigree (SVG)
 * Provides authentic antique gold filigree flourishes in the 4 corners of the parchment.
 */
export function LotusCornerFiligree({ className = '' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`border-corner-flourish ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer corner framing curve */}
      <path
        d="M2 14 C2 6, 6 2, 14 2"
        stroke="#c49438"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Intricate lotus petal flourish */}
      <path
        d="M5 22 C6 14, 14 6, 22 5 C17 10, 10 17, 5 22 Z"
        fill="rgba(196, 148, 56, 0.28)"
        stroke="#b88628"
        strokeWidth="1"
      />
      {/* Secondary vine curl */}
      <path
        d="M2 30 C3 20, 10 12, 18 10 C12 16, 8 24, 6 30"
        stroke="#c49438"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M30 2 C20 3, 12 10, 10 18 C16 12, 24 8, 30 6"
        stroke="#c49438"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Corner bud node */}
      <circle cx="8" cy="8" r="2" fill="#d4a74a" stroke="#875c1d" strokeWidth="0.8" />
      <circle cx="15" cy="15" r="1.5" fill="#c49438" />
    </svg>
  )
}

/**
 * Dimensional Sculpted Finial (SVG)
 * Handcrafted antique Indian royal roller end fitting.
 * Anatomy:
 *   1. Recessed dark wood-to-metal socket connection.
 *   2. Sculpted turned brass collar with fluting and chamfer.
 *   3. Granulated beaded pearl ring (Moti-Mala).
 *   4. Sculpted acorn/lotus-bud domed finial head (Kalasha style).
 *   5. Pointed royal finial apex tip.
 */
export function ScrollFinial({ side = 'left', className = '' }) {
  const isRight = side === 'right'
  return (
    <div
      className={`scroll-finial-wrapper ${side} ${className}`}
      style={{
        transform: isRight ? 'scaleX(-1)' : 'none',
        transformOrigin: 'center center',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 46 80"
        className="scroll-finial-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Top highlight specular gradient */}
          <linearGradient id="finialGoldHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#F5D278" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#B38025" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#381E04" stopOpacity="0.8" />
          </linearGradient>

          {/* Core turned brass gradient for cylindrical volume */}
          <linearGradient id="turnedBrassGradient" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A2608" />
            <stop offset="12%" stopColor="#9C6B1F" />
            <stop offset="28%" stopColor="#E5BE65" />
            <stop offset="42%" stopColor="#FFF5D2" />
            <stop offset="58%" stopColor="#D9A948" />
            <stop offset="78%" stopColor="#875314" />
            <stop offset="92%" stopColor="#4A2608" />
            <stop offset="100%" stopColor="#241103" />
          </linearGradient>

          {/* Deep recessed shadow gradient */}
          <linearGradient id="recessSocketGradient" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#180709" />
            <stop offset="35%" stopColor="#331215" />
            <stop offset="65%" stopColor="#25090C" />
            <stop offset="100%" stopColor="#0F0304" />
          </linearGradient>

          {/* Spherical radial highlight on finial bulb */}
          <radialGradient id="finialBulbRadial" cx="36%" cy="34%" r="65%">
            <stop offset="0%" stopColor="#FFFFEB" />
            <stop offset="25%" stopColor="#F3D17A" />
            <stop offset="60%" stopColor="#A87522" />
            <stop offset="85%" stopColor="#633C0A" />
            <stop offset="100%" stopColor="#301A03" />
          </radialGradient>

          {/* Finial tip radial highlight */}
          <radialGradient id="finialTipRadial" cx="30%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="35%" stopColor="#E2B755" />
            <stop offset="75%" stopColor="#8B5917" />
            <stop offset="100%" stopColor="#3D2005" />
          </radialGradient>

          {/* Bead gradient */}
          <radialGradient id="beadGold" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FDE397" />
            <stop offset="75%" stopColor="#B48227" />
            <stop offset="100%" stopColor="#4F2D06" />
          </radialGradient>
        </defs>

        {/* 1. Recessed Socket Collar (Connecting into the wooden rod) */}
        <rect
          x="39"
          y="16"
          width="7"
          height="48"
          rx="1.5"
          fill="url(#recessSocketGradient)"
        />
        <rect
          x="39"
          y="16"
          width="1.5"
          height="48"
          fill="#100304"
          opacity="0.9"
        />

        {/* 2. Primary Sculpted Brass Ferrule Collar */}
        <path
          d="M32 12 Q35 12 39 15 L39 65 Q35 68 32 68 L32 12 Z"
          fill="url(#turnedBrassGradient)"
          stroke="#522D08"
          strokeWidth="0.75"
        />
        {/* Specular highlight stripe along the upper curvature */}
        <path
          d="M32 14 L39 16.5 L39 26 L32 24 Z"
          fill="url(#finialGoldHighlight)"
          opacity="0.85"
        />
        {/* Recessed engraving rings on the ferrule */}
        <line x1="34.5" y1="13" x2="34.5" y2="67" stroke="#482506" strokeWidth="0.8" />
        <line x1="35.5" y1="13" x2="35.5" y2="67" stroke="#FFE9A8" strokeWidth="0.6" strokeOpacity="0.75" />
        <line x1="37.5" y1="14" x2="37.5" y2="66" stroke="#482506" strokeWidth="0.8" />

        {/* 3. Granulated Beaded Pearl Ring (Moti-Mala) */}
        <rect
          x="28.5"
          y="15"
          width="3.5"
          height="50"
          rx="1"
          fill="#402005"
        />
        {/* Vertical string of golden beads */}
        {[18, 22.5, 27, 31.5, 36, 40.5, 45, 49.5, 54, 58.5, 62].map((cy) => (
          <circle key={cy} cx="30.2" cy={cy} r="1.9" fill="url(#beadGold)" />
        ))}

        {/* 4. Tiered Brass Transition Ring */}
        <path
          d="M25 18 C26.5 18 28.5 16 28.5 16 L28.5 64 C28.5 64 26.5 62 25 62 Z"
          fill="url(#turnedBrassGradient)"
          stroke="#4D2706"
          strokeWidth="0.6"
        />

        {/* 5. Sculpted Acorn / Lotus-Bud Domed Finial Head (Kalasha) */}
        {/* Profile: starts at neck, curves outwards into full dimensional bulb, tapers back */}
        <path
          d="M10 40 
             C10 32, 14 20, 21 21 
             C23.5 21.5, 25 22.5, 25 24 
             L25 56 
             C25 57.5, 23.5 58.5, 21 59 
             C14 60, 10 48, 10 40 Z"
          fill="url(#finialBulbRadial)"
          stroke="#522D08"
          strokeWidth="0.8"
        />
        {/* Ornamental petal fluting ridges on the bulb */}
        <path
          d="M11 40 C14 31, 20 25, 25 25"
          stroke="#FFE69E"
          strokeWidth="0.75"
          strokeOpacity="0.85"
          fill="none"
        />
        <path
          d="M10.5 40 C14 33, 20 27, 25 27"
          stroke="#5A3409"
          strokeWidth="0.6"
          fill="none"
        />
        <path
          d="M10 40 C14 48, 20 54, 25 54"
          stroke="#381D04"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M11 40 C14 47, 20 53, 25 53"
          stroke="#8A5615"
          strokeWidth="0.6"
          fill="none"
        />

        {/* 6. Finial Neck Collar */}
        <ellipse cx="10" cy="40" rx="1.8" ry="6.5" fill="url(#recessSocketGradient)" />
        <ellipse cx="10.4" cy="40" rx="1.4" ry="5.5" fill="url(#beadGold)" />

        {/* 7. Pointed Royal Finial Apex Tip (Teardrop Lotus Bud) */}
        <path
          d="M1 40 
             C3.5 36.5, 7 35.5, 9 36.5 
             L9 43.5 
             C7 44.5, 3.5 43.5, 1 40 Z"
          fill="url(#finialTipRadial)"
          stroke="#5A3409"
          strokeWidth="0.6"
        />
        {/* Specular apex glint */}
        <circle cx="3.5" cy="39" r="0.8" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  )
}

/**
 * Carved Indian Royal Ornamental Band (SVG)
 * Features:
 *   - Rich royal burgundy velvet/lacquer background with cylindrical 3D shading.
 *   - Twin raised antique gold inlaid wire borders with specular glints.
 *   - Authentic repeating Indian floral lotus florets with center gold granulation beads.
 *   - Recessed dark engraving outlines creating authentic depth.
 */
export function OrnamentalBand({ className = '' }) {
  return (
    <div className={`scroll-ornamental-band ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 24 84"
        className="ornamental-band-svg"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Velvet cylindrical shading gradient */}
          <linearGradient id="bandVelvetGradient" x1="0" y1="0" x2="0" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#250508" />
            <stop offset="10%" stopColor="#4A0B12" />
            <stop offset="25%" stopColor="#6E121B" />
            <stop offset="42%" stopColor="#8A1824" />
            <stop offset="60%" stopColor="#6B111A" />
            <stop offset="80%" stopColor="#450A10" />
            <stop offset="92%" stopColor="#280508" />
            <stop offset="100%" stopColor="#140204" />
          </linearGradient>

          {/* Gold wire inlay gradient */}
          <linearGradient id="bandGoldWire" x1="0" y1="0" x2="0" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#54300A" />
            <stop offset="15%" stopColor="#B38025" />
            <stop offset="35%" stopColor="#FEE4A0" />
            <stop offset="50%" stopColor="#DCA847" />
            <stop offset="75%" stopColor="#966318" />
            <stop offset="90%" stopColor="#522C08" />
            <stop offset="100%" stopColor="#2A1403" />
          </linearGradient>

          {/* Bead gradient for motif centers */}
          <radialGradient id="motifBeadGold" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFE08D" />
            <stop offset="80%" stopColor="#B47E22" />
            <stop offset="100%" stopColor="#4F2D06" />
          </radialGradient>
        </defs>

        {/* 1. Velvet core background */}
        <rect x="0" y="0" width="24" height="84" fill="url(#bandVelvetGradient)" />

        {/* 2. Left Raised Gold Inlay Border with shadow */}
        <line x1="0.5" y1="0" x2="0.5" y2="84" stroke="#100304" strokeWidth="1" />
        <line x1="1.8" y1="0" x2="1.8" y2="84" stroke="url(#bandGoldWire)" strokeWidth="1.6" />
        <line x1="3.2" y1="0" x2="3.2" y2="84" stroke="#2A050A" strokeWidth="0.8" />

        {/* 3. Right Raised Gold Inlay Border with shadow */}
        <line x1="20.8" y1="0" x2="20.8" y2="84" stroke="#2A050A" strokeWidth="0.8" />
        <line x1="22.2" y1="0" x2="22.2" y2="84" stroke="url(#bandGoldWire)" strokeWidth="1.6" />
        <line x1="23.5" y1="0" x2="23.5" y2="84" stroke="#100304" strokeWidth="1" />

        {/* 4. Traditional Indian Repeating Floral Motifs (Stacked vertically) */}
        {[13, 27, 42, 57, 71].map((cy) => (
          <g key={cy} className="band-floret-group">
            {/* Recessed shadow behind motif */}
            <path
              d={`M12 ${cy - 5.5} 
                  C14 ${cy - 2.5}, 16.5 ${cy - 1}, 17 ${cy} 
                  C16.5 ${cy + 1}, 14 ${cy + 2.5}, 12 ${cy + 5.5} 
                  C10 ${cy + 2.5}, 7.5 ${cy + 1}, 7 ${cy} 
                  C7.5 ${cy - 1}, 10 ${cy - 2.5}, 12 ${cy - 5.5} Z`}
              fill="#1F0407"
            />
            {/* Antique gold 4-petal lotus floret */}
            <path
              d={`M12 ${cy - 4.8} 
                  C13.8 ${cy - 2.2}, 15.8 ${cy - 0.8}, 16.2 ${cy} 
                  C15.8 ${cy + 0.8}, 13.8 ${cy + 2.2}, 12 ${cy + 4.8} 
                  C10.2 ${cy + 2.2}, 8.2 ${cy + 0.8}, 7.8 ${cy} 
                  C8.2 ${cy - 0.8}, 10.2 ${cy - 2.2}, 12 ${cy - 4.8} Z`}
              fill="url(#bandGoldWire)"
              stroke="#542E09"
              strokeWidth="0.4"
            />
            {/* Raised central gold bead */}
            <circle cx="12" cy={cy} r="1.5" fill="url(#motifBeadGold)" />
            {/* Subtle filigree connecting pip */}
            <circle cx="12" cy={cy - 6.8} r="0.7" fill="#E8BD65" opacity="0.8" />
          </g>
        ))}

        {/* 5. Top Specular Sheen & Bottom Curvature Occlusion Overlay */}
        <rect
          x="0"
          y="0"
          width="24"
          height="84"
          fill="url(#finialGoldHighlight)"
          style={{ mixBlendMode: 'screen', opacity: 0.2 }}
        />
      </svg>
    </div>
  )
}

/**
 * Centerpiece Antique Gold Filigree Sleeve (SVG)
 * Provides an intricate engraved royal emblem for the top & bottom roller centers.
 */
export function RollerCenterFiligree({ className = '' }) {
  return (
    <div className={`roller-centerpiece-filigree ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 64 20"
        className="centerpiece-filigree-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="centerGold" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#966318" stopOpacity="0" />
            <stop offset="20%" stopColor="#C89632" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFF2C6" />
            <stop offset="80%" stopColor="#C89632" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#966318" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Center Diamond / Lotus Crest */}
        <path
          d="M32 2 L38 10 L32 18 L26 10 Z"
          fill="url(#centerGold)"
          stroke="#4F2D06"
          strokeWidth="0.6"
        />
        <circle cx="32" cy="10" r="2" fill="#FFEAA8" />

        {/* Left flowing filigree vine */}
        <path
          d="M26 10 C21 8, 16 13, 11 10 C7 7, 3 10, 0 10"
          stroke="url(#centerGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="11.5" r="1.2" fill="#D6A540" />
        <circle cx="8" cy="9" r="1" fill="#C89632" />

        {/* Right flowing filigree vine */}
        <path
          d="M38 10 C43 8, 48 13, 53 10 C57 7, 61 10, 64 10"
          stroke="url(#centerGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="48" cy="11.5" r="1.2" fill="#D6A540" />
        <circle cx="56" cy="9" r="1" fill="#C89632" />
      </svg>
    </div>
  )
}

/**
 * Embossed Royal Ganesha Seal (SVG + Image)
 * A heavy, dimensional antique gold royal medallion:
 *   - Cast shadow on parchment.
 *   - Outer sculpted gold bezel with top-light bevel and bottom shadow.
 *   - Granulated beaded ring (Moti-Mala) with 24 model beads.
 *   - Recessed stepped ring with etched radial sunburst/lotus rays.
 *   - Transparent golden Lord Ganesha emblem with embossed metallic depth.
 */
export function EmbossedRoyalSeal({ className = '' }) {
  // 24 perimeter beads calculated around circumference
  const beadCount = 24
  const radius = 25
  const center = 31
  const beads = Array.from({ length: beadCount }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / beadCount
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  })

  return (
    <div className={`embossed-royal-seal-container ${className}`}>
      <svg
        viewBox="0 0 62 62"
        className="embossed-seal-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Beveled outer bezel gradient */}
          <linearGradient id="bezelGradient" x1="12" y1="8" x2="50" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFEE8" />
            <stop offset="25%" stopColor="#F1CE74" />
            <stop offset="55%" stopColor="#B37E22" />
            <stop offset="85%" stopColor="#693F0C" />
            <stop offset="100%" stopColor="#301A03" />
          </linearGradient>

          {/* Recessed inner disc gradient */}
          <radialGradient id="recessedDiscGradient" cx="38%" cy="36%" r="62%">
            <stop offset="0%" stopColor="#FFF3CE" />
            <stop offset="35%" stopColor="#E2B755" />
            <stop offset="70%" stopColor="#9C6B1B" />
            <stop offset="90%" stopColor="#623C0A" />
            <stop offset="100%" stopColor="#3A1E04" />
          </radialGradient>

          {/* Granulation bead radial gradient */}
          <radialGradient id="sealBeadGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFE08F" />
            <stop offset="75%" stopColor="#B58123" />
            <stop offset="100%" stopColor="#4A2605" />
          </radialGradient>
        </defs>

        {/* 1. Outer Sculpted Brass Bezel */}
        <circle cx="31" cy="31" r="29.5" fill="url(#bezelGradient)" stroke="#4A2505" strokeWidth="1" />
        {/* Highlight inner rim */}
        <circle cx="31" cy="31" r="28" stroke="#FFEBA8" strokeWidth="0.8" strokeOpacity="0.85" />

        {/* 2. Granulated Beaded Pearl Ring (Moti-Mala) */}
        <circle cx="31" cy="31" r="25" fill="#3D1C04" />
        {beads.map((b, idx) => (
          <circle key={idx} cx={b.x} cy={b.y} r="1.55" fill="url(#sealBeadGrad)" />
        ))}

        {/* 3. Recessed Inner Step with Etched Sunburst Rays */}
        <circle cx="31" cy="31" r="21.5" fill="url(#recessedDiscGradient)" stroke="#4D2706" strokeWidth="0.8" />
        
        {/* 16 Subtle Etched Radial Rays */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 2 * Math.PI) / 16
          const x1 = 31 + 10 * Math.cos(a)
          const y1 = 31 + 10 * Math.sin(a)
          const x2 = 31 + 20.5 * Math.cos(a)
          const y2 = 31 + 20.5 * Math.sin(a)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFE7A3"
              strokeWidth="0.5"
              strokeOpacity="0.6"
            />
          )
        })}

        {/* Inner ornamental ring */}
        <circle cx="31" cy="31" r="18" stroke="#7A4E12" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
      </svg>

      {/* 4. Centerpiece Ganesha Emblem */}
      <div className="seal-inner-icon-wrapper">
        <img
          src={ganeshaSymbolUrl}
          alt="Royal Ganesha Seal"
          className="seal-ganesha-emblem-img"
        />
      </div>
    </div>
  )
}
