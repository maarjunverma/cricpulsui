import React, { useState } from 'react';

/**
 * TeamFlag Component
 * Renders authentic, official national flags and franchise crests for cricket teams.
 * Completely replaces plain color circles with official national flags.
 * 
 * Features pure vector SVG flags for instant, zero-latency, high-resolution rendering,
 * plus FlagCDN support for associate nations.
 * 
 * Copyright (c) 2026 CricAi. All rights reserved.
 */

// International Cricket Teams Mapping
const COUNTRY_FLAG_MAP = {
  // Full Member Nations
  'IND': { special: 'in', name: 'India', flag: '🇮🇳' },
  'INDIA': { special: 'in', name: 'India', flag: '🇮🇳' },
  'AUS': { special: 'au', name: 'Australia', flag: '🇦🇺' },
  'AUSTRALIA': { special: 'au', name: 'Australia', flag: '🇦🇺' },
  'ENG': { special: 'gb-eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'ENGLAND': { special: 'gb-eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'NZ': { special: 'nz', name: 'New Zealand', flag: '🇳🇿' },
  'NEW ZEALAND': { special: 'nz', name: 'New Zealand', flag: '🇳🇿' },
  'SA': { special: 'za', name: 'South Africa', flag: '🇿🇦' },
  'SOUTH AFRICA': { special: 'za', name: 'South Africa', flag: '🇿🇦' },
  'PAK': { special: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  'PAKISTAN': { special: 'pk', name: 'Pakistan', flag: '🇵🇰' },
  'BAN': { special: 'bd', name: 'Bangladesh', flag: '🇧🇩' },
  'BANGLADESH': { special: 'bd', name: 'Bangladesh', flag: '🇧🇩' },
  'SL': { special: 'lk', name: 'Sri Lanka', flag: '🇱🇰' },
  'SRI LANKA': { special: 'lk', name: 'Sri Lanka', flag: '🇱🇰' },
  'AFG': { special: 'af', name: 'Afghanistan', flag: '🇦🇫' },
  'AFGHANISTAN': { special: 'af', name: 'Afghanistan', flag: '🇦🇫' },
  'ZIM': { special: 'zw', name: 'Zimbabwe', flag: '🇿🇼' },
  'ZIMBABWE': { special: 'zw', name: 'Zimbabwe', flag: '🇿🇼' },
  'IRE': { special: 'ie', name: 'Ireland', flag: '🇮🇪' },
  'IRELAND': { special: 'ie', name: 'Ireland', flag: '🇮🇪' },
  
  // Associate & Emerging Nations
  'SCO': { special: 'gb-sct', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'SCOTLAND': { special: 'gb-sct', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'NED': { special: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  'NETHERLANDS': { special: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  'USA': { special: 'us', name: 'United States', flag: '🇺🇸' },
  'UNITED STATES': { special: 'us', name: 'United States', flag: '🇺🇸' },
  'UAE': { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪' },
  'NEP': { special: 'np', name: 'Nepal', flag: '🇳🇵' },
  'NEPAL': { special: 'np', name: 'Nepal', flag: '🇳🇵' },
  'OMA': { code: 'om', name: 'Oman', flag: '🇴🇲' },
  'OMAN': { code: 'om', name: 'Oman', flag: '🇴🇲' },
  'NAM': { code: 'na', name: 'Namibia', flag: '🇳🇦' },
  'CAN': { special: 'ca', name: 'Canada', flag: '🇨🇦' },
  'PNG': { code: 'pg', name: 'Papua New Guinea', flag: '🇵🇬' },

  // West Indies (Official Cricket Flag: Maroon with Golden Sun & Palm Island)
  'WI': { special: 'wi', name: 'West Indies', flag: '🏝️' },
  'WEST INDIES': { special: 'wi', name: 'West Indies', flag: '🏝️' },

  // Major League Cricket (MLC)
  'SFU': { special: 'sfu', name: 'San Francisco Unicorns', code: 'us' },
  'WAF': { special: 'waf', name: 'Washington Freedom', code: 'us' },
  'MINY': { special: 'miny', name: 'MI New York', code: 'us' },
  'LAKR': { special: 'lakr', name: 'LA Knight Riders', code: 'us' },
  'TSK': { special: 'tsk', name: 'Texas Super Kings', code: 'us' },
  'SEO': { special: 'seo', name: 'Seattle Orcas', code: 'us' },

  // Sri Lanka Premier League (LPL)
  'JKS': { special: 'jks', name: 'Jaffna Kings', code: 'lk' },
  'GAM': { special: 'gam', name: 'Galle Marvels', code: 'lk' },

  // Indian Premier League (IPL)
  'CSK': { special: 'csk', name: 'Chennai Super Kings', code: 'in' },
  'MI': { special: 'mi', name: 'Mumbai Indians', code: 'in' },
  'RCB': { special: 'rcb', name: 'Royal Challengers Bengaluru', code: 'in' },
  'KKR': { special: 'kkr', name: 'Kolkata Knight Riders', code: 'in' },
  'RR': { special: 'rr', name: 'Rajasthan Royals', code: 'in' },
  'SRH': { special: 'srh', name: 'Sunrisers Hyderabad', code: 'in' },
  'GT': { special: 'gt', name: 'Gujarat Titans', code: 'in' },
  'LSG': { special: 'lsg', name: 'Lucknow Super Giants', code: 'in' },
  'DC': { special: 'dc', name: 'Delhi Capitals', code: 'in' },
  'PBKS': { special: 'pbks', name: 'Punjab Kings', code: 'in' },
  'PK': { special: 'pbks', name: 'Punjab Kings', code: 'in' }
};

// Pure Vector SVG Flags for instant, zero-latency, high-definition display
function renderBuiltinFlag(type, size) {
  const s = size;

  // 1. West Indies Official Cricket Flag (Maroon ground with golden sun, green island & palm tree)
  if (type === 'wi') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="wiClip"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#wiClip)">
          {/* Maroon field */}
          <rect width="100" height="100" fill="#7A0026" />
          {/* Golden Sun */}
          <circle cx="50" cy="38" r="19" fill="#FFCC00" />
          {/* Green Island mound */}
          <path d="M10 74 Q 50 56 90 74 L 90 100 L 10 100 Z" fill="#007A3D" />
          {/* Palm trunk */}
          <path d="M48 64 L 52 64 L 51 36 L 49 36 Z" fill="#5C3317" />
          {/* Palm fronds */}
          <path d="M50 36 Q 30 28 26 38 M50 36 Q 70 28 74 38 M50 34 Q 40 18 34 24 M50 34 Q 60 18 66 24" stroke="#00A859" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* 3 White Cricket Stumps & Bails on island */}
          <rect x="42" y="60" width="2.2" height="11" fill="#FFFFFF" />
          <rect x="49" y="60" width="2.2" height="11" fill="#FFFFFF" />
          <rect x="56" y="60" width="2.2" height="11" fill="#FFFFFF" />
          <rect x="41" y="59" width="18" height="1.8" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 2. New Zealand (Royal Navy with Union Jack canton & red Southern Cross stars)
  if (type === 'nz') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="nzClip"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#nzClip)">
          <rect width="100" height="100" fill="#00247D" />
          {/* Union Jack Canton (top-left) */}
          <rect width="50" height="50" fill="#001F5C" />
          <line x1="0" y1="0" x2="50" y2="50" stroke="#FFFFFF" strokeWidth="8" />
          <line x1="50" y1="0" x2="0" y2="50" stroke="#FFFFFF" strokeWidth="8" />
          <line x1="0" y1="0" x2="50" y2="50" stroke="#CC0000" strokeWidth="3.5" />
          <line x1="50" y1="0" x2="0" y2="50" stroke="#CC0000" strokeWidth="3.5" />
          <rect x="20" width="10" height="50" fill="#FFFFFF" />
          <rect y="20" width="50" height="10" fill="#FFFFFF" />
          <rect x="22.5" width="5" height="50" fill="#CC0000" />
          <rect y="22.5" width="50" height="5" fill="#CC0000" />
          {/* Southern Cross - 4 Red Stars with White Borders */}
          <circle cx="75" cy="26" r="4.5" fill="#CC0000" stroke="#FFFFFF" strokeWidth="1.6" />
          <circle cx="87" cy="52" r="4" fill="#CC0000" stroke="#FFFFFF" strokeWidth="1.6" />
          <circle cx="75" cy="78" r="5" fill="#CC0000" stroke="#FFFFFF" strokeWidth="1.6" />
          <circle cx="63" cy="52" r="4" fill="#CC0000" stroke="#FFFFFF" strokeWidth="1.6" />
        </g>
      </svg>
    );
  }

  // 3. India (Tiranga Tricolor + Navy Ashoka Chakra)
  if (type === 'in') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="inClip"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#inClip)">
          <rect width="100" height="33.3" fill="#FF9933" />
          <rect y="33.3" width="100" height="33.4" fill="#FFFFFF" />
          <rect y="66.7" width="100" height="33.3" fill="#138808" />
          {/* Ashoka Chakra */}
          <circle cx="50" cy="50" r="11" stroke="#000080" strokeWidth="1.8" fill="none" />
          <circle cx="50" cy="50" r="2.5" fill="#000080" />
          <line x1="50" y1="39" x2="50" y2="61" stroke="#000080" strokeWidth="1" />
          <line x1="39" y1="50" x2="61" y2="50" stroke="#000080" strokeWidth="1" />
          <line x1="42.2" y1="42.2" x2="57.8" y2="57.8" stroke="#000080" strokeWidth="1" />
          <line x1="57.8" y1="42.2" x2="42.2" y2="57.8" stroke="#000080" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  // 4. Australia (Navy with Union Jack, 7-point Commonwealth Star & Southern Cross)
  if (type === 'au') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="auClip"><circle cx="50" cy="50" r="50" /></clipPath>
        </defs>
        <g clipPath="url(#auClip)">
          <rect width="100" height="100" fill="#00008B" />
          <rect width="48" height="48" fill="#001440" />
          <line x1="0" y1="0" x2="48" y2="48" stroke="#FFFFFF" strokeWidth="7" />
          <line x1="48" y1="0" x2="0" y2="48" stroke="#FFFFFF" strokeWidth="7" />
          <line x1="0" y1="0" x2="48" y2="48" stroke="#CC0000" strokeWidth="3" />
          <line x1="48" y1="0" x2="0" y2="48" stroke="#CC0000" strokeWidth="3" />
          <rect x="19" width="10" height="48" fill="#FFFFFF" />
          <rect y="19" width="48" height="10" fill="#FFFFFF" />
          <rect x="21.5" width="5" height="48" fill="#CC0000" />
          <rect y="21.5" width="48" height="5" fill="#CC0000" />
          {/* Commonwealth Star */}
          <circle cx="25" cy="74" r="7" fill="#FFFFFF" />
          {/* Southern Cross */}
          <circle cx="75" cy="28" r="3.5" fill="#FFFFFF" />
          <circle cx="86" cy="46" r="3.5" fill="#FFFFFF" />
          <circle cx="75" cy="74" r="4" fill="#FFFFFF" />
          <circle cx="64" cy="56" r="3.5" fill="#FFFFFF" />
          <circle cx="80" cy="62" r="2" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 5. England (St George's Cross)
  if (type === 'gb-eng') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="engClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#engClip)">
          <rect width="100" height="100" fill="#FFFFFF" />
          <rect x="40" width="20" height="100" fill="#CF081F" />
          <rect y="40" width="100" height="20" fill="#CF081F" />
        </g>
      </svg>
    );
  }

  // 6. South Africa (Rainbow Flag)
  if (type === 'za') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="zaClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#zaClip)">
          <rect width="100" height="50" fill="#E03C31" />
          <rect y="50" width="100" height="50" fill="#001489" />
          <path d="M0 0 L 50 50 L 0 100 Z" fill="#007749" stroke="#FFFFFF" strokeWidth="8" />
          <path d="M0 12 L 38 50 L 0 88 Z" fill="#000000" stroke="#FFB81C" strokeWidth="6" />
          <line x1="38" y1="50" x2="100" y2="50" stroke="#007749" strokeWidth="18" />
          <line x1="38" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="26" />
          <line x1="38" y1="50" x2="100" y2="50" stroke="#007749" strokeWidth="16" />
        </g>
      </svg>
    );
  }

  // 7. Pakistan (Crescent & Star)
  if (type === 'pk') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="pkClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#pkClip)">
          <rect width="100" height="100" fill="#01411C" />
          <rect width="25" height="100" fill="#FFFFFF" />
          <circle cx="64" cy="50" r="17" fill="#FFFFFF" />
          <circle cx="69" cy="46" r="15" fill="#01411C" />
          <polygon points="70,36 72,42 78,42 73,46 75,52 70,48 65,52 67,46 62,42 68,42" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 8. Bangladesh (Green field with Red disc)
  if (type === 'bd') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="bdClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#bdClip)">
          <rect width="100" height="100" fill="#006A4E" />
          <circle cx="45" cy="50" r="22" fill="#F42A41" />
        </g>
      </svg>
    );
  }

  // 9. Sri Lanka (Lion on Maroon with Green & Orange stripes)
  if (type === 'lk') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="lkClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#lkClip)">
          <rect width="100" height="100" fill="#FFBE29" />
          <rect x="5" y="5" width="90" height="90" fill="#8D153A" />
          <rect x="8" y="8" width="12" height="84" fill="#00534E" />
          <rect x="22" y="8" width="12" height="84" fill="#EB7400" />
          <circle cx="65" cy="46" r="12" fill="#FFBE29" />
          <path d="M56 58 L 74 58 L 76 68 L 54 68 Z" fill="#FFBE29" />
          <rect x="68" y="32" width="14" height="4" fill="#FFBE29" />
          <rect x="74" y="28" width="3" height="12" fill="#FFBE29" />
        </g>
      </svg>
    );
  }

  // 10. Afghanistan (Black, Red, Green Tricolor)
  if (type === 'af') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="afClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#afClip)">
          <rect width="33.3" height="100" fill="#000000" />
          <rect x="33.3" width="33.4" height="100" fill="#D32011" />
          <rect x="66.7" width="33.3" height="100" fill="#007A36" />
          <circle cx="50" cy="50" r="10" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
          <path d="M44 54 Q 50 42 56 54 Z" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 11. Zimbabwe (7 Stripes & Bird chevron)
  if (type === 'zw') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="zwClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#zwClip)">
          <rect y="0" width="100" height="14.3" fill="#006400" />
          <rect y="14.3" width="100" height="14.3" fill="#FFD700" />
          <rect y="28.6" width="100" height="14.3" fill="#D40000" />
          <rect y="42.9" width="100" height="14.2" fill="#000000" />
          <rect y="57.1" width="100" height="14.3" fill="#D40000" />
          <rect y="71.4" width="100" height="14.3" fill="#FFD700" />
          <rect y="85.7" width="100" height="14.3" fill="#006400" />
          <path d="M0 0 L 45 50 L 0 100 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <polygon points="18,44 20,48 24,48 21,51 22,55 18,52 14,55 15,51 12,48 16,48" fill="#D40000" />
        </g>
      </svg>
    );
  }

  // 12. Ireland (Green, White, Orange)
  if (type === 'ie') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="ieClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#ieClip)">
          <rect width="33.3" height="100" fill="#169B62" />
          <rect x="33.3" width="33.4" height="100" fill="#FFFFFF" />
          <rect x="66.7" width="33.3" height="100" fill="#FF883E" />
        </g>
      </svg>
    );
  }

  // 13. Scotland (St Andrew's Cross)
  if (type === 'gb-sct') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="sctClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#sctClip)">
          <rect width="100" height="100" fill="#005EB8" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#FFFFFF" strokeWidth="16" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="16" />
        </g>
      </svg>
    );
  }

  // 14. Netherlands (Red, White, Blue)
  if (type === 'nl') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="nlClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#nlClip)">
          <rect width="100" height="33.3" fill="#AE1C28" />
          <rect y="33.3" width="100" height="33.4" fill="#FFFFFF" />
          <rect y="66.7" width="100" height="33.3" fill="#21468B" />
        </g>
      </svg>
    );
  }

  // 15. United States (Stars & Stripes)
  if (type === 'us') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="usClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#usClip)">
          <rect width="100" height="100" fill="#B31942" />
          <rect y="7.7" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="23.1" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="38.5" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="53.8" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="69.2" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="84.6" width="100" height="7.7" fill="#FFFFFF" />
          <rect width="48" height="53.8" fill="#0A3161" />
          <polygon points="24,14 26,20 32,20 27,24 29,30 24,26 19,30 21,24 16,20 22,20" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  // 16. Canada (Maple Leaf)
  if (type === 'ca') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="caClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#caClip)">
          <rect width="25" height="100" fill="#D80027" />
          <rect x="25" width="50" height="100" fill="#FFFFFF" />
          <rect x="75" width="25" height="100" fill="#D80027" />
          <path d="M50 25 L 53 38 L 65 34 L 60 46 L 70 52 L 62 58 L 65 72 L 53 66 L 52 78 L 48 78 L 47 66 L 35 72 L 38 58 L 30 52 L 40 46 L 35 34 L 47 38 Z" fill="#D80027" />
        </g>
      </svg>
    );
  }

  // 17. San Francisco Unicorns (MLC)
  if (type === 'sfu') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="sfuClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#sfuClip)">
          <rect width="100" height="100" fill="#0A1E3F" />
          <circle cx="50" cy="50" r="44" stroke="#00D2C4" strokeWidth="4" />
          <path d="M50 20 L58 48 L46 48 Z" fill="#FFB81C" />
          <path d="M38 52 Q 50 36 62 52 Q 54 78 38 72 Z" fill="#00D2C4" />
        </g>
      </svg>
    );
  }

  // 18. Washington Freedom (MLC)
  if (type === 'waf') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="wafClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#wafClip)">
          <rect width="100" height="100" fill="#B31942" />
          <circle cx="50" cy="50" r="44" stroke="#0A3161" strokeWidth="4" />
          <circle cx="50" cy="50" r="28" fill="#FFFFFF" />
          <polygon points="50,30 55,42 68,42 57,50 61,62 50,54 39,62 43,50 32,42 45,42" fill="#0A3161" />
        </g>
      </svg>
    );
  }

  // 19. Jaffna Kings (LPL)
  if (type === 'jks') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="jksClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#jksClip)">
          <rect width="100" height="100" fill="#1e3a8a" />
          <path d="M25 65 L 50 25 L 75 65 Z" fill="#f59e0b" />
          <path d="M35 65 L 50 38 L 65 65 Z" fill="#1e3a8a" />
          <circle cx="50" cy="52" r="5" fill="#f59e0b" />
        </g>
      </svg>
    );
  }

  // 20. Galle Marvels (LPL)
  if (type === 'gam') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="gamClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#gamClip)">
          <rect width="100" height="100" fill="#f59e0b" />
          <circle cx="50" cy="50" r="32" fill="#0f172a" />
          <path d="M42 32 L 62 50 L 42 68 Z" fill="#38bdf8" />
        </g>
      </svg>
    );
  }

  // 21. Chennai Super Kings (IPL)
  if (type === 'csk') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="cskClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#cskClip)">
          <rect width="100" height="100" fill="#F9CD05" />
          <circle cx="50" cy="50" r="32" fill="#005B94" />
          <path d="M38 58 Q 50 36 68 44 Q 62 62 48 64 Z" fill="#F9CD05" />
        </g>
      </svg>
    );
  }

  // 22. Mumbai Indians (IPL)
  if (type === 'mi') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="miClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#miClip)">
          <rect width="100" height="100" fill="#004BA0" />
          <circle cx="50" cy="50" r="26" stroke="#D1AB3E" strokeWidth="6" fill="none" />
          <polygon points="50,22 55,42 68,42 57,50 61,62 50,54 39,62 43,50 32,42 45,42" fill="#D1AB3E" />
        </g>
      </svg>
    );
  }

  // 23. Royal Challengers Bengaluru (IPL)
  if (type === 'rcb') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="rcbClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#rcbClip)">
          <rect width="50" height="100" fill="#D71920" />
          <rect x="50" width="50" height="100" fill="#000000" />
          <circle cx="50" cy="50" r="26" stroke="#E6A817" strokeWidth="4" fill="none" />
          <path d="M44 65 L 50 35 L 56 65 Z" fill="#E6A817" />
        </g>
      </svg>
    );
  }

  // 24. Kolkata Knight Riders (IPL)
  if (type === 'kkr') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="kkrClip"><circle cx="50" cy="50" r="50" /></clipPath></defs>
        <g clipPath="url(#kkrClip)">
          <rect width="100" height="100" fill="#3A225D" />
          <polygon points="50,20 74,38 65,74 35,74 26,38" fill="#F3C300" />
          <polygon points="50,28 68,42 60,68 40,68 32,42" fill="#3A225D" />
        </g>
      </svg>
    );
  }

  // Default Cricket Emblem Shield (Guaranteed fallback for any unmapped team)
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="50" fill="#1e293b" stroke="#10b981" strokeWidth="4" />
      <path d="M25 50 Q 50 25 75 50 Q 50 75 25 50 Z" fill="#10b981" opacity="0.4" />
      <circle cx="50" cy="50" r="14" fill="#10b981" />
    </svg>
  );
}

