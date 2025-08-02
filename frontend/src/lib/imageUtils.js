// Server base URL - should be configurable in production
const SERVER_BASE_URL = "http://localhost:4000";

/**
 * Constructs the full image URL from a partial path or filename
 * @param {string} imageUrl - Can be a full URL, relative path, or just filename
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "/placeholder-product.png"; // Default placeholder
  }

  // If it's already a full URL (starts with http/https), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it starts with /img/, it's already a server path
  if (imageUrl.startsWith("/img/")) {
    return `${SERVER_BASE_URL}${imageUrl}`;
  }

  // If it's just a filename, assume it's in the server's img directory
  return `${SERVER_BASE_URL}/img/${imageUrl}`;
};

/**
 * Gets the server base URL
 * @returns {string} - Server base URL
 */
export const getServerUrl = () => {
  return SERVER_BASE_URL;
};
