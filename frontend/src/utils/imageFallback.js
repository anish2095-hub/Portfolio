// Helper for handling broken images without overwriting user's real images

export const handleImageError = (e, fallbackSrc) => {
  if (e?.currentTarget && fallbackSrc) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackSrc;
  }
};