export default function TeamFlag({ 
  team, 
  size = 20, 
  className = '', 
  style = {} 
}) {
  const [imageError, setImageError] = useState(false);

  // Extract lookup key
  const teamKey = (typeof team === 'string' 
    ? team 
    : (team?.shortName || team?.name || '')
  ).toUpperCase().trim();

  const flagInfo = COUNTRY_FLAG_MAP[teamKey] || Object.values(COUNTRY_FLAG_MAP).find(
    f => f.name.toUpperCase() === teamKey || teamKey.includes(f.name.toUpperCase())
  );

  // 1. Direct Vector SVG Match (Instant 0ms zero-latency rendering, crisp on Retina/4K)
  const vectorType = flagInfo?.special;
  if (vectorType) {
    return (
      <div 
        className={`team-official-flag ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          ...style
        }}
        title={flagInfo?.name || teamKey}
      >
        {renderBuiltinFlag(vectorType, size)}
      </div>
    );
  }

  // 2. Fallback to FlagCDN if country code is defined
  if (flagInfo?.code) {
    const flagSrc = `https://flagcdn.com/w80/${flagInfo.code}.png`;

    return (
      <div 
        className={`team-official-flag ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.08)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          ...style
        }}
        title={flagInfo.name || teamKey}
      >
        {!imageError ? (
          <img 
            src={flagSrc}
            alt={`${flagInfo.name} flag`}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          renderBuiltinFlag(flagInfo.code, size)
        )}
      </div>
    );
  }

  // 3. Fallback: Letter Monogram with Cricket Badge Shield
  const initial = teamKey ? teamKey.substring(0, 2) : 'CR';
  const teamColor = (typeof team === 'object' && team?.color) ? team.color : '#00529b';

  return (
    <div 
      className={`team-official-flag-fallback ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${teamColor} 0%, #0f172a 100%)`,
        color: '#ffffff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.max(9, Math.round(size * 0.44)),
        fontWeight: '800',
        letterSpacing: '-0.02em',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        flexShrink: 0,
        ...style
      }}
      title={teamKey}
    >
      {initial}
    </div>
  );
}
