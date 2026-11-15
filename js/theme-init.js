(function () {
  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    var n = parseInt(h, 16);
    return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255);
  }
  function isLight(hex) {
    var h = hex.replace('#', '');
    var r = parseInt(h.slice(0, 2), 16) / 255;
    var g = parseInt(h.slice(2, 4), 16) / 255;
    var b = parseInt(h.slice(4, 6), 16) / 255;
    var lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.75;
  }
  function isPillLight(hex) {
    var h = hex.replace('#', '');
    var r = parseInt(h.slice(0, 2), 16) / 255;
    var g = parseInt(h.slice(2, 4), 16) / 255;
    var b = parseInt(h.slice(4, 6), 16) / 255;
    var lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.5;
  }
  try {
    var themes = [
      { pink: '#f5a6b7', light: '#fed7e2', mid: '#f38da3', dark: '#d9778f', sobremi: '#fa6f8d' },
      { pink: '#fed7e2', light: '#ffe3ec', mid: '#f5a6b7', dark: '#d9778f', sobremi: '#f38da3' },
      { pink: '#edf0e6', light: '#f7f9f2', mid: '#c5dedd', dark: '#a1c2d9', sobremi: '#edf0e6' },
      { pink: '#c5dedd', light: '#edf0e6', mid: '#a1c2d9', dark: '#73a4b6', sobremi: '#c5dedd' },
      { pink: '#73a4b6', light: '#c5dedd', mid: '#355f88', dark: '#203c57', sobremi: '#73a4b6' },
      { pink: '#355f88', light: '#73a4b6', mid: '#2d5275', dark: '#203c57', sobremi: '#355f88' }
    ];
    var i = localStorage.getItem('theme-index');
    if (i === null) return;
    var t = themes[Number(i)];
    if (!t) return;
    var r = document.documentElement.style;
    r.setProperty('--brand-pink', t.pink);
    r.setProperty('--brand-pink-light', t.light);
    r.setProperty('--brand-pink-mid', t.mid);
    r.setProperty('--brand-pink-dark', t.dark);
    r.setProperty('--brand-pink-sobremi', t.sobremi);
    r.setProperty('--brand-pink-rgb', hexToRgb(t.pink));
    r.setProperty('--brand-on-pink', isLight(t.pink) ? '#1a1a1a' : '#ffffff');
    r.setProperty('--brand-pill-text', isPillLight(t.pink) ? '#0f172a' : '#ffffff');
  } catch (e) {}
})();

