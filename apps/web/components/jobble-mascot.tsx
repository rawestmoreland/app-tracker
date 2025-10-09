'use client';

import { cn } from '@/lib/utils';

interface JobbleMascotProps {
  variant?:
    | 'default'
    | 'celebrating'
    | 'confused'
    | 'sleeping'
    | 'stressed'
    | 'thinking'
    | 'waving'
    | 'tired'
    | 'excited';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function JobbleMascot({
  variant = 'default',
  size = 'md',
  className,
}: JobbleMascotProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  if (variant === 'default') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Left arm juggling */}
        <path
          d="M 60 95 Q 35 85 25 70"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="25" cy="70" r="8" fill="#3B82F6" />

        {/* Right arm juggling */}
        <path
          d="M 140 95 Q 165 85 175 70"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="175" cy="70" r="8" fill="#3B82F6" />

        {/* Middle arm juggling */}
        <path
          d="M 100 85 Q 100 50 100 30"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="100" cy="30" r="8" fill="#3B82F6" />

        {/* Bottom left arm */}
        <path
          d="M 70 130 Q 50 140 45 155"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="45" cy="155" r="8" fill="#3B82F6" />

        {/* Bottom right arm */}
        <path
          d="M 130 130 Q 150 140 155 155"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="155" cy="155" r="8" fill="#3B82F6" />

        {/* Juggled items (job applications) */}
        {/* Application 1 - Green */}
        <circle cx="20" cy="55" r="12" fill="#10B981" opacity="0.9" />
        <circle cx="20" cy="55" r="8" fill="#34D399" opacity="0.7" />

        {/* Application 2 - Purple */}
        <circle cx="100" cy="15" r="12" fill="#8B5CF6" opacity="0.9" />
        <circle cx="100" cy="15" r="8" fill="#A78BFA" opacity="0.7" />

        {/* Application 3 - Orange */}
        <circle cx="180" cy="55" r="12" fill="#F59E0B" opacity="0.9" />
        <circle cx="180" cy="55" r="8" fill="#FBBf24" opacity="0.7" />

        {/* Application 4 - Pink */}
        <circle cx="40" cy="140" r="12" fill="#EC4899" opacity="0.9" />
        <circle cx="40" cy="140" r="8" fill="#F9A8D4" opacity="0.7" />

        {/* Application 5 - Cyan */}
        <circle cx="160" cy="140" r="12" fill="#06B6D4" opacity="0.9" />
        <circle cx="160" cy="140" r="8" fill="#67E8F9" opacity="0.7" />

        {/* Face */}
        {/* Eyes */}
        <ellipse cx="88" cy="105" rx="4" ry="6" fill="#1E293B" />
        <ellipse cx="112" cy="105" rx="4" ry="6" fill="#1E293B" />

        {/* Eye highlights */}
        <circle cx="89" cy="103" r="1.5" fill="white" />
        <circle cx="113" cy="103" r="1.5" fill="white" />

