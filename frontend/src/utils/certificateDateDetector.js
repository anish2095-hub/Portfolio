/**
 * Certificate Date Detection & Chronological Sorting Utility
 *
 * Automatically detects certificate issuance dates/years via:
 * 1. Image OCR (Tesseract.js text recognition)
 * 2. Filename date pattern matching
 * 3. File metadata (last modified timestamp)
 * 4. Chronological sorting (Newest first -> Oldest last)
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_VALID_YEAR = 1995;
const MAX_VALID_YEAR = CURRENT_YEAR + 2;

/**
 * Parses any date/year string into a numeric epoch timestamp for exact sorting.
 * Supports: "2024", "March 2024", "Mar 2024", "15 Aug 2024", "2024-05-12", "12/05/2023", etc.
 */
export const parseCertificateDateToTimestamp = (dateStr) => {
  if (!dateStr) return 0;
  const str = String(dateStr).trim();

  // Try direct Date.parse
  const direct = new Date(str);
  if (!isNaN(direct.getTime()) && direct.getFullYear() >= MIN_VALID_YEAR && direct.getFullYear() <= MAX_VALID_YEAR) {
    return direct.getTime();
  }

  // Look for 4-digit year (e.g., 2024)
  const yearMatches = str.match(/\b(19\d\d|20\d\d)\b/g);
  if (yearMatches && yearMatches.length > 0) {
    // If multiple years (e.g. "2023 - 2024"), pick the highest / latest one
    const validYears = yearMatches
      .map((y) => parseInt(y, 10))
      .filter((y) => y >= MIN_VALID_YEAR && y <= MAX_VALID_YEAR);

    if (validYears.length > 0) {
      const year = Math.max(...validYears);

      // Check for month
      const lower = str.toLowerCase();
      let monthIdx = 0; // Default to January
      for (let i = 0; i < MONTH_ABBR.length; i++) {
        if (lower.includes(MONTH_ABBR[i].toLowerCase()) || lower.includes(MONTH_NAMES[i].toLowerCase())) {
          monthIdx = i;
          break;
        }
      }

      // Check for day
      const dayMatch = str.match(/\b([1-9]|[12]\d|3[01])(st|nd|rd|th)?\b/i);
      let day = 1;
      if (dayMatch && parseInt(dayMatch[1], 10) !== year) {
        const potentialDay = parseInt(dayMatch[1], 10);
        if (potentialDay >= 1 && potentialDay <= 31) {
          day = potentialDay;
        }
      }

      return new Date(year, monthIdx, day).getTime();
    }
  }

  return 0;
};

/**
 * Sorts certificates strictly in descending chronological order
 * (Newest one will appear first, older ones in the last).
 */
export const sortCertificatesNewestFirst = (certificates = []) => {
  if (!Array.isArray(certificates)) return [];

  return [...certificates].sort((a, b) => {
    const timeA = parseCertificateDateToTimestamp(a?.issueDate);
    const timeB = parseCertificateDateToTimestamp(b?.issueDate);

    // If both have parseable dates, newest first
    if (timeA !== timeB) {
      return timeB - timeA;
    }

    // Fallback to order property if date is identical
    if (a?.order !== undefined && b?.order !== undefined && a.order !== b.order) {
      return a.order - b.order;
    }

    // Fallback to createdAt timestamp if available
    const createdA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return createdB - createdA;
  });
};

/**
 * Extracts date patterns from raw text string.
 */
export const extractDateFromText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.replace(/\r?\n/g, ' ');

  // Pattern 1: Explicit labels like "Issue Date: March 2024", "Date: 15/04/2024", "Awarded: 2023"
  const labelRegex = /(?:issued?(?:\s*on|\s*date)?|date(?:\s*of\s*issue)?|awarded(?:\s*on)?|completed(?:\s*on)?|certified(?:\s*on)?)\s*[:\-]?\s*([A-Za-z0-9,\s\/\.\-]+)/i;
  const labelMatch = text.match(labelRegex);
  if (labelMatch && labelMatch[1]) {
    const candidate = labelMatch[1].slice(0, 30).trim();
    const parsed = findBestDateInString(candidate);
    if (parsed) return parsed;
  }

  // Pattern 2: Search throughout whole text
  return findBestDateInString(text);
};

/**
 * Helper to find the best Month + Year or Year in a string.
 */
