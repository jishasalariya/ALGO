export function getOptimizedImageUrl(url: string, width = 800): string {
  if (!url) return "";
  if (url.includes("res.cloudinary.com") && !url.includes("/image/upload/q_auto")) {
    return url.replace("/image/upload/", `/image/upload/q_auto,f_auto,w_${width}/`);
  }
  return url;
}
