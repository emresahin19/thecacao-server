import React from 'react';
import { EyeIconProps } from '../input.props';

const EyeIcon: React.FC<EyeIconProps> = ({ show, color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" className="i-see-you">
      <defs>
        <clipPath id="clip-path" transform="translate(-8 -56)">
          <rect className="cls-1" style={{ fill: 'none' }} width="256" height="256" />
        </clipPath>
      </defs>
      <g id="katman_2">
        <g id="Icon_and_text">
          <g className="cls-2" style={{ clipPath: 'url(#clip-path)' }}>
            {!show && (
              <>
                <path
                  className="cls-3"
                  style={{
                    fill: '#366fa0',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  d="M102.34,124.78a28,28,0,1,0,52.41,2.94"
                  transform="translate(-8 -56)"
                />
                <path
                  className="cls-3"
                  style={{
                    fill: '#366fa0',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  d="M136.28,109.25a28,28,0,0,0-21.61,2.12"
                  transform="translate(-8 -56)"
                />
                <path
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  d="M136.28,109.25a14,14,0,1,0,18.47,18.47"
                  transform="translate(-8 -56)"
                />
                <circle
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  cx="120"
                  cy="80"
                  r="52"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="120"
                  y1="28"
                  x2="120"
                  y2="4"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="56"
                  y1="40"
                  x2="44"
                  y2="20"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="184"
                  y1="40"
                  x2="196"
                  y2="20"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="120"
                  y1="132"
                  x2="120"
                  y2="156"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="56"
                  y1="120"
                  x2="44"
                  y2="140"
                />
                <line
                  className="cls-3"
                  style={{
                    fill: 'none',
                    stroke: color ?? '#ddd',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '8px',
                  }}
                  x1="184"
                  y1="120"
                  x2="196"
                  y2="140"
                />
              </>
            )}
            <path
              className="cls-3"
              style={{
                fill: 'none',
                stroke: color ?? '#ddd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '8px',
              }}
              d="M244,136S204,84,128,84,12,136,12,136"
              transform="translate(-8 -56)"
            />
            <path
              className="cls-3"
              style={{
                fill: 'none',
                stroke: color ?? '#ddd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '8px',
              }}
              d="M244,136s-40,52-116,52S12,136,12,136"
              transform="translate(-8 -56)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default EyeIcon;