function findBestDateInString(str) {
  if (!str) return null;

  // Month + Year (e.g. "March 2024", "Sep 2023", "October, 2022")
  const monthNamesPattern = '(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)';
  const monthYearRegex = new RegExp(`\\b(${monthNamesPattern})[\\s,.'-]+(19\\d\\d|20\\d\\d)\\b`, 'i');
  const monthYearMatch = str.match(monthYearRegex);
  if (monthYearMatch) {
    const rawMonth = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);
    if (year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR) {
      // Normalize month to proper capitalized case
      const fullMonth = MONTH_NAMES.find(
        (m) => m.toLowerCase().startsWith(rawMonth.toLowerCase().slice(0, 3))
      ) || rawMonth;
      return `${fullMonth} ${year}`;
    }
  }

  // Day + Month + Year (e.g. "15 March 2024", "24-Oct-2023")
  const dayMonthYearRegex = new RegExp(`\\b([1-9]|[12]\\d|3[01])[\\s,.'-]+(${monthNamesPattern})[\\s,.'-]+(19\\d\\d|20\\d\\d)\\b`, 'i');
  const dmyMatch = str.match(dayMonthYearRegex);
  if (dmyMatch) {
    const year = parseInt(dmyMatch[3], 10);
    if (year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR) {
      const fullMonth = MONTH_NAMES.find(
        (m) => m.toLowerCase().startsWith(dmyMatch[2].toLowerCase().slice(0, 3))
      ) || dmyMatch[2];
      return `${fullMonth} ${year}`;
    }
  }

  // ISO / Numeric Date (e.g. 2024-05-12 or 12/05/2024)
  const numDateRegex = /\b(19\d\d|20\d\d)[/-](\d{1,2})[/-](\d{1,2})\b/;
  const numMatch = str.match(numDateRegex);
  if (numMatch) {
    const year = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10);
    if (year >= MIN_VALID_YEAR && year <= MAX_VALID_YEAR && month >= 1 && month <= 12) {
      return `${MONTH_NAMES[month - 1]} ${year}`;
    }
  }

  // Standalone 4-digit years (e.g., 2024, 2023, 2022)
  const allYears = str.match(/\b(19\d\d|20\d\d)\b/g);
  if (allYears && allYears.length > 0) {
    const validYears = allYears
      .map((y) => parseInt(y, 10))
      .filter((y) => y >= MIN_VALID_YEAR && y <= MAX_VALID_YEAR);

    if (validYears.length > 0) {
      // Return highest year found
      return String(Math.max(...validYears));
    }
  }

  return null;
}

/**
 * Detects date from filename (e.g. "React_Certificate_2024.jpg", "aws_cert_mar_2023.png")
 */
export const detectDateFromFilename = (fileName) => {
  if (!fileName || typeof fileName !== 'string') return null;
  // Clean separators
  const sanitized = fileName.replace(/[_.\-+]/g, ' ');
  return findBestDateInString(sanitized);
};

/**
 * Main Date Detector: Reads date/year from uploaded file using:
 * 1. Filename & Metadata (Instant)
 * 2. Tesseract OCR on image (Deep Content Reading)
 *
 * @param {File} file - The uploaded image file
 * @param {function} onProgress - Optional callback reporting OCR progress
 * @returns {Promise<{ date: string, source: string, confidence: number }>}
 */
export const detectCertificateDate = async (file, onProgress) => {
  if (!file) return null;

  // 1. Instant check from filename
  const filenameDate = detectDateFromFilename(file.name);

  // 2. OCR Reading on image file
  let ocrDate = null;
  try {
    if (file.type && file.type.startsWith('image/')) {
      if (onProgress) onProgress('Scanning certificate text (OCR)...');

      // Dynamically import tesseract.js
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');

      const ret = await worker.recognize(file);
      await worker.terminate();

      if (ret && ret.data && ret.data.text) {
        ocrDate = extractDateFromText(ret.data.text);
      }
    }
  } catch (err) {
    console.warn('[CertificateDateDetector] OCR scan skipped/failed, falling back to metadata:', err?.message || err);
  }

  // OCR date has highest authority if found inside the certificate image
  if (ocrDate) {
    return {
      date: ocrDate,
      source: 'ocr',
      message: `Detected "${ocrDate}" from certificate text`,
    };
  }

  // Filename date has next highest authority
  if (filenameDate) {
    return {
      date: filenameDate,
      source: 'filename',
      message: `Detected "${filenameDate}" from filename`,
    };
  }

  // Last modified metadata fallback if recent
  if (file.lastModified) {
    const modYear = new Date(file.lastModified).getFullYear();
    if (modYear >= MIN_VALID_YEAR && modYear <= CURRENT_YEAR) {
      const monthName = MONTH_NAMES[new Date(file.lastModified).getMonth()];
      const metaDate = `${monthName} ${modYear}`;
      return {
        date: metaDate,
        source: 'metadata',
        message: `Detected "${metaDate}" from file timestamp`,
      };
    }
  }

  return null;
};
