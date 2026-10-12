/**
 * Brand icons.
 *
 * Lucide removed brand logos from its icon set, so GitHub and LinkedIn are
 * inlined here instead of pulling in an extra icon dependency.
 * Both paths follow the official brand marks and inherit `currentColor`.
 */

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
}

export function GithubIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.47-3.71-1.47-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.69 1.14 1.69 1.14.99 1.69 2.6 1.2 3.23.92.1-.71.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.29 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.42 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.02.75 2.06v3.05c0 .29.2.64.76.53 4.36-1.46 7.51-5.58 7.51-10.44C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  )
}

export function LinkedinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}
