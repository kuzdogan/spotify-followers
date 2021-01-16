const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    container: {
      padding: "2rem"
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
      "8xl": "6rem",
      "9xl": "7rem",
      "10xl": "8rem"
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem"
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "9/10": "90%"
      },
      translate: {
        double: "200%",
        triple: "300%",
        quad: "400%"
      },
      height: {
        "2px": "2px"
      },
      inset: {
        "24": "5rem", // not for real
        "1/2": "50%",
        full: "100%"
      },
      transitionProperty: {
        width: "width"
      }
    }
  },
  variants: {
    borderWidth: ["responsive", "last", "hover", "focus"],
    boxShadow: {
      xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
      sm: "0 1px 2px rgba(3,49,86,0.2)",
      md: "0 3px 9px rgba(0,0,0,.5)",
      lg: "0 5px 15px rgba(0,0,0,.5)",
      xl: "0 10px 20px rgba(0,0,0,.5)",
      "2xl": "0 20px 66px 0 rgba(34,48,73,.2)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
      none: "none"
    },
    backgroundColor: ["responsive", "hover", "focus", "checked", "even"],
    margin: ["responsive", "group-hover", "last"]
  },
  plugins: []
}
