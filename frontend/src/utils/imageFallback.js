// Smart image sanitizer and fallback provider to eliminate broken ImgBB 503 images

export const DEFAULT_PROJECT_COVER =
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';

export const DEFAULT_CERT_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

// Curated fallbacks based on project titles/topics
export const getProjectFallback = (title = '', category = '') => {
  const t = title.toLowerCase();
  if (t.includes('movie') || t.includes('film') || t.includes('cast')) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80';
  }
  if (t.includes('laundary') || t.includes('laundry')) {
    return 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1000&q=80';
  }
  if (t.includes('commerce') || t.includes('store') || t.includes('shop')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80';
  }
  if (t.includes('cloud') || t.includes('vault') || t.includes('secret')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80';
  }
  if (t.includes('ai') || t.includes('synapse') || category === 'ai-cloud') {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80';
  }
  return DEFAULT_PROJECT_COVER;
};

// Curated fallbacks based on certificate title / issuer
export const getCertificateFallback = (title = '', issuer = '') => {
  const str = `${title} ${issuer}`.toLowerCase();
  if (str.includes('python')) {
    return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80';
  }
  if (str.includes('hackathon') || str.includes('hacklith') || str.includes('spark')) {
    return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';
  }
  if (str.includes('cisco') || str.includes('network') || str.includes('essential')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80';
  }
  if (str.includes('unicef') || str.includes('yuwaah') || str.includes('productivity')) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  }
  if (str.includes('internship') || str.includes('techsharthi')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
  }
  return DEFAULT_CERT_IMAGE;
};

// Returns a safe image URL, immediately intercepting dead or 503-prone ImgBB links
export const getSafeImageUrl = (url, fallbackUrl) => {
  if (!url || typeof url !== 'string') return fallbackUrl;
  // If it points to ibb.co which returns 503 "imgbb.com service unavailable", replace with fallbackUrl
  if (url.includes('i.ibb.co') || url.includes('imgbb.com')) {
    return fallbackUrl;
  }
  return url;
};
