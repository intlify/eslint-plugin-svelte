if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef
  window.process = {
    cwd() {
      return ''
    },
    env: {}
  }
  // eslint-disable-next-line no-undef
  window.global = window
}
