/* =====================================================================
   Rural Pulse — Field & Ops
   app.js — no dependencies, no network calls, fully offline capable.
   ===================================================================== */
(function () {
  'use strict';

  /* ==================================================================
     1. ICONS  (inline SVG so the UI renders with zero network)
     ================================================================== */
  const ICONS = {
    'home':      'M3 10.6 12 3.5l9 7.1M5.5 9.4V20h4.7v-6h3.6v6h4.7V9.4',
    'camera':    'M4 8.5h3.2L8.8 6h6.4l1.6 2.5H20v11H4zM12 16.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z',
    'history':   'M12 7.4V12l3.2 2M3.6 12a8.4 8.4 0 1 0 2.6-6.1M3.6 4.6V9.2h4.6',
    'wallet':    'M3.6 8.6A2.6 2.6 0 0 1 6.2 6H20v12H6.2a2.6 2.6 0 0 1-2.6-2.6zM15 11.2h5v3.6h-5a1.8 1.8 0 0 1 0-3.6z',
    'settings':  'M4 7.4h7M15 7.4h5M4 16.6h5M13 16.6h7M13 4.6v5.6M9 13.8v5.6',
    'check':     'M4.8 12.4 9.6 17.2 19.2 6.8',
    'check-circle': 'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zM8.2 12.3l2.6 2.6 5.2-5.6',
    'close':     'M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8',
    'arrow-right':'M4 12h15M13.5 6.5 20 12l-6.5 5.5',
    'arrow-left':'M20 12H5M10.5 6.5 4 12l6.5 5.5',
    'chevron-down':'M6 9.5l6 6 6-6',
    'info':      'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zM12 11.2v5.4M12 7.6h.01',
    'alert':     'M12 4.2 21 20H3zM12 10v4.2M12 17.2h.01',
    'pin':       'M12 21.2s7-6 7-11.2a7 7 0 1 0-14 0c0 5.2 7 11.2 7 11.2zM12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z',
    'flag':      'M6 3.5V20.5M6 4.8h12l-2.4 4 2.4 4H6',
    'zoom-in':   'M11 4.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6zM16 16l4.4 4.4M8.4 11h5.2M11 8.4v5.2',
    'zoom-out':  'M11 4.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6zM16 16l4.4 4.4M8.4 11h5.2',
    'image':     'M4 5h16v14H4zM4 16.4 9 11.2l3.6 3.6L16 11l4 4M15.6 9.2h.01',
    'shield':    'M12 3.4 19 6v5.8c0 4.6-3 7.7-7 8.8-4-1.1-7-4.2-7-8.8V6zM9 12.2l2.2 2.2 4.4-4.4',
    'sun':       'M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zM12 2.4v2M12 19.6v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.4 12h2M19.6 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    'moon':      'M20 14.6A8.4 8.4 0 0 1 9.4 4 8.4 8.4 0 1 0 20 14.6z',
    'wifi':      'M3.4 9a13 13 0 0 1 17.2 0M6.6 12.6a8.4 8.4 0 0 1 10.8 0M9.8 16.2a4 4 0 0 1 4.4 0M12 19.6h.01',
    'wifi-off':  'M3 3l18 18M6.6 12.6a8.4 8.4 0 0 1 3.4-1.9M13.6 10.4a8.4 8.4 0 0 1 3.8 2.2M9.8 16.2a4 4 0 0 1 2.6-1M12 19.6h.01',
    'user':      'M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2zM4.6 20.6a7.4 7.4 0 0 1 14.8 0',
    'briefcase': 'M4 8.4h16v11.2H4zM9 8.4V5.6h6v2.8M4 13h16',
    'refresh':   'M20 11.4a8 8 0 0 0-13.8-4.6L4 9.2M4 12.6a8 8 0 0 0 13.8 4.6L20 14.8M4 4.4v4.8h4.8M20 19.6v-4.8h-4.8',
    'cloud':     'M7.4 18.6h9.8a3.9 3.9 0 0 0 .6-7.8 5.6 5.6 0 0 0-10.7-1.2A4.5 4.5 0 0 0 7.4 18.6z',
    'payments':  'M3.4 7.6h17.2v10.8H3.4zM3.4 10.8h17.2M7 15h4',
    'trash':     'M5.4 7h13.2M9.4 7V4.6h5.2V7M7.2 7l1 13h7.6l1-13',
    'mic':       'M12 3.6a2.8 2.8 0 0 1 2.8 2.8v5.2a2.8 2.8 0 1 1-5.6 0V6.4A2.8 2.8 0 0 1 12 3.6zM6 11.4a6 6 0 0 0 12 0M12 17.4v3.2',
    'lightbulb': 'M9 18h6M10 21h4M12 3.6a5.6 5.6 0 0 1 3.4 10.1c-.7.5-1 1.2-1 2v.3h-4.8v-.3c0-.8-.3-1.5-1-2A5.6 5.6 0 0 1 12 3.6z',
    'send':      'M21 3.6 10.6 14M21 3.6l-6.6 17.2-3.8-6.8-6.8-3.8z',
    'account':   'M4 20h16M12 12.6a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM6.6 20a5.6 5.6 0 0 1 10.8 0',
    'key':       'M15.6 3.6a5.4 5.4 0 1 0-5 7.3L4 17.5v3h3v-2h2v-2h2l1.3-1.3a5.4 5.4 0 0 0 3.3-11.6zM17.2 7.8h.01',
    'translate': 'M3.6 5.4h9v13.2h-9zM17.4 10.4h3v8.2h-4M8.1 9.6a5.6 5.6 0 0 0 4.5-4.2M8.1 9.6a5.6 5.6 0 0 0 4.5 4.2',
    'help':      'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zM9.6 9.4a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 1.9-2.5 3.8M12 17h.01',
    'phone':     'M6.4 3.6h2.8l1.5 3.8-2 1.4a11 11 0 0 0 5.5 5.5l1.4-2 3.8 1.5v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2z',
    'chat':      'M4 5h16v11.2H9.4L4 20.2z',
    'satellite': 'M12 20.4a8.4 8.4 0 1 0 0-16.8 8.4 8.4 0 0 0 0 16.8zM12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM12 13.2h.01',
    'copy':      'M9 9.4h10.6V20H9zM14.6 9.4V4.4H4.4V15h4.6',
    'volume-up': 'M4 9.5h3.5L12 5.5v13L7.5 14.5H4zM15.5 9.2a4 4 0 0 1 0 5.6M18.2 6.6a8 8 0 0 1 0 10.8',
    'clock':     'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zM12 7v5.4l3.4 2',
    'plus':      'M12 5.4v13.2M5.4 12h13.2',
    'minus':     'M5.4 12h13.2',
    'eye':       'M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'grid':      'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    'list':      'M8 6.4h12M8 12h12M8 17.6h12M4 6.4h.01M4 12h.01M4 17.6h.01',
    'download':  'M12 4v11M7.4 10.6 12 15.2l4.6-4.6M4.6 20h14.8',
    'upload':    'M12 15.2V4M7.4 8.6 12 4l4.6 4.6M4.6 20h14.8',
    'building':  'M5 20.6V4.4h8.6v16.2M13.6 10h5.4v10.6M8 8h2.6M8 11.6h2.6M8 15.2h2.6',
    'drop':      'M12 3.6s6 6.4 6 10.2a6 6 0 0 1-12 0c0-3.8 6-10.2 6-10.2z',
    'school':    'M12 4.2 2.8 9 12 13.8 21.2 9zM6.2 11.2v5.4c0 1.6 3 3 5.8 3s5.8-1.4 5.8-3v-5.4',
    'hospital':  'M4.6 20.6V6.4h14.8v14.2M12 8.6v5.6M9.2 11.4h5.6M9.6 20.6v-4.2h4.8v4.2',
    'road':      'M7.6 3.6 4.6 20.4M16.4 3.6l3 16.8M12 4.6v3M12 10.4v3M12 16.2v3',
    'shop':      'M4 9.4h16v10.2H4zM3 9.4 4.8 4.6h14.4L21 9.4M9.4 13.4h5.2',
    'farm':      'M3.6 18.4h16.8M6.4 18.4a2.6 2.6 0 1 0 0 .01M17 18.4a2.6 2.6 0 1 0 0 .01M8 18.4V9.4h5l3.4 9',
    'bolt':      'M13.4 3.4 5.6 13.8h5.4l-1 6.8 8-10.4h-5.4z',
    'worship':   'M12 3.4 5.6 20.4h12.8zM12 8.4v6M12 17h.01',
    'recycle':   'M7.6 8.4 10.6 3.4l3 5M4 12.6l-1 5h5M10.6 20.6h7l3.4-5M19.6 15.6l1-5h-5',
    'power':     'M4.6 20.6V8.4L12 4.4l7.4 4v12.2zM8.4 12h7.2M8.4 16h5',
    'stop':      'M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8zM6.4 6.4l11.2 11.2',
    'map':       'M9 4.4 3.6 6.6v13L9 17.4l6 2.2 5.4-2.2v-13L15 6.6zM9 4.4v13M15 6.6v13',
    'tag':       'M3.8 11.4V4.4h7l9.4 9.4-7 7zM7.6 8h.01',
    'clipboard': 'M9 4.6H6.4v15.4h11.2V4.6H15M9 3h6v3.4H9z',
    'award':     'M12 14.6a5.2 5.2 0 1 0 0-10.4 5.2 5.2 0 0 0 0 10.4zM8.6 13.6 7.4 21l4.6-2.4L16.6 21l-1.2-7.4',
    'pulse':     'M2.5 12.5h4l2-5 3.5 10 2.5-6.5 1.6 3h5.4',
    'bell':      'M18 9.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5zM10.2 19.5a2 2 0 0 0 3.6 0',
    'trending':  'M3.5 16.5 9 11l4 4 7.5-7.5 M15.5 7.5h5v5',
    'signal':    'M4 18v-3 M9 18v-6 M14 18v-9 M19 18V5',
    'battery':   'M3.5 8h14v8h-14z M20 11v2'
  };

  function svgIcon(name) {
    const d = ICONS[name] || ICONS.info;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="' + d + '"/></svg>';
  }

  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(el => {
      if (el.dataset.iconDone === '1') return;
      el.innerHTML = svgIcon(el.dataset.icon);
      el.dataset.iconDone = '1';
    });
  }

  /* ==================================================================
     2. CONSTANTS
     ================================================================== */
  const LANGS = [
    { code: 'en-IN', name: 'English',  native: 'English',  speech: true },
    { code: 'hi-IN', name: 'Hindi',    native: 'हिन्दी',   speech: true },
    { code: 'mr-IN', name: 'Marathi',  native: 'मराठी',   speech: true },
    { code: 'ta-IN', name: 'Tamil',    native: 'தமிழ்',    speech: true },
    { code: 'te-IN', name: 'Telugu',   native: 'తెలుగు',   speech: true },
    { code: 'kn-IN', name: 'Kannada',  native: 'ಕನ್ನಡ',    speech: false },
    { code: 'ur-IN', name: 'Urdu',     native: 'اردو',      speech: false }
  ];

  const CATEGORIES = [
    { id: 'water',      label: 'Water source',      desc: 'Well, handpump, tank, canal', icon: 'drop' },
    { id: 'sanitation', label: 'Toilet / sanitation', desc: 'Toilet block, soak pit',     icon: 'building' },
    { id: 'school',     label: 'School / education', desc: 'School, Anganwadi, library', icon: 'school' },
    { id: 'health',     label: 'Health facility',    desc: 'PHC, sub-centre, clinic',    icon: 'hospital' },
    { id: 'road',       label: 'Road & transport',   desc: 'Road, bridge, bus stop',     icon: 'road' },
    { id: 'shelter',    label: 'Shelter / housing',  desc: 'Home, community hall',       icon: 'building' },
    { id: 'worship',    label: 'Place of worship',   desc: 'Mandir, masjid, church',     icon: 'worship' },
    { id: 'market',     label: 'Market / shop',      desc: 'Kirana, haat bazaar',        icon: 'shop' },
    { id: 'farm',       label: 'Farm & irrigation',  desc: 'Farm, pump, agri shed',      icon: 'farm' },
    { id: 'power',      label: 'Power & telecom',    desc: 'Pole, transformer, tower',   icon: 'power' },
    { id: 'waste',      label: 'Waste management',   desc: 'Dustbin, collection point',  icon: 'recycle' },
    { id: 'other',      label: 'Something else',     desc: 'Not in the list',            icon: 'tag' }
  ];

  /* Real cascading administrative data (state → district → taluka → village) */
  const GEO = {
    'Maharashtra': {
      'Pune': {
        'Haveli':  [['Uruli Kanchan', '412202'], ['Mulshi', '412208'], ['Bavdhan', '411225'], ['Kharasagar', '411411'], ['Velneshwar', '412202']],
        'Daund':   [['Rahu', '412207'], ['Patangaon', '412207'], ['Shingora', '412207']],
        'Baramati':[['Baramati', '413130'], ['Bhigand', '413130'], ['Satenagar', '413130']],
        'Shirur':  [['Shirur', '412502'], ['Pimpalgaon', '412502'], ['Nagardhan', '412502']],
        'Saswad':  [['Saswad', '412301'], ['Bhor', '412301']]
      },
      'Satara': {
        'Wai':     [['Wai', '412803'], ['Kothrud', '412803']],
        'Satara':  [['Satara', '415001'], ['Pali', '415412']],
        'Koregaon':[['Koregaon', '415010']]
      },
      'Solapur': {
        'Solapur': [['Solapur', '413001'], ['Barshi', '413118'], ['Pandharpur', '413304'], ['Karmala', '413202']]
      },
      'Ahmednagar': {
        'Ahmednagar': [['Ahmednagar', '414001'], ['Sangamner', '422505'], ['Rahata', '423607']]
      }
    },
    'Madhya Pradesh': {
      'Indore': {
        'Indore East': [['Bhanwar', '452001'], ['Kship', '452010']],
        'Indore West': [['Rau', '452020'], ['Pithampur', '454775']]
      },
      'Khandwa': { 'Khandwa': [['Khandwa', '476001'], ['Punasa', '476111']] },
      'Ujjain':  { 'Ujjain':  [['Ujjain', '456001'], ['Badnagar', '456770']] }
    },
    'Gujarat': {
      'Anand':   { 'Anand':   [['Anand', '388001'], ['Vadtal', '388315']] },
      'Vadodara':{ 'Vadodara':[['Vadodara', '390001']] },
      'Rajkot':  { 'Rajkot':  [['Rajkot', '360001']] }
    },
    'Rajasthan': {
      'Jaipur':  { 'Jaipur Rural': [['Bassi', '303301'], ['Dholakua', '303901']] },
      'Jodhpur': { 'Jodhpur Rural': [['Lalsot', '342004'], ['Shergarh', '342024']] }
    }
  };

  const PHOTO_RULES = [
    { id: 'light', title: 'Good natural light', tag: 'Daylight', icon: 'sun',
      desc: 'Shoot between 9am and 4pm. Avoid dark shade and strong backlight.',
      do: 'bright', dont: 'dark' },
    { id: 'steady', title: 'Steady and clear', tag: 'Sharp', icon: 'camera',
      desc: 'Hold the phone still for one second after tapping the shutter.',
      do: 'sharp', dont: 'blur' },
    { id: 'whole', title: 'Show the whole asset', tag: 'Complete', icon: 'eye',
      desc: 'Step back so the full building or structure fits in the frame.',
      do: 'wide', dont: 'close' },
    { id: 'nobadge', title: 'No faces, no plates', tag: 'Safe', icon: 'shield',
      desc: 'Avoid faces, number plates and nameboards with personal details.',
      do: 'empty', dont: 'people' }
  ];

  const FAQS = [
    { id: 'q1', q: 'How do I get my ₹10?', k: 'payment upi money reward payout credited',
      a: 'A reviewer checks the photo. If it passes the checks on the capture screen, ₹10 is sent to your UPI ID automatically. Most reviews finish within 2 working days.' },
    { id: 'q2', q: 'Why was my photo rejected?', k: 'reject reason blur lighting duplicate resubmit fix',
      a: 'Open the photo in History — the reason is shown at the top. You can then tap "Fix and resubmit", correct the problem and send a new photo. The rejected photo is never paid for.' },
    { id: 'q3', q: 'What makes a photo good enough?', k: 'quality rules light sharp complete daylight',
      a: 'Daylight, sharp, the whole asset visible, and no faces or readable nameplates. The capture screen checks these four points on your actual photo before you send it.' },
    { id: 'q4', q: 'The app says offline. Will my photo be lost?', k: 'offline queue internet network saved sync',
      a: 'No. Photos taken offline are stored on the phone and sent automatically as soon as you have signal. You will see them in History as "Waiting to send" until then.' },
    { id: 'q5', q: 'Can I photograph a private house?', k: 'privacy private home consent publish dataset gps',
      a: 'Public buildings are fine. For a private home, get the owner permission and turn on the "private property" flag so the reviewer can decide. Photos and GPS coordinates may be published in an open dataset.' },
    { id: 'q6', q: 'How do I change my UPI ID?', k: 'upi change bank account money payout',
      a: 'Open Earnings, tap "Change UPI ID" and confirm with your 4-digit PIN. The new ID is marked "Re-verification needed" until the first payout lands in it.' }
  ];

  const REJECT_REASONS = [
    'Blurry or out of focus',
    'Too dark / poor lighting',
    'Asset is cut off or not fully visible',
    'Wrong category selected',
    'Duplicate of another photo in this ward',
    'Face or personal data visible without consent',
    'Not a public or mappable asset'
  ];

  const STATUS_META = {
    draft:    { label: 'Draft',              badge: 'muted',  note: 'Not sent yet' },
    queued:   { label: 'Waiting to send',    badge: 'info',   note: 'Saved on this phone, will send automatically' },
    pending:  { label: 'In review',          badge: 'warn',   note: 'A reviewer is checking this photo' },
    flagged:  { label: 'With supervisor',    badge: 'warn',   note: 'A supervisor is checking this photo' },
    approved: { label: 'Approved',           badge: 'brand',  note: 'Paid to your UPI' },
    rejected: { label: 'Rejected',           badge: 'danger', note: 'See the reason and resubmit' }
  };

  const PAY_PER_PHOTO = 10;

  /* ==================================================================
     3. UTILITIES
     ================================================================== */
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = s => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const inr = n => '₹' + Number(n || 0).toLocaleString('en-IN');
  const uid = (p) => (p || 'JT') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  function fmtDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
    if (sameDay) return 'Today, ' + time;
    const yesterday = new Date(now.getTime() - 86400000);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday, ' + time;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + time;
  }
  function fmtAgo(ts) {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hr' + (hrs > 1 ? 's' : '') + ' ago';
    const days = Math.floor(hrs / 24);
    return days + ' day' + (days > 1 ? 's' : '') + ' ago';
  }
  function isToday(ts) { return new Date(ts).toDateString() === new Date().toDateString(); }

  function catById(id) { return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]; }

  function langByCode(code) { return LANGS.find(l => l.code === code) || LANGS[0]; }

  function toast(msg, type) {
    const t = $('#toast');
    $('#toastMsg').textContent = msg;
    const iconName = type === 'error' ? 'alert' : type === 'warn' ? 'alert'
      : type === 'info' ? 'info' : 'check-circle';
    t.className = 'toast is-on toast--' + (type || 'success');
    t.innerHTML = svgIcon(iconName) + '<span id="toastMsg"></span>';
    $('#toastMsg').textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('is-on'), 4200);
  }

  /* Modal plumbing ------------------------------------------------------ */
  let lastFocus = null;
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('is-open');
    const focusable = m.querySelector('button, input, select, textarea, a[href]');
    if (focusable) focusable.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = $$('.modal.is-open');
      if (open.length) closeModal(open[open.length - 1].id);
    }
  });
  document.addEventListener('click', e => {
    const closer = e.target.closest('[data-close]');
    if (closer) { closeModal(closer.dataset.close); return; }
    const back = e.target.closest('[data-back]');
    if (back) { go(back.dataset.back); return; }
    const goto = e.target.closest('[data-goto]');
    if (goto) { go(goto.dataset.goto); }
  });

  /* ==================================================================
     4. STORE
     ================================================================== */
  const STORE_KEY = 'ruralpulse.v1';
  let DB = null;

  function blankStore() {
    return {
      version: 1,
      user: {
        name: '', phone: '', type: 'ngo', org: '',
        state: '', district: '', taluka: '', village: '', ward: '', pin: '',
        lang: 'en-IN', upi: '', upiVerified: false, upiNeedsCheck: false,
        agentId: '', onboarded: false
      },
      settings: { theme: 'light', simulateOffline: false },
      target: 250,
      submissions: [],
      log: [],
      lastSync: null
    };
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(DB));
    } catch (e) {
      toast('Storage is full. Photos stay on this device for this session only.', 'warn');
    }
    updateStorageInfo();
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.user) return null;
      return parsed;
    } catch (e) { return null; }
  }

  /* --- Placeholder photo generator (offline, deterministic) ------------ */
  function sceneAlt(kind) {
    const map = {
      water: 'Community water well with handpump',
      sanitation: 'Toilet block with water tank',
      school: 'Zilla Parishad primary school building',
      health: 'Village health sub-centre building',
      road: 'Paved village road with bus stop',
      shelter: 'Gram panchayat community building',
      worship: 'Village temple with courtyard',
      market: 'Weekly haat bazaar street stalls',
      farm: 'Canal sluice gate and irrigation channel',
      power: 'Electricity distribution pole with transformer',
      waste: 'Village waste collection point'
    };
    return map[kind] || 'Village public asset';
  }

  /* --- Photo renderer (photos.js draws real-looking scenes offline) ----- */
  function photoFor(kind, seed, opts) {
    opts = opts || {};
    const o = Object.assign({ w: 520, h: 390, q: 0.8 }, opts);
    try {
      if (window.VillagePhoto && VillagePhoto.render) return VillagePhoto.render(kind, seed, o);
    } catch (e) { /* fall through */ }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + o.w + '" height="' + o.h + '">' +
      '<rect width="100%" height="100%" fill="#cfd8e3"/></svg>');
  }

  /* --- Seed data ------------------------------------------------------- */
  const SEED_TITLES = [
    ['water', 'Community handpump', 'Water source'],
    ['water', 'Village tank with tap', 'Water source'],
    ['school', 'Zilla Parishad primary school', 'School / education'],
    ['school', 'Anganwadi centre', 'School / education'],
    ['health', 'Aarogya Kendra sub-centre', 'Health facility'],
    ['health', 'Primary health centre building', 'Health facility'],
    ['road', 'Paved village road', 'Road & transport'],
    ['road', 'Bus stop shelter', 'Road & transport'],
    ['shelter', 'Gram Panchayat Bhavan', 'Shelter / housing'],
    ['shelter', 'Community hall', 'Shelter / housing'],
    ['worship', 'Village temple', 'Place of worship'],
    ['worship', 'Masjid with courtyard', 'Place of worship'],
    ['market', 'Weekly haat bazaar stalls', 'Market / shop'],
    ['market', 'Kirana shop front', 'Market / shop'],
    ['farm', 'Canal sluice gate', 'Farm & irrigation'],
    ['farm', 'Drip irrigation pump house', 'Farm & irrigation'],
    ['power', 'Electricity distribution pole', 'Power & telecom'],
    ['power', 'Mobile tower base', 'Power & telecom'],
    ['sanitation', 'Toilet block with tank', 'Toilet / sanitation'],
    ['waste', 'Village dustbin point', 'Waste management']
  ];

  function seedStore() {
    const db = blankStore();
    db.user = {
      name: 'Ramesh Patil', phone: '9876543210', type: 'ngo',
      org: 'Pratham Rural Education',
      state: 'Maharashtra', district: 'Pune', taluka: 'Haveli',
      village: 'Uruli Kanchan', ward: '4', pin: '412202',
      lang: 'en-IN', upi: 'ramesh.patil@oksbi', upiVerified: true, upiNeedsCheck: false,
      agentId: 'PRTH-MH-402', onboarded: true
    };
    const plan = [
      'approved', 'approved', 'approved', 'approved', 'approved', 'approved',
      'approved', 'approved', 'approved', 'approved', 'approved', 'approved',
      'approved', 'approved', 'approved', 'approved', 'approved', 'approved',
      'pending', 'pending', 'pending', 'pending',
      'flagged', 'rejected'
    ];
    const now = Date.now();
    plan.forEach((status, i) => {
      const [kind, title, catLabel] = SEED_TITLES[i % SEED_TITLES.length];
      const cat = CATEGORIES.find(c => c.label === catLabel);
      const day = Math.floor(i / 3);
      const ts = now - (day * 86400000) - (i % 3) * 3600000;
      const gps = {
        lat: 18.4872 + (i % 5) * 0.0031,
        lng: 74.1331 + (i % 7) * 0.0026,
        acc: 3 + (i % 4),
        source: i % 6 === 0 ? 'none' : 'exif'
      };
      db.submissions.push({
        id: 'JT-' + (78490 - i * 3),
        createdAt: ts,
        submittedAt: status === 'draft' ? null : ts + 60000,
        reviewedAt: (status === 'approved' || status === 'rejected' || status === 'flagged') ? ts + 7200000 : null,
        status,
        title: title,
        assetName: title,
        year: (i % 4 === 0) ? '2011' : '',
        condition: i % 3 === 0 ? 'Working' : '',
        categories: [cat.id],
        primaryCategory: cat.id,
        description: title + ' in ' + db.user.village + '. Public asset used daily by village residents.',
        photo: {
          src: photoFor(kind, 'seed' + i, { w: 520, h: 390, q: 0.78, dark: i % 7 === 0, blur: i % 9 === 0 }),
          w: 520, h: 390,
          bytesIn: 2_400_000 + i * 51_000,
          bytesOut: 240_000 + i * 900,
          hash: 'seed' + i
        },
        gps: gps,
        location: {
          village: db.user.village, ward: db.user.ward, state: db.user.state,
          district: db.user.district, taluka: db.user.taluka, pin: db.user.pin,
          verified: gps.source !== 'none'
        },
        audit: {
          brightness: 40 + (i % 5) * 28,
          contrast: 18 + (i % 4) * 16,
          sharpness: 30 + (i % 6) * 40,
          duplicateOf: null
        },
        privacy: { people: i % 11 === 0, private: i % 13 === 0, sign: i % 7 === 0 },
        rejectReason: status === 'rejected' ? REJECT_REASONS[1] : '',
        rejectNote: status === 'rejected' ? 'Photo was taken in the evening, please reshoot in daylight.' : '',
        replacesId: null
      });
    });
    db.log.push({
      at: now - 86400000, by: 'Review desk', action: 'approved',
      id: db.submissions[0].id, note: 'Auto-approved sample record'
    });
    return db;
  }

  function initStore() {
    DB = load();
    if (!DB) { DB = seedStore(); save(); }
    if (!DB.log) DB.log = [];
    if (!DB.settings) DB.settings = { theme: 'light', simulateOffline: false };
  }

  /* ==================================================================
     5. DERIVED STATE (single source of truth for every number)
     ================================================================== */
  function stats() {
    const s = DB.submissions;
    const by = st => s.filter(x => x.status === st);
    const approved = by('approved');
    const inReview = by('pending').concat(by('flagged'));
    const waiting = by('queued').concat(by('draft'));
    return {
      total: s.length,
      approved: approved.length,
      pending: by('pending').length,
      flagged: by('flagged').length,
      rejected: by('rejected').length,
      waiting: waiting.length,
      inReview: inReview.length,
      credited: approved.length * PAY_PER_PHOTO,
      inReviewAmount: inReview.length * PAY_PER_PHOTO,
      waitingAmount: waiting.length * PAY_PER_PHOTO,
      today: s.filter(x => isToday(x.createdAt)).length
    };
  }

  const isOnline = () => navigator.onLine && !DB.settings.simulateOffline;

  function pendingQueue() {
    return DB.submissions.filter(x => x.status === 'queued' || x.status === 'draft');
  }

  /* ==================================================================
     6. NAVIGATION
     ================================================================== */
  const ONBOARD_SCREENS = ['scr-onboard-language', 'scr-onboard-verify', 'scr-onboard-profile',
    'scr-onboard-place', 'scr-onboard-consent'];

  function go(screenId, opts) {
    const target = document.getElementById(screenId);
    if (!target) return;
    $$('.screen').forEach(s => s.classList.remove('is-active'));
    target.classList.add('is-active');
    current = screenId;
    try { history.replaceState(null, '', '#' + screenId); } catch (e) { }

    const isOnboard = ONBOARD_SCREENS.indexOf(screenId) !== -1;
    const isReviewer = screenId === 'scr-reviewer';
    $('.bottomnav').style.display = (isOnboard || isReviewer) ? 'none' : '';

    $$('.navbtn[data-goto]').forEach(b => {
      if (b.dataset.goto === screenId) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    const view = $('#view');
    view.scrollTo({ top: 0, behavior: 'auto' });

    if (!isOnboard) renderAll(screenId);
    if (isReviewer) renderReviewer();
    if (screenId === 'scr-history') renderHistory();
    if (screenId === 'scr-earnings') renderEarnings();
    if (screenId === 'scr-settings') renderSettings();
    if (screenId === 'scr-home') renderHome();
    if (screenId === 'scr-capture') renderCaptureMeta();
    if (screenId === 'scr-location') renderLocation();
    if (screenId === 'scr-categories') renderCategories();
    if (screenId === 'scr-describe') renderDescribe();
    if (screenId === 'scr-review') renderReview();
    if (opts && opts.focus) { const el = $(opts.focus); if (el) el.focus(); }
  }

  let current = 'scr-home';

  function renderAll() { /* placeholder for future per-screen renderers */ }

  /* ==================================================================
     7. HOME
     ================================================================== */
  function renderHome() {
    const u = DB.user, s = stats();
    const place = [u.village, u.district].filter(Boolean).join(', ');
    $('#homeTitle').textContent = 'Namaste, ' + (u.name.split(' ')[0] || 'there');
    $('#homePlace').textContent = place + (u.ward ? ' · Ward ' + u.ward : '');

    /* dark hero — the money is the motivation, so it leads */
    $('#homeCredited').textContent = inr(s.credited);
    $('#homeInReview').textContent = inr(s.inReviewAmount);
    $('#homePaidNote').textContent = s.approved + ' photo' + (s.approved === 1 ? '' : 's') + ' paid';
    $('#homeWaitingNote').textContent = s.waiting + ' waiting to send';
    $('#homeTodayChip').textContent = '+' + inr(s.today * PAY_PER_PHOTO) + ' today';

    /* quick actions */
    const quick = $('#homeQuick');
    quick.innerHTML = [
      { icon: 'camera', label: 'Take photo', go: 'scr-capture' },
      { icon: 'history', label: 'History', go: 'scr-history' },
      { icon: 'wallet', label: 'Wallet', go: 'scr-earnings' },
      { icon: 'flag', label: 'Village goal', go: 'scr-home' },
      { icon: 'help', label: 'Help', go: 'scr-help' }
    ].map(q =>
      '<button class="qact" data-qgo="' + q.go + '" type="button">' +
      '<span class="qact__icon">' + svgIcon(q.icon) + '</span><span>' + esc(q.label) + '</span></button>').join('');
    $$('[data-qgo]', quick).forEach(b => b.addEventListener('click', () => {
      if (b.dataset.qgo === 'scr-home') { scrollToGoal(); return; }
      go(b.dataset.qgo);
    }));

    /* mapping health gauge — computed from the real records */
    const total = Math.max(1, s.total);
    const quality = Math.round((s.approved / total) * 100);
    const coverage = Math.round(Math.min(100, (goalApprovedCount() / DB.target) * 100));
    const gpsRate = Math.round((DB.submissions.filter(x => x.gps && x.gps.lat != null).length / total) * 100);
    const speed = Math.max(20, Math.round(100 - (s.pending + s.flagged) * 4));
    const score = Math.round((quality * 0.35 + coverage * 0.25 + gpsRate * 0.25 + speed * 0.15));
    $('#gaugeValue').textContent = score;
    const arc = $('#gaugeArc');
    arc.setAttribute('stroke-dasharray', '264');
    arc.setAttribute('stroke-dashoffset', String(264 - 264 * (score / 100)));
    arc.style.stroke = score >= 70 ? 'var(--brand)' : score >= 45 ? '#F79009' : 'var(--danger)';
    const badge = $('#homeHealthBadge');
    badge.textContent = score >= 70 ? 'Good' : score >= 45 ? 'Needs work' : 'At risk';
    badge.className = 'badge badge--' + (score >= 70 ? 'brand' : score >= 45 ? 'warn' : 'danger');
    $('#gaugeMetrics').innerHTML = [
      { name: 'Approval rate', v: quality, c: 'var(--brand)' },
      { name: 'Village coverage', v: coverage, c: 'var(--info)' },
      { name: 'Photos with GPS', v: gpsRate, c: 'var(--accent)' },
      { name: 'Review backlog', v: speed, c: s.pending > 4 ? 'var(--warn)' : 'var(--brand)' }
    ].map(m =>
      '<div class="metrics__row"><span class="metrics__dot" style="background:' + m.c + '"></span>' +
      '<span class="metrics__name">' + esc(m.name) + '</span>' +
      '<span class="metrics__val">' + m.v + '</span></div>').join('');

    /* attention card */
    const alert = $('#homeAlert');
    const attention = s.pending + s.flagged + s.rejected;
    if (attention > 0) {
      alert.innerHTML =
        '<div class="alertcard">' +
        '<div class="alertcard__head">' +
        '<span class="alertcard__icon">' + svgIcon('info') + '</span>' +
        '<div class="grow"><span class="alertcard__title">' + attention + ' submission' + (attention > 1 ? 's' : '') + ' waiting</span>' +
        '<p class="alertcard__text">' +
        (s.rejected ? s.rejected + ' rejected photo — fix it and resend to earn the ₹10. ' : '') +
        (s.pending + s.flagged) + ' still with a reviewer. Approval usually finishes within 2 working days.</p></div>' +
        '</div>' +
        '<button class="btn btn--warn btn--block" data-goto="scr-history" type="button">See what to fix <span data-icon="arrow-right"></span></button>' +
        '</div>';
    } else {
      alert.innerHTML = '';
    }

    /* recent */
    const recent = DB.submissions.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
    const list = $('#homeRecent');
    list.innerHTML = recent.length
      ? recent.map(itemRow).join('')
      : emptyState('image', 'No photos yet', 'Your submissions will appear here with their payment status.');
    hydrateIcons(list);
    bindItemRows(list);

    renderTicker(s);
  }

  function goalApprovedCount() {
    return DB.submissions.filter(x => x.status === 'approved' && x.location.village === DB.user.village).length;
  }

  function scrollToGoal() {
    const el = document.getElementById('scr-home');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function renderTicker(s) {
    const track = $('#tickerTrack');
    if (!track) return;
    const items = [
      { icon: isOnline() ? 'wifi' : 'wifi-off', html: isOnline() ? '<b>Online</b>' : '<b>Offline</b> — photos saved on this phone', cls: isOnline() ? 'ticker__up' : 'ticker__warn' },
      { icon: 'pin', html: '<b>' + esc(DB.user.village) + '</b> Ward ' + esc(DB.user.ward || '1') },
      { icon: 'check-circle', html: '<b>' + s.approved + '</b> approved photos', cls: 'ticker__up' },
      { icon: 'payments', html: '<b>' + esc(inr(s.credited)) + '</b> credited to UPI' },
      { icon: 'clock', html: '<b>' + s.pending + '</b> in review' },
      { icon: 'cloud', html: '<b>' + s.waiting + '</b> waiting to send', cls: s.waiting ? 'ticker__warn' : '' },
      { icon: 'flag', html: '<b>' + goalApprovedCount() + '/' + DB.target + '</b> village goal' }
    ];
    const html = items.map(i =>
      '<span class="ticker__item ' + (i.cls || '') + '">' + svgIcon(i.icon) + '<span>' + i.html + '</span></span>').join('');
    track.innerHTML = html + html;
  }

  function statTile(label, value, note, tone) {
    return '<div class="stat stat--' + tone + '">' +
      '<span class="stat__label">' + esc(label) + '</span>' +
      '<span class="stat__value num">' + esc(value) + '</span>' +
      '<span class="stat__note">' + esc(note) + '</span></div>';
  }

  function emptyState(icon, title, text) {
    return '<div class="empty">' + svgIcon(icon) +
      '<span class="empty__title">' + esc(title) + '</span>' +
      '<span class="empty__text">' + esc(text) + '</span></div>';
  }

  function itemRow(x) {
    const m = STATUS_META[x.status] || STATUS_META.pending;
    const cat = catById(x.primaryCategory);
    const pay = x.status === 'approved' ? '+' + inr(PAY_PER_PHOTO)
      : x.status === 'rejected' ? inr(0)
      : inr(PAY_PER_PHOTO);
    return '<button class="item" data-sub="' + esc(x.id) + '" type="button">' +
      '<img class="item__thumb" src="' + x.photo.src + '" alt=""/>' +
      '<span class="item__body">' +
      '<span class="item__sub">#' + esc(x.id) + ' · ' + esc(fmtDate(x.createdAt)) + '</span>' +
      '<span class="item__title">' + esc(x.assetName || cat.label) + '</span>' +
      '<span class="item__sub">' + esc(x.location.village) + ' · ' + esc(cat.label) + '</span>' +
      '</span>' +
      '<span class="item__right">' +
      '<span class="badge badge--' + m.badge + '">' + esc(m.label) + '</span>' +
      '<span class="meta num">' + pay + '</span>' +
      '</span></button>';
  }

  function bindItemRows(root) {
    $$('[data-sub]', root).forEach(b => b.addEventListener('click', () => openItem(b.dataset.sub)));
  }

  /* ==================================================================
     8. HISTORY + ITEM DETAIL
     ================================================================== */
  const HIST_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'In review' },
    { key: 'approved', label: 'Approved' },
    { key: 'queued', label: 'Waiting to send' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'flagged', label: 'With supervisor' }
  ];

  function renderHistory() {
    const s = stats();
    $('#histTotal').textContent = s.total + ' record' + (s.total === 1 ? '' : 's');
    const counts = { all: s.total, pending: s.pending, approved: s.approved, queued: s.waiting, rejected: s.rejected, flagged: s.flagged };
    const wrap = $('#histFilters');
    wrap.innerHTML = HIST_FILTERS.map(f =>
      '<button class="chip' + (histFilter === f.key ? ' is-on' : '') + '" data-hf="' + f.key + '" type="button" aria-pressed="' +
      (histFilter === f.key) + '">' + esc(f.label) + ' (' + counts[f.key] + ')</button>').join('');
    $$('[data-hf]', wrap).forEach(b => b.addEventListener('click', () => { histFilter = b.dataset.hf; renderHistory(); }));

    const rows = DB.submissions
      .filter(x => histFilter === 'all' ? true : (histFilter === 'queued' ? (x.status === 'queued' || x.status === 'draft') : x.status === histFilter))
      .sort((a, b) => b.createdAt - a.createdAt);

    const list = $('#histList');
    list.innerHTML = rows.length ? rows.map(itemRow).join('')
      : emptyState('search', 'Nothing here', 'No submission has this status yet.');
    hydrateIcons(list);
    bindItemRows(list);
  }
  let histFilter = 'all';

  function openItem(id) {
    const x = DB.submissions.find(y => y.id === id);
    if (!x) return;
    const m = STATUS_META[x.status] || STATUS_META.pending;
    const cat = catById(x.primaryCategory);
    $('#mdlItemTitle').textContent = '#' + x.id;
    const body = $('#mdlItemBody');
    body.innerHTML =
      '<img class="photo__img" src="' + x.photo.src + '" alt="Submission photo" style="border-radius:var(--radius)"/>' +
      '<div class="row row--between"><span class="badge badge--' + m.badge + '">' + esc(m.label) + '</span>' +
      '<span class="meta">' + esc(m.note) + '</span></div>' +
      (x.status === 'rejected'
        ? '<div class="notice notice--danger">' + svgIcon('alert') +
          '<span><span class="notice__title">Reason: ' + esc(x.rejectReason) + '</span>' +
          esc(x.rejectNote || '') + '</span></div>'
        : '') +
      (x.privacy.people || x.privacy.private || x.privacy.sign
        ? '<div class="notice notice--warn">' + svgIcon('shield') +
          '<span><span class="notice__title">You flagged this photo</span>' +
          [x.privacy.people ? 'people visible' : '', x.privacy.private ? 'private property' : '', x.privacy.sign ? 'readable signboard' : '']
            .filter(Boolean).join(', ') + '</span></div>' : '') +
      '<div class="divider"></div>' +
      kv('Asset', x.assetName || cat.label) +
      kv('Category', x.categories.map(c => catById(c).label).join(', ')) +
      kv('Village', x.location.village + ', Ward ' + x.location.ward) +
      kv('Coordinates', x.gps.lat != null ? x.gps.lat.toFixed(5) + ', ' + x.gps.lng.toFixed(5) + ' (±' + x.gps.acc + 'm)' : 'not recorded') +
      kv('GPS source', x.gps.source === 'exif' ? 'from the photo' : x.gps.source === 'device' ? 'from this phone' : 'none — unverified') +
      kv('Description', x.description || '—') +
      kv('Reward', x.status === 'approved' ? inr(PAY_PER_PHOTO) + ' paid' : inr(PAY_PER_PHOTO) + ' on approval');

    const foot = $('#mdlItemFoot');
    foot.innerHTML = '';
    if (x.status === 'rejected' || x.status === 'flagged') {
      const b = document.createElement('button');
      b.className = 'btn btn--block';
      b.innerHTML = svgIcon('camera') + '<span>Fix and resubmit</span>';
      b.addEventListener('click', () => { closeModal('mdl-item'); startSubmission(x); });
      foot.appendChild(b);
    } else {
      const b = document.createElement('button');
      b.className = 'btn btn--ghost btn--block';
      b.innerHTML = svgIcon('close') + '<span>Close</span>';
      b.addEventListener('click', () => closeModal('mdl-item'));
      foot.appendChild(b);
    }
    openModal('mdl-item');
  }

  function kv(k, v) {
    return '<div class="kv"><span class="kv__k">' + esc(k) + '</span><span class="kv__v">' + esc(v) + '</span></div>';
  }

  /* ==================================================================
     9. EARNINGS
     ================================================================== */
  const LEDGER_TABS = [
    { key: 'all', label: 'All' },
    { key: 'approved', label: 'Credited' },
    { key: 'pending', label: 'In review' },
    { key: 'waiting', label: 'Waiting' }
  ];
  let ledgerTab = 'all';

  function renderEarnings() {
    const s = stats();
    $('#earnCredited').textContent = inr(s.credited);
    $('#earnPending').textContent = inr(s.inReviewAmount);
    $('#earnApprovedNote').textContent = s.approved + ' photo' + (s.approved === 1 ? '' : 's') + ' paid';
    $('#earnWaitingNote').textContent = s.waiting + ' waiting to send';
    $('#upiValue').textContent = DB.user.upi || 'not set';
    $('#upiName').textContent = DB.user.name || '—';
    const b = $('#upiBadge');
    b.textContent = DB.user.upiNeedsCheck ? 'Re-verification needed' : (DB.user.upiVerified ? 'Verified' : 'Not verified');
    b.className = 'badge badge--' + (DB.user.upiNeedsCheck ? 'warn' : (DB.user.upiVerified ? 'brand' : 'danger'));

    const tabs = $('#ledgerTabs');
    tabs.className = 'seg';
    tabs.innerHTML = LEDGER_TABS.map(t =>
      '<button class="seg__btn' + (ledgerTab === t.key ? ' is-on' : '') + '" data-lt="' + t.key + '" type="button" aria-pressed="' +
      (ledgerTab === t.key) + '">' + esc(t.label) + '</button>').join('');
    $$('[data-lt]', tabs).forEach(el => el.addEventListener('click', () => { ledgerTab = el.dataset.lt; renderEarnings(); }));

    const rows = DB.submissions
      .filter(x => ledgerTab === 'all' ? true
        : ledgerTab === 'approved' ? x.status === 'approved'
        : ledgerTab === 'pending' ? (x.status === 'pending' || x.status === 'flagged')
        : (x.status === 'queued' || x.status === 'draft'))
      .sort((a, b2) => b2.createdAt - a.createdAt);

    const list = $('#ledgerList');
    list.innerHTML = rows.length ? rows.map(x => {
      const m = STATUS_META[x.status];
      const amt = x.status === 'approved' ? '+' + inr(PAY_PER_PHOTO) : x.status === 'rejected' ? inr(0) : inr(PAY_PER_PHOTO);
      return '<div class="ledgerrow">' +
        '<img class="ledgerrow__thumb" src="' + x.photo.src + '" alt=""/>' +
        '<span class="grow stack" style="gap:2px">' +
        '<span class="item__title">#' + esc(x.id) + ' · ' + esc(catById(x.primaryCategory).label) + '</span>' +
        '<span class="item__sub">' + esc(x.location.village) + ' · ' + esc(fmtDate(x.createdAt)) + '</span>' +
        '</span>' +
        '<span class="stack" style="align-items:flex-end;gap:4px">' +
        '<span class="ledgerrow__amt num" style="color:' +
        (x.status === 'approved' ? 'var(--brand)' : x.status === 'rejected' ? 'var(--text-3)' : 'var(--info)') + '">' + amt + '</span>' +
        '<span class="badge badge--' + m.badge + '">' + esc(m.label) + '</span>' +
        '</span></div>';
    }).join('') : emptyState('wallet', 'Nothing here yet', 'Approved photos and their payouts show up in this ledger.');
    hydrateIcons(list);
  }

  /* ==================================================================
     10. SETTINGS
     ================================================================== */
  function renderSettings() {
    const u = DB.user, s = stats();
    $('#setInitials').textContent = (u.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    $('#setName').textContent = u.name || 'Not set';
    $('#setPhone').textContent = u.phone ? '+91 ' + u.phone : 'Not verified';
    $('#setOrg').textContent = u.org || (u.type === 'volunteer' ? 'Independent volunteer' : '—');
    $('#setPlace').textContent = [u.village, u.district, u.state].filter(Boolean).join(', ');
    $('#setAgentId').textContent = u.agentId || '—';
    $('#setLastSync').textContent = DB.lastSync ? fmtDate(DB.lastSync) : 'never';
    $('#setQueue').textContent = s.waiting;
    $('#setRecords').textContent = s.total;
    $('#themeSwitch').checked = DB.settings.theme === 'dark';
    $('#offlineSwitch').checked = !!DB.settings.simulateOffline;
    updateStorageInfo();
  }

  function updateStorageInfo() {
    const rec = $('#setRecords');
    if (rec) rec.textContent = DB.submissions.length + ' records';
  }

  /* ==================================================================
     11. ONBOARDING
     ================================================================== */
  function renderLanguages() {
    const wrap = $('#langOptions');
    wrap.innerHTML = LANGS.map(l =>
      '<label class="opt"><input type="radio" name="lang" value="' + l.code + '"' +
      (l.code === DB.user.lang ? ' checked' : '') + '/>' +
      '<span class="opt__dot" aria-hidden="true"></span>' +
      '<span class="opt__body"><span class="opt__title">' + esc(l.native) + '</span>' +
      '<span class="opt__desc">' + esc(l.name) +
      (l.speech ? ' · voice input available' : ' · voice input not available on this device') + '</span></span></label>').join('');
    $$('input[name=lang]', wrap).forEach(r => r.addEventListener('change', () => {
      DB.user.lang = r.value;
      const l = langByCode(r.value);
      $('#langNextLabel').textContent = l.name;
      save();
    }));
    $('#langNextLabel').textContent = langByCode(DB.user.lang).name;
  }

  function speak(text, langCode) {
    if (!('speechSynthesis' in window)) { toast('This device cannot read text aloud.', 'warn'); return; }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = langCode;
      u.rate = 0.92;
      const v = window.speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().startsWith(langCode.slice(0, 2)));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { toast('Could not play the audio instruction.', 'warn'); }
  }

  function renderGeoSelects(prefix, defaults) {
    /* Clone the <select> nodes so previous listeners are discarded with the
       old elements (this function is called every time the screen opens). */
    const fresh = (oldEl, name) => {
      if (!oldEl) throw new Error('Missing geo select element: ' + name);
      const n = oldEl.cloneNode(false);
      oldEl.replaceWith(n);
      return n;
    };
    const st = fresh($('#' + prefix + 'StateSel'), prefix + 'StateSel');
    const di = fresh($('#' + prefix + 'DistrictSel'), prefix + 'DistrictSel');
    const ta = fresh($('#' + prefix + 'TalukaSel'), prefix + 'TalukaSel');
    const vi = fresh($('#' + prefix + 'VillageSel'), prefix + 'VillageSel');

    st.innerHTML = Object.keys(GEO).map(k => '<option>' + esc(k) + '</option>').join('');
    if (defaults && defaults.state && GEO[defaults.state]) st.value = defaults.state;

    const fillDistricts = () => {
      const s = st.value;
      di.innerHTML = Object.keys(GEO[s] || {}).map(k => '<option>' + esc(k) + '</option>').join('');
      if (defaults && defaults.district && (GEO[s] || {})[defaults.district]) di.value = defaults.district;
      fillTalukas();
    };
    const fillTalukas = () => {
      const s = st.value, d = di.value;
      ta.innerHTML = Object.keys((GEO[s] || {})[d] || {}).map(k => '<option>' + esc(k) + '</option>').join('');
      if (defaults && defaults.taluka && ((GEO[s] || {})[d] || {})[defaults.taluka]) ta.value = defaults.taluka;
      fillVillages();
    };
    const fillVillages = () => {
      const s = st.value, d = di.value, t = ta.value;
      const list = ((GEO[s] || {})[d] || {})[t] || [];
      vi.innerHTML = list.map(v => '<option value="' + esc(v[0]) + '" data-pin="' + esc(v[1]) + '">' + esc(v[0]) + '</option>').join('');
      if (defaults && defaults.village) {
        const match = list.find(v => v[0] === defaults.village);
        if (match) vi.value = match[0];
      }
    };
    st.addEventListener('change', () => { defaults = null; fillDistricts(); });
    di.addEventListener('change', fillTalukas);
    ta.addEventListener('change', fillVillages);
    vi.addEventListener('change', () => {
      const opt = vi.selectedOptions[0];
      if (opt && opt.dataset.pin && prefix === 'base') $('#pinInput').value = opt.dataset.pin;
    });
    fillDistricts();
    return { st, di, ta, vi };
  }

  function renderGuide() {
    const wrap = $('#guideRules');
    const scenes = { light: 'shelter', steady: 'school', whole: 'market', nobadge: 'health' };
    const bad = { light: { dark: true }, steady: { blur: true }, whole: { crop: true }, nobadge: { people: true } };
    wrap.innerHTML = PHOTO_RULES.map((r, i) =>
      '<div class="stack stack--sm">' +
      '<div class="row row--between">' +
      '<span class="row" style="gap:9px">' +
      '<span style="width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:var(--brand-soft);color:var(--brand-strong)">' +
      svgIcon(r.icon || 'award') + '</span>' +
      '<span class="stack" style="gap:1px"><span class="h3">' + esc(r.title) + '</span>' +
      '<span class="meta">Rule ' + (i + 1) + '</span></span></span>' +
      '<span class="badge badge--brand">' + esc(r.tag) + '</span></div>' +
      '<div class="btn-group btn-group--2">' +
      '<div class="stack" style="gap:5px">' +
      '<img src="' + photoFor(scenes[r.id], 'rule' + r.id, { w: 320, h: 240, q: 0.8 }) + '" alt="' + esc(r.title) + ' good example" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;width:100%;border:1px solid var(--line)"/>' +
      '<span class="meta" style="color:var(--brand)">✓ Do this</span></div>' +
      '<div class="stack" style="gap:5px">' +
      '<img src="' + photoFor(scenes[r.id], 'rule' + r.id, Object.assign({ w: 320, h: 240, q: 0.8 }, bad[r.id])) + '" alt="' + esc(r.title) + ' bad example" style="border-radius:14px;aspect-ratio:4/3;object-fit:cover;width:100%;border:1px solid var(--line)"/>' +
      '<span class="meta" style="color:var(--danger)">✗ Not like this</span></div>' +
      '</div>' +
      '<p class="meta">' + esc(r.desc) + '</p>' +
      '<hr class="divider"/>' +
      '</div>').join('');
  }

  function renderFaq() {
    const list = $('#faqList');
    list.innerHTML = FAQS.map(f =>
      '<div class="card" style="padding:0"><button class="row row--between" data-faq="' + f.id + '" type="button" style="width:100%;background:none;border:0;padding:14px;text-align:left;color:inherit;cursor:pointer">' +
      '<span class="h3">' + esc(f.q) + '</span>' + svgIcon('chevron-down') + '</button>' +
      '<div id="faq-' + f.id + '" class="stack stack--sm" hidden style="padding:0 14px 14px">' +
      '<p class="lead">' + esc(f.a) + '</p></div></div>').join('');
    $$('[data-faq]').forEach(b => b.addEventListener('click', () => {
      const c = $('#faq-' + b.dataset.faq);
      const open = !c.hasAttribute('hidden');
      c.toggleAttribute('hidden', open);
      b.querySelector('svg').style.transform = open ? '' : 'rotate(180deg)';
    }));
    const search = $('#faqSearch');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      $$('#faqList > .card').forEach(card => {
        const hit = card.textContent.toLowerCase().includes(q);
        card.style.display = hit ? '' : 'none';
      });
    });
  }

  /* ==================================================================
     12. CAPTURE PIPELINE (real image work on-device)
     ================================================================== */
  const draft = {
    photo: null,      // {src,w,h,bytesIn,bytesOut,hash}
    audit: null,      // {brightness,contrast,sharpness,duplicateOf}
    gps: null,        // {lat,lng,acc,source}
    locMode: 'home',
    otherPlace: { state: '', district: '', village: '' },
    categories: [],
    assetName: '', year: '', condition: '', description: '',
    flags: { people: false, private: false, sign: false },
    replacesId: null
  };

  function resetDraft(prefill) {
    draft.photo = null; draft.audit = null; draft.gps = null;
    draft.locMode = 'home';
    draft.categories = []; draft.assetName = ''; draft.year = ''; draft.condition = ''; draft.description = '';
    draft.flags = { people: false, private: false, sign: false };
    draft.replacesId = null;
    if (prefill) {
      draft.replacesId = prefill.id;
      draft.assetName = prefill.assetName || '';
      draft.description = prefill.description || '';
      draft.categories = prefill.categories.slice();
      draft.otherPlace = { state: prefill.location.state, district: prefill.location.district, village: prefill.location.village };
    }
  }

  function loadBitmap(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file).catch(() => loadBitmapViaImg(file));
    }
    return loadBitmapViaImg(file);
  }
  function loadBitmapViaImg(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { res(img); };
      img.onerror = () => rej(new Error('Could not read the image'));
      img.src = url;
    });
  }

  function toCanvas(bmp, maxDim) {
    const w = bmp.width || bmp.naturalWidth, h = bmp.height || bmp.naturalHeight;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bmp, 0, 0, cw, ch);
    return c;
  }

  function analyzeImage(canvas) {
    const S = 64;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(canvas, 0, 0, S, S);
    const d = ctx.getImageData(0, 0, S, S).data;
    const lum = new Float32Array(S * S);
    let sum = 0;
    for (let i = 0; i < S * S; i++) {
      const l = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
      lum[i] = l; sum += l;
    }
    const mean = sum / (S * S);
    let varsum = 0;
    for (let i = 0; i < S * S; i++) varsum += (lum[i] - mean) * (lum[i] - mean);
    const std = Math.sqrt(varsum / (S * S));

    let lapSum = 0, lapSq = 0, lapN = 0;
    for (let y = 1; y < S - 1; y++) {
      for (let x = 1; x < S - 1; x++) {
        const i = y * S + x;
        const v = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - S] - lum[i + S];
        lapSum += v; lapSq += v * v; lapN++;
      }
    }
    const lapMean = lapSum / lapN;
    const sharpness = Math.max(0, lapSq / lapN - lapMean * lapMean);

    // 64-bit average hash for duplicate detection
    const A = 8;
    const hc = document.createElement('canvas');
    hc.width = A; hc.height = A;
    const hctx = hc.getContext('2d', { willReadFrequently: true });
    hctx.drawImage(canvas, 0, 0, A, A);
    const hd = hctx.getImageData(0, 0, A, A).data;
    const bits = [];
    let avg = 0;
    const vals = [];
    for (let i = 0; i < A * A; i++) {
      const l = 0.2126 * hd[i * 4] + 0.7152 * hd[i * 4 + 1] + 0.0722 * hd[i * 4 + 2];
      vals.push(l); avg += l;
    }
    avg /= (A * A);
    vals.forEach(v => bits.push(v > avg ? '1' : '0'));

    return {
      brightness: Math.round(mean),
      contrast: Math.round(std),
      sharpness: Math.round(sharpness),
      hash: bits.join('')
    };
  }

  function hamming(a, b) {
    if (!a || !b || a.length !== b.length) return 99;
    let d = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
    return d;
  }

  function findDuplicate(hash) {
    if (!hash) return null;
    let best = null, bestD = 99;
    DB.submissions.forEach(x => {
      if (!x.photo || typeof x.photo.hash !== 'string' || x.photo.hash.length !== 64) return;
      const d = hamming(hash, x.photo.hash);
      if (d < bestD) { bestD = d; best = x; }
    });
    return bestD <= 10 ? best : null;
  }

  /* Minimal EXIF GPS reader — real coordinates out of the photo itself */
  function readExifGps(file) {
    return file.slice(0, 256 * 1024).arrayBuffer().then(buf => {
      try {
        const view = new DataView(buf);
        if (view.byteLength < 8 || view.getUint16(0) !== 0xFFD8) return null;
        let off = 2;
        while (off + 4 < view.byteLength) {
          if (view.getUint16(off) !== 0xFFE1) {
            off += 2 + view.getUint16(off + 2);
            continue;
          }
          const tiff = off + 10;
          const bom = view.getUint16(tiff);
          const little = bom === 0x4949;
          const u16 = o => view.getUint16(tiff + o, little);
          const u32 = o => view.getUint32(tiff + o, little);
          if (u16(2) !== 0x002A) return null;
          const ifd0 = u32(4);
          let gpsPtr = null;
          const n0 = u16(ifd0);
          for (let i = 0; i < n0; i++) {
            const e = ifd0 + 2 + i * 12;
            if (u16(e) === 0x8825) gpsPtr = u32(e + 8);
          }
          if (gpsPtr === null) return null;
          const n = u16(gpsPtr);
          const t = {};
          for (let i = 0; i < n; i++) {
            const e = gpsPtr + 2 + i * 12;
            const tag = u16(e), type = u16(e + 2), count = u32(e + 4);
            const size = { 1: 1, 2: 2, 3: 4, 4: 4, 5: 8 }[type] || 4;
            const total = size * count;
            let vo = e + 8;
            if (total > 4) vo = tiff + u32(e + 8);
            const rd = k => type === 3 ? view.getUint16(vo + k * 2, little) : view.getUint32(vo + k * 4, little);
            t[tag] = { count, rd };
          }
          const toDeg = (tag, refTag) => {
            if (!t[tag]) return null;
            const d = t[tag], ref = t[refTag] ? String.fromCharCode(d.rd(0)) : 'N';
            let deg = d.rd(0) + d.rd(1) / 60 + d.rd(2) / 3600;
            if (ref === 'S' || ref === 'W') deg = -deg;
            return deg;
          };
          const lat = toDeg(2, 1), lng = toDeg(4, 3);
          if (lat == null || lng == null) return null;
          return { lat: lat, lng: lng };
        }
        return null;
      } catch (e) { return null; }
    }).catch(() => null);
  }

  function bytesOf(dataUrl) {
    const i = dataUrl.indexOf(',');
    const b64 = dataUrl.slice(i + 1);
    return Math.floor(b64.length * 0.75);
  }

  async function handlePhoto(file) {
    if (!file) return;
    toast('Reading photo…', 'info');
    let bmp;
    try { bmp = await loadBitmap(file); }
    catch (e) { toast('That file could not be opened as an image.', 'error'); return; }

    const full = toCanvas(bmp, 1600);
    const metrics = analyzeImage(full);
    const quality = 0.78;
    const dataUrl = full.toDataURL('image/jpeg', quality);
    const outBytes = bytesOf(dataUrl);

    const exif = await readExifGps(file);

    draft.photo = {
      src: dataUrl, w: full.width, h: full.height,
      bytesIn: file.size, bytesOut: outBytes, hash: metrics.hash
    };
    draft.gps = exif
      ? { lat: exif.lat, lng: exif.lng, acc: 12, source: 'exif' }
      : { lat: null, lng: null, acc: null, source: 'none' };

    const dup = findDuplicate(metrics.hash);
    draft.audit = {
      brightness: metrics.brightness,
      contrast: metrics.contrast,
      sharpness: metrics.sharpness,
      duplicateOf: dup ? dup.id : null
    };

    // paint the preview
    const img = $('#capImg');
    img.src = dataUrl;
    img.classList.remove('is-zoomed');
    zoomLevel = 1;

    renderCaptureMeta();
    $('#capNext').disabled = false;
    toast(exif ? 'Photo ready. GPS was found inside the photo.' : 'Photo ready. No GPS inside the photo — you can add the phone GPS on the next screen.');
  }

  function auditChecks(a) {
    const checks = [];
    const b = a.brightness;
    if (b < 40) checks.push({ st: 'fail', t: 'Too dark', h: 'The photo is very dark. Take it in daylight, not at night or under a tree.' });
    else if (b < 60) checks.push({ st: 'warn', t: 'A bit dark', h: 'Face the sun. A brighter photo is more likely to be approved.' });
    else if (b > 215) checks.push({ st: 'warn', t: 'Very bright', h: 'Part of the photo is washed out. Avoid shooting straight into the sun.' });
    else checks.push({ st: 'pass', t: 'Good light', h: 'Brightness is in the range reviewers accept.' });

    const c = a.contrast;
    if (c < 12) checks.push({ st: 'fail', t: 'Low contrast', h: 'The photo looks flat. Step back a little and shoot in daylight.' });
    else if (c < 22) checks.push({ st: 'warn', t: 'Could be clearer', h: 'A slightly different angle will help the reviewer see the asset.' });
    else checks.push({ st: 'pass', t: 'Good contrast', h: 'Shapes and edges are clearly visible.' });

    const s = a.sharpness;
    if (s < 25) checks.push({ st: 'fail', t: 'Blurry', h: 'Hold the phone still for one second after tapping the shutter.' });
    else if (s < 60) checks.push({ st: 'warn', t: 'Slightly soft', h: 'Clean the lens and hold the phone with both hands.' });
    else checks.push({ st: 'pass', t: 'Sharp', h: 'The photo is focused well enough.' });

    if (a.duplicateOf) checks.push({ st: 'fail', t: 'Looks like a duplicate', h: 'A similar photo (#' + a.duplicateOf + ') already exists. Photograph a different angle or a different asset.' });
    else checks.push({ st: 'pass', t: 'No duplicate found', h: 'This asset has not been photographed from this village before.' });

    return checks;
  }

  function renderCaptureMeta() {
    const card = $('#capMetaCard');
    if (!draft.photo) { card.hidden = true; return; }
    card.hidden = false;
    const p = draft.photo;
    const saved = Math.round((1 - p.bytesOut / p.bytesIn) * 100);
    $('#capSizeBadge').textContent = (p.bytesIn / 1048576).toFixed(1) + ' MB → ' +
      Math.round(p.bytesOut / 1024) + ' KB';
    $('#capMetaList').innerHTML =
      kv('Original size', (p.bytesIn / 1048576).toFixed(2) + ' MB') +
      kv('Sent size', Math.round(p.bytesOut / 1024) + ' KB (' + saved + '% smaller)') +
      kv('Resolution', p.w + ' × ' + p.h + ' px') +
      kv('GPS inside photo', draft.gps.source === 'exif'
        ? draft.gps.lat.toFixed(5) + ', ' + draft.gps.lng.toFixed(5)
        : 'not found in this photo');

    const checks = auditChecks(draft.audit);
    const fails = checks.filter(x => x.st === 'fail').length;
    const badge = $('#capAuditBadge');
    badge.textContent = fails ? fails + ' problem' + (fails > 1 ? 's' : '') + ' to fix'
      : (checks.some(x => x.st === 'warn') ? 'Passed with warnings' : 'All checks passed');
    badge.className = 'badge badge--' + (fails ? 'danger' : checks.some(x => x.st === 'warn') ? 'warn' : 'brand');
    $('#capAuditList').innerHTML = checks.map(c =>
      '<div class="checklist__row is-' + c.st + '">' +
      svgIcon(c.st === 'pass' ? 'check-circle' : c.st === 'warn' ? 'alert' : 'close') +
      '<span class="checklist__body"><span class="checklist__title">' + esc(c.t) + '</span>' +
      '<span class="checklist__hint">' + esc(c.h) + '</span></span></div>').join('');

    const tag = $('#capPhotoTag');
    tag.innerHTML = svgIcon('image') + '<span>' + (draft.gps.source === 'exif' ? 'GPS in photo' : 'No GPS in photo') + '</span>';
  }

  let zoomLevel = 1;
  function setZoom() {
    const img = $('#capImg');
    img.style.transform = 'scale(' + zoomLevel + ')';
    img.classList.toggle('is-zoomed', zoomLevel > 1);
  }

  /* ==================================================================
     13. LOCATION
     ================================================================== */
  function renderLocation() {
    const u = DB.user;
    $('#locHomeDesc').textContent = [u.village, 'Ward ' + u.ward, u.district, u.state].filter(Boolean).join(', ');
    renderGeoSelects('loc', { state: u.state, district: u.district, village: u.village });

    const g = draft.gps;
    const badge = $('#locSourceBadge');
    const list = $('#locTelemetryList');
    if (g && g.lat != null) {
      badge.textContent = g.source === 'exif' ? 'From the photo' : 'From this phone';
      badge.className = 'badge badge--brand';
      list.innerHTML = kv('Latitude', g.lat.toFixed(5)) + kv('Longitude', g.lng.toFixed(5)) +
        (g.acc ? kv('Accuracy', '±' + g.acc + ' m') : '') +
        kv('Trust', g.source === 'exif' ? 'Coordinates were stored in the photo by the camera' : 'Coordinates came from the phone GPS');
    } else {
      badge.textContent = 'No coordinates';
      badge.className = 'badge badge--danger';
      list.innerHTML = kv('Latitude', '—') + kv('Longitude', '—') +
        '<p class="hint hint--error">' + svgIcon('alert') + '<span>Without coordinates this photo is much less useful for mapping. Tap the button below to use the phone GPS.</span></p>';
    }
    $('#locOtherBox').hidden = draft.locMode !== 'other';
  }

  function useDeviceGps() {
    if (!navigator.geolocation) { toast('This device has no GPS.', 'warn'); return; }
    toast('Finding your position…', 'info');
    navigator.geolocation.getCurrentPosition(pos => {
      draft.gps = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: Math.round(pos.coords.accuracy), source: 'device' };
      renderLocation();
      toast('Position locked (±' + Math.round(pos.coords.accuracy) + ' m).');
    }, err => {
      toast('Could not get a GPS fix: ' + (err && err.message ? err.message : 'unknown error'), 'error');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  /* ==================================================================
     14. CATEGORIES
     ================================================================== */
  function renderCategories() {
    const wrap = $('#catTiles');
    wrap.innerHTML = CATEGORIES.map(c =>
      '<button class="tile" type="button" data-cat="' + c.id + '" aria-pressed="' + (draft.categories.indexOf(c.id) !== -1) + '">' +
      '<span class="tile__icon">' + svgIcon(c.icon) + '</span>' +
      '<span class="tile__check">' + svgIcon('check') + '</span>' +
      '<span class="tile__name">' + esc(c.label) + '</span>' +
      '<span class="tile__desc">' + esc(c.desc) + '</span>' +
      '</button>').join('');
    $$('[data-cat]', wrap).forEach(t => t.addEventListener('click', () => {
      const id = t.dataset.cat;
      const i = draft.categories.indexOf(id);
      if (i === -1) draft.categories.push(id);
      else draft.categories.splice(i, 1);
      renderCategories();
    }));
    $('#catCount').textContent = draft.categories.length + ' selected' +
      (draft.categories.length > 1 ? ' · main: ' + catById(draft.categories[0]).label : '');
    $('#catNext').disabled = draft.categories.length === 0;
  }

  /* ==================================================================
     15. DESCRIBE
     ================================================================== */
  const YEARS = ['Before 2000', '2000–2010', '2011–2015', '2016–2020', '2021–2025', 'Not known'];
  const CONDITIONS = ['Working', 'Partly working', 'Not working', 'Under repair', 'Newly built'];

  function renderDescribe() {
    const yc = $('#yearChips');
    yc.innerHTML = YEARS.map(y => '<button class="chip' + (draft.year === y ? ' is-on' : '') + '" type="button" data-year="' + esc(y) + '" aria-pressed="' + (draft.year === y) + '">' + esc(y) + '</button>').join('');
    $$('[data-year]', yc).forEach(b => b.addEventListener('click', () => { draft.year = draft.year === b.dataset.year ? '' : b.dataset.year; renderDescribe(); }));

    const cc = $('#conditionChips');
    cc.innerHTML = CONDITIONS.map(y => '<button class="chip' + (draft.condition === y ? ' is-on' : '') + '" type="button" data-cond="' + esc(y) + '" aria-pressed="' + (draft.condition === y) + '">' + esc(y) + '</button>').join('');
    $$('[data-cond]', cc).forEach(b => b.addEventListener('click', () => { draft.condition = draft.condition === b.dataset.cond ? '' : b.dataset.cond; renderDescribe(); }));

    const lc = $('#descLangChips');
    const langs = LANGS.filter(l => l.speech);
    lc.innerHTML = langs.map(l => '<button class="chip' + (descLang === l.code ? ' is-on' : '') + '" type="button" data-dlang="' + l.code + '" aria-pressed="' + (descLang === l.code) + '">' + esc(l.native) + '</button>').join('');
    $$('[data-dlang]', lc).forEach(b => b.addEventListener('click', () => {
      descLang = b.dataset.dlang;
      $('#descLangNote').textContent = langByCode(descLang).name;
      renderDescribe();
    }));

    $('#assetName').value = draft.assetName;
    $('#descInput').value = draft.description;
    updateDescCount();
  }
  let descLang = 'en-IN';

  function updateDescCount() {
    const v = $('#descInput').value.trim();
    $('#descCount').textContent = v.length + ' characters';
    $('#descNext').disabled = !(draft.assetName.trim() && v.length >= 20);
  }

  function startDictation() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast('This browser cannot do speech-to-text. Type the description instead.', 'warn');
      return;
    }
    const btn = $('#descMicBtn');
    const rec = new SR();
    rec.lang = descLang;
    rec.interimResults = false;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = ev => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) finalText += ev.results[i][0].transcript + ' ';
      }
      $('#descInput').value = ($('#descInput').value ? $('#descInput').value + ' ' : '') + finalText.trim();
      draft.description = $('#descInput').value;
      updateDescCount();
    };
    rec.onerror = ev => { toast('Speech input failed: ' + (ev.error || 'unknown'), 'error'); };
    rec.onend = () => { btn.classList.remove('is-on'); $('#descMicLabel').textContent = 'Speak'; };
    btn.classList.add('is-on');
    $('#descMicLabel').textContent = 'Listening…';
    try { rec.start(); } catch (e) { toast('Could not start the microphone.', 'error'); btn.classList.remove('is-on'); }
  }

  /* ==================================================================
     16. REVIEW + SUBMIT
     ================================================================== */
  function renderReview() {
    const u = DB.user;
    const p = draft.photo;
    $('#revImg').src = p ? p.src : '';
    const place = draft.locMode === 'home'
      ? [u.village, 'Ward ' + u.ward, u.district].filter(Boolean).join(', ')
      : [draft.otherPlace.village, draft.otherPlace.district].filter(Boolean).join(', ');
    $('#revLocation').textContent = place;
    $('#revGps').textContent = draft.gps && draft.gps.lat != null
      ? draft.gps.lat.toFixed(5) + ', ' + draft.gps.lng.toFixed(5) + (draft.gps.acc ? ' (±' + draft.gps.acc + 'm)' : '')
      : 'not recorded — this photo will be reviewed as unverified';
    $('#revCategory').textContent = draft.categories.map(c => catById(c).label).join(', ');
    $('#revDescription').textContent = draft.description || '—';

    const fl = [];
    if (draft.flags.people) fl.push('people visible');
    if (draft.flags.private) fl.push('private property');
    if (draft.flags.sign) fl.push('readable signboard');
    $('#revFlags').textContent = fl.length ? fl.join(', ') : 'none';

    const net = $('#revNetBadge');
    if (isOnline()) { net.textContent = 'Online — will send now'; net.className = 'badge badge--brand'; }
    else { net.textContent = 'Offline — will queue'; net.className = 'badge badge--warn'; }
    $('#submitLabel').textContent = isOnline() ? 'Send for review' : 'Save and send later';
  }

  function submitSubmission() {
    if (!draft.photo) { toast('Add a photo first.', 'warn'); return; }
    const u = DB.user;
    const online = isOnline();
    const now = Date.now();
    const place = draft.locMode === 'home'
      ? { village: u.village, ward: u.ward, state: u.state, district: u.district, taluka: u.taluka, pin: u.pin, verified: !!(draft.gps && draft.gps.lat != null) }
      : { village: draft.otherPlace.village, ward: '', state: draft.otherPlace.state, district: draft.otherPlace.district, taluka: '', pin: '', verified: false };

    const sub = {
      id: uid('JT'),
      createdAt: now,
      submittedAt: online ? now : null,
      reviewedAt: null,
      status: online ? 'pending' : 'queued',
      title: draft.assetName,
      assetName: draft.assetName,
      year: draft.year,
      condition: draft.condition,
      categories: draft.categories.slice(),
      primaryCategory: draft.categories[0],
      description: draft.description,
      photo: draft.photo,
      gps: draft.gps ? { lat: draft.gps.lat, lng: draft.gps.lng, acc: draft.gps.acc, source: draft.gps.source } : { lat: null, lng: null, acc: null, source: 'none' },
      location: place,
      audit: draft.audit,
      privacy: Object.assign({}, draft.flags),
      rejectReason: '', rejectNote: '',
      replacesId: draft.replacesId
    };
    DB.submissions.unshift(sub);
    DB.lastSync = online ? now : DB.lastSync;
    save();

    $('#doneId').textContent = '#' + sub.id;
    $('#doneStatus').textContent = STATUS_META[sub.status].label;
    $('#doneAsset').textContent = sub.assetName;
    $('#donePlace').textContent = [place.village, place.ward ? 'Ward ' + place.ward : ''].filter(Boolean).join(', ');
    $('#doneTitle').textContent = online ? 'Sent for review' : 'Saved on this phone';
    $('#doneMsg').textContent = online
      ? 'A reviewer will check your photo. You get the ₹10 in your UPI account once it is approved.'
      : 'You have no signal, so the photo is stored on this phone. It will be sent automatically as soon as you are back online — you do not need to do anything.';

    resetDraft();
    go('scr-done');
    toast(online ? 'Submitted. Reference #' + sub.id : 'Saved on this phone. It will send when you have signal.');
  }

  /* ==================================================================
     17. SYNC
     ================================================================== */
  function syncNow(silent) {
    if (!isOnline()) {
      if (!silent) toast('No signal. Your photos stay safe on this phone until you are back online.', 'warn');
      return false;
    }
    const waiting = pendingQueue();
    if (!waiting.length) {
      if (!silent) toast('Everything is already sent.', 'info');
      return true;
    }
    const now = Date.now();
    waiting.forEach(x => {
      x.status = 'pending';
      x.submittedAt = now;
      x.history = (x.history || []).concat([{ st: 'pending', at: now }]);
    });
    DB.lastSync = now;
    save();
    if (!silent) toast(waiting.length + ' photo' + (waiting.length > 1 ? 's' : '') + ' sent for review.');
    updateNetChip();
    if (current === 'scr-history') renderHistory();
    if (current === 'scr-home') renderHome();
    if (current === 'scr-earnings') renderEarnings();
    return true;
  }

  /* ==================================================================
     18. REVIEWER DESK
     ================================================================== */
  let reviewerFilter = 'pending';
  const REVIEW_TABS = [
    { key: 'pending', label: 'Waiting' },
    { key: 'flagged', label: 'Flagged' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' }
  ];

  function renderReviewer() {
    const s = stats();
    $('#rvStats').innerHTML =
      statTile('Waiting', String(s.pending + s.flagged), 'need a decision', 'warn') +
      statTile('Approved', String(s.approved), inr(s.credited) + ' paid', 'brand') +
      statTile('Rejected', String(s.rejected), 'sent back', 'danger') +
      statTile('Payouts', inr(s.credited), s.approved + ' photos', 'info');

    const tabs = $('#rvTabs');
    tabs.className = 'seg';
    tabs.innerHTML = REVIEW_TABS.map(t =>
      '<button class="seg__btn' + (reviewerFilter === t.key ? ' is-on' : '') + '" data-rt="' + t.key + '" type="button" aria-pressed="' +
      (reviewerFilter === t.key) + '">' + esc(t.label) + '</button>').join('');
    $$('[data-rt]', tabs).forEach(b => b.addEventListener('click', () => { reviewerFilter = b.dataset.rt; renderReviewer(); }));

    const q = ($('#rvSearch').value || '').trim().toLowerCase();
    let rows = DB.submissions.filter(x => {
      const tabOk = reviewerFilter === 'all' ? true
        : reviewerFilter === 'pending' ? (x.status === 'pending' || x.status === 'flagged')
        : x.status === reviewerFilter;
      if (!tabOk) return false;
      if (!q) return true;
      return (x.id + ' ' + x.location.village + ' ' + x.assetName + ' ' + x.categories.join(' ')).toLowerCase().indexOf(q) !== -1;
    }).sort((a, b) => a.createdAt - b.createdAt);

    const list = $('#rvList');
    list.innerHTML = rows.length ? rows.map(rvRow).join('')
      : emptyState('check-circle', 'Queue is clear', 'No submission is waiting for a decision.');
    hydrateIcons(list);
    $$('[data-inspect]', list).forEach(b => b.addEventListener('click', () => openInspect(b.dataset.inspect)));

    const log = $('#rvLog');
    log.innerHTML = DB.log.length ? DB.log.slice().reverse().map(l =>
      '<div class="ledgerrow"><span class="grow stack" style="gap:2px">' +
      '<span class="item__title">#' + esc(l.id) + ' · ' + esc(l.action) + '</span>' +
      '<span class="item__sub">' + esc(l.by) + ' · ' + esc(fmtDate(l.at)) + (l.note ? ' · ' + esc(l.note) : '') + '</span>' +
      '</span></div>').join('') : emptyState('clipboard', 'No decisions yet', 'Approved, flagged and rejected photos are logged here.');
    hydrateIcons(log);
  }

  function rvRow(x) {
    const m = STATUS_META[x.status];
    const flags = [];
    if (x.privacy.people) flags.push('people');
    if (x.privacy.private) flags.push('private');
    if (x.privacy.sign) flags.push('sign');
    if (!x.gps.lat) flags.push('no GPS');
    return '<button class="item" data-inspect="' + esc(x.id) + '" type="button">' +
      '<img class="item__thumb" src="' + x.photo.src + '" alt=""/>' +
      '<span class="item__body">' +
      '<span class="item__sub">#' + esc(x.id) + ' · waiting ' + esc(fmtAgo(x.createdAt)) + '</span>' +
      '<span class="item__title">' + esc(x.assetName) + '</span>' +
      '<span class="item__sub">' + esc(x.location.village) + ' · ' + esc(catById(x.primaryCategory).label) + '</span>' +
      (flags.length ? '<span class="item__sub" style="color:var(--warn)">⚠ ' + esc(flags.join(', ')) + '</span>' : '') +
      '</span>' +
      '<span class="item__right"><span class="badge badge--' + m.badge + '">' + esc(m.label) + '</span>' +
      '<span class="meta">Inspect →</span></span></button>';
  }

  function openInspect(id) {
    const x = DB.submissions.find(y => y.id === id);
    if (!x) return;
    $('#mdlInspectTitle').textContent = '#' + x.id + ' · ' + x.location.village;
    const checks = auditChecks(x.audit || { brightness: 0, contrast: 0, sharpness: 0, duplicateOf: x.audit && x.audit.duplicateOf });
    const flags = [];
    if (x.privacy.people) flags.push('People are visible — check that permission was given');
    if (x.privacy.private) flags.push('Contributor flagged this as a private property');
    if (x.privacy.sign) flags.push('A signboard or nameplate may be readable');
    if (!x.gps.lat) flags.push('No GPS coordinates on this photo');

    $('#mdlInspectBody').innerHTML =
      '<div class="photo"><img class="photo__img" id="inspectImg" src="' + x.photo.src + '" alt="Photo under review"/>' +
      '<div class="photo__bar"><span class="photo__tag">' + svgIcon('info') + '<span>Tap the image to zoom</span></span></div></div>' +
      '<div class="row row--between"><span class="h3">Checks on this photo</span>' +
      '<span class="badge badge--' + (checks.some(c => c.st === 'fail') ? 'danger' : 'brand') + '">' +
      (checks.some(c => c.st === 'fail') ? 'Has problems' : 'Looks good') + '</span></div>' +
      '<div class="checklist">' + checks.map(c =>
        '<div class="checklist__row is-' + c.st + '">' +
        svgIcon(c.st === 'pass' ? 'check-circle' : c.st === 'warn' ? 'alert' : 'close') +
        '<span class="checklist__body"><span class="checklist__title">' + esc(c.t) + '</span>' +
        '<span class="checklist__hint">' + esc(c.h) + '</span></span></div>').join('') + '</div>' +
      (flags.length ? '<div class="notice notice--warn">' + svgIcon('shield') +
        '<span><span class="notice__title">Contributor flags</span>' + esc(flags.join(' · ')) + '</span></div>' : '') +
      '<div class="divider"></div>' +
      kv('Asset', x.assetName) +
      kv('Category', x.categories.map(c => catById(c).label).join(', ')) +
      kv('Built', x.year || 'not stated') +
      kv('Condition', x.condition || 'not stated') +
      kv('Description', x.description) +
      kv('Place', [x.location.village, x.location.ward ? 'Ward ' + x.location.ward : '', x.location.district, x.location.state].filter(Boolean).join(', ')) +
      kv('Coordinates', x.gps.lat != null ? x.gps.lat.toFixed(5) + ', ' + x.gps.lng.toFixed(5) + ' (±' + x.gps.acc + 'm, ' + (x.gps.source === 'exif' ? 'from photo' : 'from phone') + ')' : 'none') +
      kv('Photo size', Math.round((x.photo.bytesOut || 0) / 1024) + ' KB sent from ' + Math.round((x.photo.bytesIn || 0) / 1024) + ' KB');

    const foot = $('#mdlInspectFoot');
    foot.innerHTML = '';
    const mk = (cls, label, icon, fn) => {
      const b = document.createElement('button');
      b.className = cls;
      b.innerHTML = svgIcon(icon) + '<span>' + label + '</span>';
      b.addEventListener('click', fn);
      foot.appendChild(b);
    };
    mk('btn btn--ghost', 'Flag', 'flag', () => { closeModal('mdl-inspect'); askNote('Flag for a supervisor', 'Why does this need a second look?', (note) => { decide(x, 'flagged', '', note); }); });
    mk('btn btn--danger', 'Reject', 'close', () => { closeModal('mdl-inspect'); askReject(x); });
    mk('btn', 'Approve ' + inr(PAY_PER_PHOTO), 'check', () => { closeModal('mdl-inspect'); askNote('Approve and pay ' + inr(PAY_PER_PHOTO), 'Optional note for the contributor', (note) => { decide(x, 'approved', '', note); }); });

    openModal('mdl-inspect');
    const img = $('#inspectImg');
    if (img) img.addEventListener('click', () => img.classList.toggle('is-zoomed'));
  }

  function decide(x, action, reason, note) {
    const now = Date.now();
    x.status = action;
    x.reviewedAt = now;
    if (action === 'approved') {
      x.rejectReason = ''; x.rejectNote = '';
      if (DB.user.upiNeedsCheck) { DB.user.upiNeedsCheck = false; DB.user.upiVerified = true; }
    } else if (action === 'rejected') {
      x.rejectReason = reason; x.rejectNote = note || '';
    } else if (action === 'flagged') {
      x.rejectReason = ''; x.rejectNote = note || '';
    }
    DB.log.unshift({ at: now, by: 'Review desk', action: action, id: x.id, note: note || reason || '' });
    save();
    toast(action === 'approved' ? '#' + x.id + ' approved. ' + inr(PAY_PER_PHOTO) + ' sent to ' + DB.user.upi + '.'
      : action === 'rejected' ? '#' + x.id + ' rejected. The contributor can now fix and resubmit.'
      : '#' + x.id + ' sent to a supervisor.');
    renderReviewer();
  }

  function askNote(title, label, cb) {
    $('#mdlNoteTitle').textContent = title;
    $('#mdlNoteBody').innerHTML =
      '<div class="field"><label class="label" for="noteInput">' + esc(label) + '</label>' +
      '<textarea class="textarea" id="noteInput" rows="3" placeholder="Type here"></textarea></div>';
    const foot = $('#mdlNoteFoot');
    foot.innerHTML = '';
    const cancel = document.createElement('button');
    cancel.className = 'btn btn--ghost';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => closeModal('mdl-note'));
    const ok = document.createElement('button');
    ok.className = 'btn';
    ok.textContent = 'Save';
    ok.addEventListener('click', () => {
      const v = $('#noteInput').value.trim();
      closeModal('mdl-note');
      cb(v);
    });
    foot.appendChild(cancel); foot.appendChild(ok);
    openModal('mdl-note');
  }

  function askReject(x) {
    $('#mdlNoteTitle').textContent = 'Reject #' + x.id;
    $('#mdlNoteBody').innerHTML =
      '<div class="field"><label class="label" for="rejectReason">Reason <span class="label__req">Required</span></label>' +
      '<select class="select" id="rejectReason">' +
      REJECT_REASONS.map(r => '<option>' + esc(r) + '</option>').join('') + '</select></div>' +
      '<div class="field"><label class="label" for="rejectNote">Note to the contributor</label>' +
      '<textarea class="textarea" id="rejectNote" rows="3" placeholder="Tell them what to change. They will see this and can resubmit."></textarea></div>' +
      '<div class="notice notice--info">' + svgIcon('info') +
      '<span>The contributor sees this reason on their phone and can fix the photo and send it again. Nothing is paid for a rejected photo.</span></div>';
    const foot = $('#mdlNoteFoot');
    foot.innerHTML = '';
    const cancel = document.createElement('button');
    cancel.className = 'btn btn--ghost';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => closeModal('mdl-note'));
    const ok = document.createElement('button');
    ok.className = 'btn btn--danger';
    ok.textContent = 'Reject photo';
    ok.addEventListener('click', () => {
      const reason = $('#rejectReason').value;
      const note = $('#rejectNote').value.trim();
      closeModal('mdl-note');
      decide(x, 'rejected', reason, note);
    });
    foot.appendChild(cancel); foot.appendChild(ok);
    openModal('mdl-note');
  }

  /* --- staff gate -------------------------------------------------------- */
  function requestReviewerAccess() {
    $('#mdlPinTitle').textContent = 'Review desk — staff only';
    $('#mdlPinBody').innerHTML =
      '<p class="lead">Enter the 4-digit staff code to open the review queue.</p>' +
      '<div class="field"><label class="label" for="staffCodeInput">Staff code</label>' +
      '<input class="input" id="staffCodeInput" type="password" inputmode="numeric" maxlength="4" placeholder="4 digits"/></div>' +
      '<div class="notice notice--info">' + svgIcon('info') +
      '<span>Prototype code is <strong>2468</strong>. In production this screen is not available on contributor phones at all.</span></div>';
    const foot = $('#mdlPinFoot');
    foot.innerHTML = '';
    const cancel = document.createElement('button');
    cancel.className = 'btn btn--ghost';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => closeModal('mdl-pin'));
    const ok = document.createElement('button');
    ok.className = 'btn';
    ok.textContent = 'Open desk';
    ok.addEventListener('click', () => {
      const v = $('#staffCodeInput').value.trim();
      if (v === '2468') { closeModal('mdl-pin'); go('scr-reviewer'); }
      else { toast('Wrong staff code.', 'error'); }
    });
    foot.appendChild(cancel); foot.appendChild(ok);
    openModal('mdl-pin');
    const inp = $('#staffCodeInput');
    if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') ok.click(); });
  }

  /* --- UPI change with re-authentication -------------------------------- */
  function requestUpiChange() {
    $('#mdlUpiTitle').textContent = 'Change UPI ID';
    $('#mdlUpiBody').innerHTML =
      '<div class="field"><label class="label" for="newUpi">New UPI ID</label>' +
      '<input class="input" id="newUpi" type="text" placeholder="name@bank" value="' + esc(DB.user.upi || '') + '"/>' +
      '<p class="hint">' + svgIcon('info') + '<span>Example: ramesh.patil@oksbi. The first payout to a new ID is paid only after a staff check.</span></p></div>' +
      '<div class="field"><label class="label" for="upiPin">Your 4-digit PIN</label>' +
      '<input class="input" id="upiPin" type="password" inputmode="numeric" maxlength="4" placeholder="4 digits"/></div>' +
      '<div class="notice notice--warn">' + svgIcon('alert') +
      '<span>Changing the UPI ID changes where your money goes. We ask for your PIN so nobody else can redirect your payments.</span></div>';
    const foot = $('#mdlUpiFoot');
    foot.innerHTML = '';
    const cancel = document.createElement('button');
    cancel.className = 'btn btn--ghost';
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => closeModal('mdl-upi'));
    const ok = document.createElement('button');
    ok.className = 'btn';
    ok.textContent = 'Save UPI ID';
    ok.addEventListener('click', () => {
      const v = $('#newUpi').value.trim();
      const pin = $('#upiPin').value.trim();
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v)) { toast('Enter a valid UPI ID such as name@bank.', 'error'); return; }
      if (pin !== '1234') { toast('Wrong PIN.', 'error'); return; }
      DB.user.upi = v;
      DB.user.upiNeedsCheck = true;
      DB.user.upiVerified = false;
      save();
      closeModal('mdl-upi');
      renderEarnings();
      toast('UPI ID updated. It will be marked verified after the first payout lands in it.');
    });
    foot.appendChild(cancel); foot.appendChild(ok);
    openModal('mdl-upi');
  }

  /* ==================================================================
     19. THEME / NETWORK CHIPS
     ================================================================== */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', DB.settings.theme);
    const dark = DB.settings.theme === 'dark';
    $('#themeSwitch').checked = dark;
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.setAttribute('content', dark ? '#0E141B' : '#0E9F6E');
    const rail = $('#railTheme');
    if (rail) { rail.innerHTML = svgIcon(dark ? 'sun' : 'moon'); rail.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
  }

  function updateNetChip() {
    const chip = $('#netChip');
    const waiting = pendingQueue().length;
    const online = isOnline();
    chip.className = 'pill pill--square' + (online ? (waiting ? ' pill--queue' : ' pill--live') : ' pill--off');
    chip.innerHTML = svgIcon(online ? 'wifi' : 'wifi-off') +
      '<span class="sr-only" id="netChipText">' + (online ? (waiting ? waiting + ' queued' : 'Online') : 'Offline') + '</span>';
    chip.setAttribute('aria-label', online ? 'Online. Tap to sync.' : 'Offline. Photos are saved on this phone.');
    const rail = $('#railOffline');
    if (rail) { rail.setAttribute('aria-pressed', String(!online && DB.settings.simulateOffline)); rail.innerHTML = svgIcon('wifi-off'); }
    if (current === 'scr-review') renderReview();
  }

  /* ==================================================================
     20. WIRING
     ================================================================== */
  function bind() {
    /* language */
    $('#langNext').addEventListener('click', () => { save(); go('scr-onboard-verify'); });
    $('#speakBtn').addEventListener('click', () => {
      const l = langByCode(DB.user.lang);
      const text = l.code === 'en-IN'
        ? 'Choose your language. You will type and speak descriptions in this language. Tap Continue with ' + l.name + '.'
        : 'आपको अपनी भाषा चुननी है।' + l.name;
      speak(text, l.code);
    });

    /* phone + OTP */
    const phone = $('#phoneInput');
    phone.addEventListener('input', () => { phone.value = phone.value.replace(/\D/g, '').slice(0, 10); });
    $('#sendOtpBtn').addEventListener('click', () => {
      if (phone.value.length !== 10) { toast('Enter a 10-digit mobile number.', 'error'); phone.focus(); return; }
      DB.user.phone = phone.value;
      save();
      $('#otpBlock').hidden = false;
      $('#sendOtpBtn').hidden = true;
      startOtpTimer();
      const first = $('.otp-digit');
      if (first) first.focus();
      toast('Code sent to +91 ' + phone.value);
    });
    buildOtpInputs();
    $('#verifyNext').addEventListener('click', () => {
      const code = $$('.otp-digit').map(i => i.value).join('');
      if (code.length !== 6) { toast('Enter all 6 digits.', 'warn'); return; }
      DB.user.phone = phone.value;
      save();
      toast('Mobile verified.');
      go('scr-onboard-profile');
    });

    /* profile */
    $$('input[name=ctype]').forEach(r => r.addEventListener('change', () => {
      DB.user.type = r.value;
      $('#orgField').hidden = r.value !== 'ngo';
    }));
    $('#profNext').addEventListener('click', () => {
      const name = $('#nameInput').value.trim();
      if (name.length < 3) { $('#nameErr').hidden = false; $('#nameInput').focus(); return; }
      $('#nameErr').hidden = true;
      DB.user.name = name;
      DB.user.org = $('#orgInput').value.trim();
      if (!DB.user.agentId) DB.user.agentId = 'AGT-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      save();
      go('scr-onboard-place');
    });

    /* place */
    $('#placeNext').addEventListener('click', () => {
      const st = $('#baseStateSel').value, di = $('#baseDistrictSel').value,
            ta = $('#baseTalukaSel').value, vi = $('#baseVillageSel').value;
      if (!vi) { toast('Choose a village.', 'warn'); return; }
      DB.user.state = st; DB.user.district = di; DB.user.taluka = ta; DB.user.village = vi;
      DB.user.ward = $('#wardInput').value.trim() || '1';
      DB.user.pin = $('#pinInput').value.trim();
      save();
      go('scr-onboard-consent');
    });
    $('#gpsCheckBtn').addEventListener('click', () => {
      const pill = $('#gpsStatePill');
      if (!navigator.geolocation) { pill.textContent = 'No GPS on this device'; return; }
      pill.textContent = 'Finding position…';
      navigator.geolocation.getCurrentPosition(p => {
        pill.textContent = 'Located ±' + Math.round(p.coords.accuracy) + ' m';
        const r = $('#gpsResult');
        r.hidden = false;
        r.className = 'notice notice--brand';
        r.innerHTML = svgIcon('check-circle') + '<span><span class="notice__title">Position found</span>' +
          p.coords.latitude.toFixed(5) + ', ' + p.coords.longitude.toFixed(5) +
          ' (±' + Math.round(p.coords.accuracy) + ' m). Use this village if it matches where you work.</span>';
      }, err => {
        pill.textContent = 'GPS not available';
        const r = $('#gpsResult');
        r.hidden = false;
        r.className = 'notice notice--warn';
        r.innerHTML = svgIcon('alert') + '<span><span class="notice__title">Could not get a position</span>' +
          (err && err.message ? err.message : 'Try again outside, away from buildings.') + ' You can still set the village by hand.</span>';
      }, { enableHighAccuracy: true, timeout: 12000 });
    });

    /* consent */
    $('#consentCheck').addEventListener('change', e => { $('#guideNext').disabled = !e.target.checked; });
    $('#guideNext').addEventListener('click', () => {
      DB.user.onboarded = true;
      save();
      go('scr-home');
      toast('You are ready. Submit your first photo from ' + DB.user.village + '.');
    });

    /* navigation shortcuts */
    $$('[data-goto]').forEach(b => b.addEventListener('click', () => go(b.dataset.goto)));
    $('#brandHome').addEventListener('click', () => go(DB.user.onboarded ? 'scr-home' : 'scr-onboard-language'));
    $('#avatarBtn').addEventListener('click', () => go('scr-settings'));
    $('#fabBtn').addEventListener('click', () => startSubmission(null));
    $('#doneAgainBtn').addEventListener('click', () => startSubmission(null));
    $('#netChip').addEventListener('click', () => syncNow());
    $('#langPill').addEventListener('click', () => go('scr-onboard-language'));

    /* capture */
    $('#takePhotoBtn').addEventListener('click', () => $('#cameraInput').click());
    $('#galleryBtn').addEventListener('click', () => $('#galleryInput').click());
    $('#cameraInput').addEventListener('change', e => { handlePhoto(e.target.files[0]); e.target.value = ''; });
    $('#galleryInput').addEventListener('change', e => { handlePhoto(e.target.files[0]); e.target.value = ''; });
    $('#zoomIn').addEventListener('click', () => { zoomLevel = Math.min(3, zoomLevel + 0.5); setZoom(); });
    $('#zoomOut').addEventListener('click', () => { zoomLevel = Math.max(1, zoomLevel - 0.5); setZoom(); });
    ['#flagPeople', '#flagPrivate', '#flagSign'].forEach(sel => {
      $(sel).addEventListener('change', e => {
        draft.flags[sel === '#flagPeople' ? 'people' : sel === '#flagPrivate' ? 'private' : 'sign'] = e.target.checked;
      });
    });
    $('#capNext').addEventListener('click', () => { go('scr-location'); });

    /* location */
    $$('input[name=locmode]').forEach(r => r.addEventListener('change', () => {
      draft.locMode = r.value;
      $('#locOtherBox').hidden = r.value !== 'other';
    }));
    $('#locUseGps').addEventListener('click', useDeviceGps);
    $('#locNext').addEventListener('click', () => {
      if (draft.locMode === 'other') {
        draft.otherPlace.state = $('#locStateSel').value;
        draft.otherPlace.district = $('#locDistrictSel').value;
        draft.otherPlace.village = $('#locVillageSel').value;
      }
      renderCategories();
      go('scr-categories');
    });

    /* categories */
    $('#catNext').addEventListener('click', () => { renderDescribe(); go('scr-describe'); });

    /* describe */
    $('#assetName').addEventListener('input', e => { draft.assetName = e.target.value; updateDescCount(); });
    $('#descInput').addEventListener('input', e => { draft.description = e.target.value; updateDescCount(); });
    $('#descMicBtn').addEventListener('click', startDictation);
    $('#descClearBtn').addEventListener('click', () => { draft.description = ''; $('#descInput').value = ''; updateDescCount(); });
    $('#descNext').addEventListener('click', () => { renderReview(); go('scr-review'); });

    /* review */
    $('#submitBtn').addEventListener('click', submitSubmission);
    $('#copyIdBtn').addEventListener('click', () => {
      const id = $('#doneId').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(id).catch(() => {});
      toast('Copied ' + id);
    });

    /* history / earnings / settings */
    $('#upiChangeBtn').addEventListener('click', requestUpiChange);
    $('#setSyncBtn').addEventListener('click', () => syncNow());
    $('#openReviewerBtn').addEventListener('click', requestReviewerAccess);
    $('#railReviewer').addEventListener('click', requestReviewerAccess);
    $('#rvExitBtn').addEventListener('click', () => go('scr-settings'));
    $('#rvSearch').addEventListener('input', () => renderReviewer());
    $('#resetBtn').addEventListener('click', resetAll);
    $('#railReset').addEventListener('click', resetAll);

    /* theme */
    const toggleTheme = () => {
      DB.settings.theme = DB.settings.theme === 'dark' ? 'light' : 'dark';
      save(); applyTheme();
    };
    $('#themeSwitch').addEventListener('change', e => {
      DB.settings.theme = e.target.checked ? 'dark' : 'light';
      save(); applyTheme();
    });
    $('#railTheme').addEventListener('click', toggleTheme);

    /* offline simulation */
    const setOffline = v => {
      DB.settings.simulateOffline = v;
      save();
      $('#offlineSwitch').checked = v;
      updateNetChip();
      if (!v) syncNow(true);
      renderReview();
    };
    $('#offlineSwitch').addEventListener('change', e => setOffline(e.target.checked));
    $('#railOffline').addEventListener('click', () => setOffline(!DB.settings.simulateOffline));

    window.addEventListener('online', () => { updateNetChip(); syncNow(true); toast('Back online. Waiting photos are being sent.'); });
    window.addEventListener('offline', () => { updateNetChip(); toast('No signal. Photos will be saved on this phone.'); });
  }

  function buildOtpInputs() {
    const wrap = $('#otpInputs');
    wrap.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const inp = document.createElement('input');
      inp.className = 'input otp-digit mono';
      inp.type = 'text';
      inp.maxLength = 1;
      inp.inputMode = 'numeric';
      inp.setAttribute('aria-label', 'Digit ' + (i + 1) + ' of 6');
      inp.style.textAlign = 'center';
      inp.style.padding = '0';
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
        if (inp.value && i < 5) wrap.children[i + 1].focus();
        checkOtp();
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && i > 0) wrap.children[i - 1].focus();
      });
      inp.addEventListener('paste', e => {
        const t = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (t.length) {
          e.preventDefault();
          for (let j = 0; j < 6 && j < t.length; j++) wrap.children[j].value = t[j];
          checkOtp();
        }
      });
      wrap.appendChild(inp);
    }
  }

  function checkOtp() {
    const code = $$('.otp-digit').map(i => i.value).join('');
    $('#verifyNext').disabled = code.length !== 6;
    $('#otpHint').textContent = code.length === 6 ? 'Code complete. Tap Verify & continue.' : 'Enter the 6 digits sent by SMS.';
  }

  let otpTimer = null;
  function startOtpTimer() {
    let s = 30;
    const btn = $('#resendBtn');
    btn.disabled = true;
    btn.textContent = 'Resend in ' + s + 's';
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
      s--;
      btn.textContent = 'Resend in ' + s + 's';
      if (s <= 0) {
        clearInterval(otpTimer);
        btn.disabled = false;
        btn.textContent = 'Resend OTP';
      }
    }, 1000);
  }

  function startSubmission(prefill) {
    resetDraft(prefill);
    const ph = $('#capImg');
    if (ph) ph.src = photoFor('shelter', 'empty' + Date.now() % 1000, { w: 520, h: 390, q: 0.75 });
    $('#capMetaCard').hidden = true;
    $('#capNext').disabled = true;
    ['#flagPeople', '#flagPrivate', '#flagSign'].forEach(s => { $(s).checked = false; });
    renderCategories();
    go('scr-capture');
  }

  function resetAll() {
    localStorage.removeItem(STORE_KEY);
    DB = seedStore();
    save();
    applyTheme();
    updateNetChip();
    renderLanguages();
    go(DB.user.onboarded ? 'scr-home' : 'scr-onboard-language');
    toast('Demo data reset.');
  }

  /* ==================================================================
     21. BOOT
     ================================================================== */
  function boot() {
    initStore();
    applyTheme();
    hydrateIcons(document);
    renderLanguages();
    renderGuide();
    renderFaq();
    renderGeoSelects('base', { state: DB.user.state, district: DB.user.district, taluka: DB.user.taluka, village: DB.user.village });
    $('#pinInput').value = DB.user.pin || '';
    $('#wardInput').value = DB.user.ward || '';
    $('#nameInput').value = DB.user.name || '';
    $('#orgInput').value = DB.user.org || '';
    $$('input[name=ctype]').forEach(r => { r.checked = r.value === DB.user.type; });
    $('#orgField').hidden = DB.user.type !== 'ngo';
    $('#phoneInput').value = DB.user.phone || '';

    buildOtpInputs();
    bind();
    descLang = DB.user.lang || 'en-IN';
    updateNetChip();

    /* top bar identity + language */
    const ini = (DB.user.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    $('#avatarBtn').textContent = ini;
    $('#langPillText').textContent = langByCode(DB.user.lang).code.slice(0, 2).toUpperCase();
    const capImg = $('#capImg');
    if (capImg) capImg.src = photoFor('shelter', 'empty', { w: 520, h: 390, q: 0.75 });
    const revImg = $('#revImg');
    if (revImg) revImg.src = photoFor('shelter', 'empty', { w: 520, h: 390, q: 0.75 });

    /* Deep link support: index.html#scr-earnings opens straight to a screen
       (the review desk is excluded — it is behind the staff gate).
       Read the hash BEFORE the first go(), because go() rewrites it. */
    const hash = (location.hash || '').replace('#', '');
    if (DB.user.onboarded) { go('scr-home'); }
    else { go('scr-onboard-language'); }
    if (hash && hash !== 'scr-reviewer' && document.getElementById(hash)) go(hash);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
