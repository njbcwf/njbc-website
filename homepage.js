/**
 * NJBC Homepage — Page Code (homepage.js)
 * Paste this into the Page Code panel at the bottom of your Wix Editor
 * while viewing the Home page.
 *
 * Requires: wix-data, wix-window, public/utils.js, backend/prayers.jsw
 */

import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { formatDate, buildYouTubeThumb, buildYouTubeUrl } from 'public/utils.js';
import { submitPrayerRequest } from 'backend/prayers.jsw';

// ─────────────────────────────────────────────
// PAGE READY
// ─────────────────────────────────────────────
$w.onReady(async () => {
  // Run all loaders in parallel for fast page load
  await Promise.all([
    loadAnnouncements(),
    loadUpcomingEvents(),
    loadFeaturedSermon(),
  ]);

  setupPrayerForm();
  animateHero();
});

// ─────────────────────────────────────────────
// HERO ANIMATION
// ─────────────────────────────────────────────
function animateHero() {
  // Fade in hero elements sequentially
  $w('#heroTitle').show('fade', { duration: 800 });

  setTimeout(() => {
    $w('#heroTagline').show('fade', { duration: 700 });
  }, 300);

  setTimeout(() => {
    $w('#heroCTA').show('fade', { duration: 600 });
  }, 600);
}

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────
async function loadAnnouncements() {
  try {
    const results = await wixData.query('Announcements')
      .eq('isActive', true)
      .ascending('sortOrder')
      .limit(6)
      .find();

    if (results.items.length === 0) {
      // Hide the strip entirely if no active announcements
      $w('#announcementsStrip').hide();
      return;
    }

    $w('#announcementRepeater').data = results.items;

    $w('#announcementRepeater').onItemReady(($item, itemData) => {
      $item('#annTag').text   = itemData.tag   || 'Notice';
      $item('#annTitle').text = itemData.title || '';
      $item('#annBody').text  = itemData.body  || '';

      // Color-code the tag badge by type
      const tagColors = {
        'Urgent':  '#c0392b',
        'New':     '#27ae60',
        'Event':   '#2980b9',
        'Notice':  '#7f8c8d',
      };
      const color = tagColors[itemData.tag] || '#c9a227';
      $item('#annTag').style.backgroundColor = color;
    });

  } catch (err) {
    console.error('Announcements load error:', err);
    $w('#announcementsStrip').hide();
  }
}

// ─────────────────────────────────────────────
// UPCOMING EVENTS
// ─────────────────────────────────────────────
async function loadUpcomingEvents() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = await wixData.query('Events')
      .ge('eventDate', today)      // only future or today
      .ascending('eventDate')
      .limit(6)
      .find();

    if (results.items.length === 0) {
      $w('#eventsRepeater').hide();
      $w('#noEventsMsg').show();
      return;
    }

    $w('#noEventsMsg').hide();
    $w('#eventsRepeater').data = results.items;

    $w('#eventsRepeater').onItemReady(($item, itemData) => {
      $item('#evtTitle').text    = itemData.title       || 'Untitled Event';
      $item('#evtTime').text     = itemData.timeLabel   || '';
      $item('#evtLocation').text = itemData.location    || '';
      $item('#evtCategory').text = itemData.category    || 'Church';
      $item('#evtDate').text     = formatDate(itemData.eventDate);

      if (itemData.description) {
        $item('#evtDescription').text = itemData.description;
      }

      // Show event image if available, otherwise hide the image slot
      if (itemData.image) {
        $item('#evtImage').src = itemData.image;
        $item('#evtImage').show();
      } else {
        $item('#evtImage').hide();
      }
    });

  } catch (err) {
    console.error('Events load error:', err);
    $w('#eventsRepeater').hide();
    $w('#noEventsMsg').show();
  }
}

// ─────────────────────────────────────────────
// FEATURED SERMON
// ─────────────────────────────────────────────
async function loadFeaturedSermon() {
  try {
    const results = await wixData.query('Sermons')
      .eq('isFeatured', true)
      .limit(1)
      .find();

    if (results.items.length === 0) {
      $w('#sermonSection').hide();
      return;
    }

    const sermon = results.items[0];

    $w('#sermonTitle').text    = sermon.title    || 'Featured Sermon';
    $w('#sermonSpeaker').text  = sermon.speaker  || '';
    $w('#sermonScripture').text = sermon.scripture || '';
    $w('#sermonSeries').text   = sermon.series   ? `Series: ${sermon.series}` : '';
    $w('#sermonDateText').text = sermon.sermonDate ? formatDate(sermon.sermonDate) : '';

    // Load YouTube thumbnail if a video ID is set
    if (sermon.youtubeId) {
      $w('#sermonThumbnail').src = buildYouTubeThumb(sermon.youtubeId);
      $w('#sermonThumbnail').show();

      $w('#watchSermonBtn').onClick(() => {
        wixWindow.openLightbox('YouTubeLightbox', {
          videoUrl: buildYouTubeUrl(sermon.youtubeId)
        });
        // Alternatively, open in new tab:
        // wixWindow.openUrl(buildYouTubeUrl(sermon.youtubeId));
      });
    } else {
      $w('#sermonThumbnail').hide();
      $w('#watchSermonBtn').label = 'View on YouTube';
      $w('#watchSermonBtn').onClick(() => {
        wixWindow.openUrl('http://www.youtube.com/@NJBCWF');
      });
    }

  } catch (err) {
    console.error('Sermon load error:', err);
    $w('#sermonSection').hide();
  }
}

// ─────────────────────────────────────────────
// PRAYER REQUEST FORM
// ─────────────────────────────────────────────
function setupPrayerForm() {
  // Hide feedback messages initially
  $w('#prayerSuccess').hide();
  $w('#prayerError').hide();

  $w('#submitPrayerBtn').onClick(async () => {
    // Basic validation
    const name    = $w('#prayerName').value.trim();
    const email   = $w('#prayerEmail').value.trim();
    const request = $w('#prayerRequest').value.trim();
    const anon    = $w('#prayerAnonymous').checked;

    if (!request) {
      $w('#prayerError').text = 'Please enter your prayer request before submitting.';
      $w('#prayerError').show();
      return;
    }

    // Disable button while submitting
    $w('#submitPrayerBtn').disable();
    $w('#submitPrayerBtn').label = 'Sending...';
    $w('#prayerSuccess').hide();
    $w('#prayerError').hide();

    try {
      await submitPrayerRequest({ name, email, request, isAnonymous: anon });

      // Success state
      $w('#prayerSuccess').show();
      $w('#prayerName').value    = '';
      $w('#prayerEmail').value   = '';
      $w('#prayerRequest').value = '';
      $w('#prayerAnonymous').checked = false;

    } catch (err) {
      console.error('Prayer form error:', err);
      $w('#prayerError').text = 'Something went wrong. Please try again or call (940) 767-2067.';
      $w('#prayerError').show();
    } finally {
      $w('#submitPrayerBtn').enable();
      $w('#submitPrayerBtn').label = 'Submit Request';
    }
  });
}
