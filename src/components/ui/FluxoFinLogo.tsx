import React from 'react';

interface FluxoFinLogoProps {
  className?: string;
}

export function FluxoFinLogo({ className = 'w-12 h-12' }: FluxoFinLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Círculo externo dourado */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Seta de fluxo ascendente (símbolo de crescimento) */}
      <path
        d="M 30 65 L 50 35 L 70 65"
        stroke="url(#goldGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Linha de base (símbolo de estabilidade) */}
      <line
        x1="25"
        y1="70"
        x2="75"
        y2="70"
        stroke="url(#goldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Pontos de dados (gráfico minimalista) */}
      <circle cx="35" cy="60" r="3" fill="#C59D3E" />
      <circle cx="50" cy="45" r="3" fill="#D4B76A" />
      <circle cx="65" cy="55" r="3" fill="#C59D3E" />
      
      {/* Linhas conectando os pontos */}
      <line
        x1="35"
        y1="60"
        x2="50"
        y2="45"
        stroke="#C59D3E"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line
        x1="50"
        y1="45"
        x2="65"
        y2="55"
        stroke="#D4B76A"
        strokeWidth="1.5"
        opacity="0.6"
      />
      
      {/* Gradiente dourado */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C59D3E" />
          <stop offset="50%" stopColor="#D4B76A" />
          <stop offset="100%" stopColor="#C59D3E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
