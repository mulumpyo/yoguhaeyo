const robots = () => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://yoguhaeyo.mulumpyo.com/sitemap.xml",
  };
}

export default robots;