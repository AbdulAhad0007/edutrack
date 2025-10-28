export function getStoredTheme() {
  try {
    return localStorage.getItem('darkMode') === 'true';
  } catch (e) {
    return false; // default light
  }
}

export function setTheme(isDark) {
  try {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  } catch (e) {}
}

export function toggleTheme() {
  try {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('darkMode', isDark ? 'true' : 'false'); } catch (e) {}
    return isDark;
  } catch (e) {
    return null;
  }
}


