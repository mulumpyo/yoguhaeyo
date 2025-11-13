 const TailwindcssConfig = {
  content: ["./app/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [
     require("tailwindcss-animate"),
  ],
};

export default TailwindcssConfig;