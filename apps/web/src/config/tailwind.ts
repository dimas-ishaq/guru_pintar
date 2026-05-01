/**
 * Tailwind CSS configuration for inline <script> tag.
 * Returns the JavaScript string to configure tailwind.config.
 */
export function tailwindConfig(): string {
  return `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#2036bd",
            "primary-container": "#3e52d5",
            "background": "#f8f9ff",
            "on-background": "#0b1c30",
            "surface": "#f8f9ff",
            "on-surface": "#0b1c30",
            "secondary": "#545f73",
            "outline": "#757686",
          },
          spacing: {
            "margin": "2rem",
            "gutter": "1.5rem",
            "xl": "2.5rem",
            "lg": "1.5rem",
            "md": "1rem",
            "sm": "0.5rem",
          },
          fontFamily: {
            sans: ['Poppins', 'sans-serif'],
          }
        },
      },
    }
  `;
}
