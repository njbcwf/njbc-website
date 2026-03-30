/**
 * public/utils.js
 *
 * Shared utility functions available to all page code.
 *
 * HOW TO USE:
 * 1. In Velo sidebar → Public → New File → name it "utils.js"
 * 2. Paste this entire file
 * 3. Import what you need: import { formatDate } from 'public/utils.js';
 */

/**
 * formatDate
 * Converts a JS Date or Wix date string into a friendly readable string.
 * e.g. new Date('2025-04-06') → "Sunday, April 6, 2025"
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/**
 * formatShortDate
 * e.g. "Apr 6" — useful for compact event cards
 *
 * @param {Date|string} date
 * @returns {string}
 */
export function formatShortDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * buildYouTubeThumb
 * Returns the high-quality thumbnail URL for a YouTube video ID.
 * Use this as the src for an Image element.
 *
 * @param {string} videoId - just the ID, e.g. "dQw4w9WgXcQ"
 * @returns {string} - full thumbnail URL
 */
export function buildYouTubeThumb(videoId) {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * buildYouTubeUrl
 * Returns the full YouTube watch URL for a video ID.
 *
 * @param {string} videoId
 * @returns {string}
 */
export function buildYouTubeUrl(videoId) {
  if (!videoId) return 'http://www.youtube.com/@NJBCWF';
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * truncateText
 * Shortens a string to a max length and adds an ellipsis.
 * Useful for keeping repeater card text consistent.
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * isToday
 * Returns true if the given date is today.
 *
 * @param {Date|string} date
 * @returns {boolean}
 */
export function isToday(date) {
  const d     = date instanceof Date ? date : new Date(date);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth()    &&
    d.getDate()     === today.getDate()
  );
}

/**
 * getDaysUntil
 * Returns the number of days from today until the given date.
 * Returns 0 if the date is today or in the past.
 *
 * @param {Date|string} date
 * @returns {number}
 */
export function getDaysUntil(date) {
  const d     = date instanceof Date ? date : new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = d - today;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
