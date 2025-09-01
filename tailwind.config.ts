import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Apollo Color System
      colors: {
        // Primary Colors (Blueberry)
        blueberry: {
          50: "#EBEFF7",
          100: "#CDC5EB",
          200: "#AB9FDF",
          300: "#8978D3",
          400: "#6E5CC9",
          500: "#5141CD", // Primary
          600: "#473CB9",
          700: "#3634B0",
          800: "#262FA8",
          900: "#00249A",
        },

        // Neutral Colors (Grayscale)
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
          1000: "#0A0A0A",
        },

        // Success Colors
        success: {
          50: "#EAFBE6",
          100: "#CBF4C1",
          200: "#A6EC98",
          300: "#7CE36A",
          400: "#52DC43",
          500: "#00D504",
          600: "#00C400",
          700: "#00A300",
          800: "#008500",
          900: "#006100",
        },

        // Error Colors
        error: {
          50: "#FFEDEC",
          100: "#FFC8CC",
          200: "#FF918E",
          300: "#FF6462",
          400: "#FF3A39",
          500: "#FFC1B13",
          600: "#ED0017",
          700: "#DC0011",
          800: "#C40107",
          900: "#A30000",
        },

        // Warning Colors
        warning: {
          50: "#FFF4E2",
          100: "#FFE0B2",
          200: "#FFCD81",
          300: "#FFEB84E",
          400: "#FFA827",
          500: "#FF9F29",
          600: "#ED0017",
          700: "#D66F03",
          800: "#B55E22",
          900: "#8D3811",
        },

        // Semantic color mappings for consistency with existing setup
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      // Apollo Typography System
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
        sans: ["Open Sans", "Roboto", "system-ui", "sans-serif"],
      },

      fontSize: {
        // Based on your type scale
        "heading-1": [
          "60px",
          { lineHeight: "1.2", letterSpacing: "-0.5px", fontWeight: "300" },
        ],
        "heading-2": [
          "34px",
          { lineHeight: "1.3", letterSpacing: "0.25px", fontWeight: "400" },
        ],
        "heading-3": [
          "20px",
          { lineHeight: "1.4", letterSpacing: "0.15px", fontWeight: "500" },
        ],
        subtitle: [
          "18px",
          { lineHeight: "1.4", letterSpacing: "0.15px", fontWeight: "700" },
        ],
        body: [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.5px", fontWeight: "400" },
        ],
        "body-bold": [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.25px", fontWeight: "700" },
        ],
        button: [
          "14px",
          { lineHeight: "1.4", letterSpacing: "1.25px", fontWeight: "600" },
        ],
        overline: [
          "10px",
          { lineHeight: "1.6", letterSpacing: "1.5px", fontWeight: "400" },
        ],
      },

      // Button and component styling
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        button: "8px", // Standard button radius
      },

      // Spacing for consistent design
      spacing: {
        "18": "4.5rem", // 72px
        "22": "5.5rem", // 88px
      },

      // Box shadows for depth
      boxShadow: {
        button: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "button-hover": "0 4px 8px rgba(0, 0, 0, 0.15)",
        card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },

      // Animation keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "siri-border-animation": {
          "0%": { borderColor: "#FF6B6B" },
          "25%": { borderColor: "#FFD166" },
          "50%": { borderColor: "#06D6A0" },
          "75%": { borderColor: "#118AB2" },
          "100%": { borderColor: "#FF6B6B" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "siri-border": "siri-border-animation 4s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
