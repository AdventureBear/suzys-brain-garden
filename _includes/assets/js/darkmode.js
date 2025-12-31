function applyThemeColor () {
  // Check session override first, then fall back to system preference
  const sessionOverride = sessionStorage.getItem('darkmode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (sessionOverride === 'true' || (sessionOverride === null && systemPrefersDark)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function activateDarkMode() {
  // Toggle current state and save to session only (not persistent across visits)
  const currentlyDark = document.documentElement.classList.contains('dark')
  sessionStorage.setItem('darkmode', currentlyDark ? 'false' : 'true')
  applyThemeColor()
}

applyThemeColor()