        {/* Happy smile */}
        <path
          d="M 85 120 Q 100 128 115 120"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <ellipse cx="75" cy="115" rx="6" ry="4" fill="#F472B6" opacity="0.4" />
        <ellipse cx="125" cy="115" rx="6" ry="4" fill="#F472B6" opacity="0.4" />
      </svg>
    );
  }

  if (variant === 'celebrating') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Left arm raised */}
        <path
          d="M 60 95 Q 40 75 30 50"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="30" cy="50" r="8" fill="#3B82F6" />

        {/* Right arm raised */}
        <path
          d="M 140 95 Q 160 75 170 50"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="170" cy="50" r="8" fill="#3B82F6" />

        {/* Confetti */}
        <rect
          x="25"
          y="30"
          width="4"
          height="8"
          fill="#10B981"
          opacity="0.8"
          transform="rotate(45 27 34)"
        />
        <rect
          x="165"
          y="30"
          width="4"
          height="8"
          fill="#F59E0B"
          opacity="0.8"
          transform="rotate(-45 167 34)"
        />
        <circle cx="50" cy="35" r="3" fill="#EC4899" opacity="0.8" />
        <circle cx="150" cy="35" r="3" fill="#8B5CF6" opacity="0.8" />
        <rect
          x="38"
          y="25"
          width="3"
          height="6"
          fill="#06B6D4"
          opacity="0.8"
        />
        <rect
          x="160"
          y="25"
          width="3"
          height="6"
          fill="#F472B6"
          opacity="0.8"
        />

        {/* Face - Excited expression */}
        {/* Eyes - wide open */}
        <circle cx="88" cy="105" r="5" fill="#1E293B" />
        <circle cx="112" cy="105" r="5" fill="#1E293B" />

        {/* Eye highlights */}
        <circle cx="90" cy="103" r="2" fill="white" />
        <circle cx="114" cy="103" r="2" fill="white" />

        {/* Big smile */}
        <path
          d="M 82 118 Q 100 132 118 118"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <ellipse cx="72" cy="115" rx="8" ry="5" fill="#F472B6" opacity="0.5" />
        <ellipse cx="128" cy="115" rx="8" ry="5" fill="#F472B6" opacity="0.5" />
      </svg>
    );
  }

  if (variant === 'confused') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Left arm scratching head */}
        <path
          d="M 60 95 Q 50 70 70 60"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="70" cy="60" r="8" fill="#3B82F6" />

        {/* Right arm hanging */}
        <path
          d="M 140 110 Q 155 120 160 135"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="160" cy="135" r="8" fill="#3B82F6" />

        {/* Question marks floating */}
        <text
          x="130"
          y="50"
          fontSize="24"
          fill="#64748B"
          opacity="0.6"
          fontWeight="bold"
        >
          ?
        </text>
        <text
          x="150"
          y="70"
          fontSize="18"
          fill="#64748B"
          opacity="0.4"
          fontWeight="bold"
        >
          ?
        </text>

        {/* Face - Confused expression */}
        {/* Eyes - one raised */}
        <ellipse cx="88" cy="103" rx="4" ry="6" fill="#1E293B" />
        <ellipse cx="112" cy="107" rx="4" ry="6" fill="#1E293B" />

        {/* Eye highlights */}
        <circle cx="89" cy="101" r="1.5" fill="white" />
        <circle cx="113" cy="105" r="1.5" fill="white" />

        {/* Confused mouth - wavy */}
        <path
          d="M 85 122 Q 93 120 100 122 Q 107 124 115 122"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eyebrows - one raised */}
        <path
          d="M 82 95 Q 88 92 94 95"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 100 L 118 100"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 'sleeping') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob, slightly tilted */}
        <ellipse cx="100" cy="120" rx="50" ry="55" fill="#3B82F6" />

        {/* Arms resting */}
        <path
          d="M 65 110 Q 50 115 45 125"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="45" cy="125" r="8" fill="#3B82F6" />

        <path
          d="M 135 110 Q 150 115 155 125"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="155" cy="125" r="8" fill="#3B82F6" />

        {/* Sleeping Z's */}
        <text
          x="130"
          y="70"
          fontSize="20"
          fill="#64748B"
          opacity="0.5"
          fontWeight="bold"
        >
          Z
        </text>
        <text
          x="145"
          y="55"
          fontSize="16"
          fill="#64748B"
          opacity="0.4"
          fontWeight="bold"
        >
          Z
        </text>
        <text
          x="155"
          y="42"
          fontSize="12"
          fill="#64748B"
          opacity="0.3"
          fontWeight="bold"
        >
          z
        </text>

        {/* Face - Sleeping */}
        {/* Closed eyes */}
        <path
          d="M 82 112 Q 88 114 94 112"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 112 Q 112 114 118 112"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Small peaceful smile */}
        <path
          d="M 90 128 Q 100 132 110 128"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 'stressed') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Multiple arms everywhere - overwhelmed */}
        <path
          d="M 55 90 Q 30 80 20 65"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="65" r="8" fill="#3B82F6" />

        <path
          d="M 145 90 Q 170 80 180 65"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="180" cy="65" r="8" fill="#3B82F6" />

        <path
          d="M 70 95 Q 45 85 35 70"
          stroke="#3B82F6"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="35" cy="70" r="7" fill="#3B82F6" />

        <path
          d="M 130 95 Q 155 85 165 70"
          stroke="#3B82F6"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="165" cy="70" r="7" fill="#3B82F6" />

        <path
          d="M 100 85 Q 100 55 95 30"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="95" cy="30" r="8" fill="#3B82F6" />

        <path
          d="M 105 85 Q 110 50 115 25"
          stroke="#3B82F6"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="115" cy="25" r="7" fill="#3B82F6" />

        {/* Applications falling/scattered */}
        <circle cx="15" cy="50" r="10" fill="#EF4444" opacity="0.8" />
        <circle cx="185" cy="50" r="10" fill="#EF4444" opacity="0.8" />
        <circle cx="90" cy="12" r="10" fill="#EF4444" opacity="0.8" />
        <circle cx="120" cy="10" r="9" fill="#EF4444" opacity="0.8" />

        {/* Sweat drops */}
        <ellipse
          cx="75"
          cy="85"
          rx="3"
          ry="5"
          fill="#06B6D4"
          opacity="0.6"
        />
        <ellipse
          cx="125"
          cy="85"
          rx="3"
          ry="5"
          fill="#06B6D4"
          opacity="0.6"
        />

        {/* Face - Stressed expression */}
        {/* Wide, stressed eyes */}
        <circle cx="88" cy="105" r="5" fill="#1E293B" />
        <circle cx="112" cy="105" r="5" fill="#1E293B" />

        {/* Tiny eye highlights */}
        <circle cx="89" cy="103" r="1.5" fill="white" />
        <circle cx="113" cy="103" r="1.5" fill="white" />

        {/* Worried frown */}
        <path
          d="M 85 125 Q 100 120 115 125"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Worried eyebrows */}
        <path
          d="M 78 95 Q 84 92 90 94"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 110 94 Q 116 92 122 95"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 'thinking') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Left arm on chin */}
        <path
          d="M 70 110 Q 75 125 85 130"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="85" cy="130" r="8" fill="#3B82F6" />

        {/* Right arm hanging down */}
        <path
          d="M 135 115 Q 145 130 150 145"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="150" cy="145" r="8" fill="#3B82F6" />

        {/* Thought bubble */}
        <circle cx="140" cy="50" r="18" fill="white" opacity="0.9" />
        <circle cx="155" cy="65" r="12" fill="white" opacity="0.9" />
        <circle cx="125" cy="35" r="8" fill="white" opacity="0.8" />

        {/* Light bulb in thought bubble */}
        <circle cx="140" cy="48" r="6" fill="#FCD34D" opacity="0.8" />
        <path
          d="M 138 54 L 138 57"
          stroke="#64748B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 142 54 L 142 57"
          stroke="#64748B"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Face - Thinking expression */}
        {/* Eyes looking up */}
        <ellipse cx="88" cy="102" rx="4" ry="5" fill="#1E293B" />
        <ellipse cx="112" cy="102" rx="4" ry="5" fill="#1E293B" />

        {/* Eye highlights */}
        <circle cx="89" cy="100" r="1.5" fill="white" />
        <circle cx="113" cy="100" r="1.5" fill="white" />

        {/* Thoughtful small smile */}
        <path
          d="M 88 120 Q 100 124 112 120"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Concentrated eyebrows */}
        <path
          d="M 80 96 L 94 98"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 98 L 120 96"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 'waving') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob */}
        <ellipse cx="100" cy="110" rx="50" ry="55" fill="#3B82F6" />

        {/* Left arm down */}
        <path
          d="M 65 110 Q 50 125 45 140"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="45" cy="140" r="8" fill="#3B82F6" />

        {/* Right arm waving up */}
        <path
          d="M 140 95 Q 165 75 175 55"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="175" cy="55" r="8" fill="#3B82F6" />

        {/* Wave motion lines */}
        <path
          d="M 165 50 Q 170 45 175 40"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 170 55 Q 178 50 185 45"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* Face - Friendly expression */}
        {/* Happy eyes */}
        <ellipse cx="88" cy="105" rx="4" ry="6" fill="#1E293B" />
        <ellipse cx="112" cy="105" rx="4" ry="6" fill="#1E293B" />

        {/* Eye highlights */}
        <circle cx="89" cy="103" r="1.5" fill="white" />
        <circle cx="113" cy="103" r="1.5" fill="white" />

        {/* Big friendly smile */}
        <path
          d="M 82 118 Q 100 128 118 118"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Happy eyebrows */}
        <path
          d="M 80 98 Q 88 96 94 98"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 98 Q 112 96 118 98"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy cheeks */}
        <ellipse cx="75" cy="115" rx="7" ry="5" fill="#F472B6" opacity="0.5" />
        <ellipse cx="125" cy="115" rx="7" ry="5" fill="#F472B6" opacity="0.5" />
      </svg>
    );
  }

  if (variant === 'tired') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob, slouching */}
        <ellipse cx="100" cy="120" rx="50" ry="50" fill="#3B82F6" />

        {/* Both arms hanging low */}
        <path
          d="M 60 115 Q 45 130 40 145"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="40" cy="145" r="8" fill="#3B82F6" />

        <path
          d="M 140 115 Q 155 130 160 145"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="160" cy="145" r="8" fill="#3B82F6" />

        {/* Sweat drop */}
        <ellipse
          cx="72"
          cy="100"
          rx="3"
          ry="5"
          fill="#06B6D4"
          opacity="0.5"
        />

        {/* Coffee cup nearby */}
        <rect
          x="145"
          y="155"
          width="20"
          height="25"
          rx="2"
          fill="#8B4513"
          opacity="0.7"
        />
        <ellipse cx="155" cy="155" rx="10" ry="3" fill="#A0522D" opacity="0.7" />

        {/* Steam from coffee */}
        <path
          d="M 150 150 Q 148 140 150 135"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 160 150 Q 162 142 160 135"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* Face - Exhausted */}
        {/* Tired droopy eyes */}
        <path
          d="M 82 115 Q 88 117 94 115"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 115 Q 112 117 118 115"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dark circles under eyes */}
        <ellipse
          cx="88"
          cy="118"
          rx="8"
          ry="3"
          fill="#64748B"
          opacity="0.2"
        />
        <ellipse
          cx="112"
          cy="118"
          rx="8"
          ry="3"
          fill="#64748B"
          opacity="0.2"
        />

        {/* Tired flat mouth */}
        <line
          x1="85"
          y1="130"
          x2="115"
          y2="130"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Tired eyebrows */}
        <path
          d="M 78 108 Q 88 106 94 108"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 106 108 Q 112 106 122 108"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === 'excited') {
    return (
      <svg
        className={cn(sizeClasses[size], className)}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main body - rounded blob, bouncing */}
        <ellipse cx="100" cy="105" rx="50" ry="58" fill="#3B82F6" />

        {/* Both arms up energetically */}
        <path
          d="M 55 90 Q 35 70 25 50"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="25" cy="50" r="8" fill="#3B82F6" />

        <path
          d="M 145 90 Q 165 70 175 50"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="175" cy="50" r="8" fill="#3B82F6" />

        {/* Energy/sparkle lines */}
        <path
          d="M 20 40 L 22 48 L 30 42"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 180 40 L 178 48 L 170 42"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Star sparkles */}
        <path
          d="M 100 30 L 102 36 L 108 36 L 103 40 L 105 46 L 100 42 L 95 46 L 97 40 L 92 36 L 98 36 Z"
          fill="#FCD34D"
          opacity="0.8"
        />

        {/* Face - Super excited */}
        {/* Star eyes */}
        <path
          d="M 88 105 L 90 110 L 95 110 L 91 113 L 93 118 L 88 115 L 83 118 L 85 113 L 81 110 L 86 110 Z"
          fill="#1E293B"
        />
        <path
          d="M 112 105 L 114 110 L 119 110 L 115 113 L 117 118 L 112 115 L 107 118 L 109 113 L 105 110 L 110 110 Z"
          fill="#1E293B"
        />

        {/* Huge excited smile */}
        <path
          d="M 80 120 Q 100 138 120 120"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Open mouth detail */}
        <ellipse cx="100" cy="128" rx="10" ry="6" fill="#1E293B" opacity="0.3" />

        {/* Super rosy cheeks */}
        <ellipse cx="70" cy="115" rx="10" ry="6" fill="#F472B6" opacity="0.6" />
        <ellipse
          cx="130"
          cy="115"
          rx="10"
          ry="6"
          fill="#F472B6"
          opacity="0.6"
        />
      </svg>
    );
  }

  return null;
}
