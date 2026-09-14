import gsap from 'gsap'

export function setupCarousel(reduced: boolean) {
  const wheel = document.querySelector<HTMLElement>('[data-arco]')
  if (!wheel || reduced) return () => {}
  const events = new AbortController()
  const { signal } = events
  const items = Array.from(wheel.querySelectorAll<HTMLElement>('[data-arco-item]'))
  const count = document.querySelector<HTMLElement>('[data-arco-cuenta]')
  const notes = Array.from(document.querySelectorAll<HTMLElement>('[data-project-note]'))
  const total = items.length
  if (!total) return () => {}
  let index = 0
  let origin: number | null = null
  let moved = false
  const entrance = { progress: 0 }
  let entranceTween: gsap.core.Tween | undefined
  const wrap = (value: number) => ((((value + total / 2) % total) + total) % total) - total / 2
  const paint = (offset = 0, animated = true) => {
    const angle = parseFloat(getComputedStyle(wheel).getPropertyValue('--paso')) || 20
    const spacing = parseFloat(getComputedStyle(wheel).getPropertyValue('--separacion')) || 115
    const progress = entrance.progress
    items.forEach((item, i) => {
      const distance = wrap(i - index + offset)
      const focus = gsap.utils.clamp(0, 1, 1 - Math.abs(distance))
      const state = {
        x: distance * spacing * progress,
        y: Math.abs(distance) * 52 * progress + (1 - progress) * 42,
        rotation: distance * angle * progress,
        opacity: gsap.utils.clamp(0, 1, (1.9 - Math.abs(distance)) / 0.8) * (0.72 + 0.28 * focus) * progress,
        scale: 0.9 + 0.1 * focus,
        zIndex: Math.round(100 - Math.abs(distance) * 20),
      }
      if (animated) gsap.to(item, { ...state, duration: 0.65, ease: 'power2.out', overwrite: true })
      else gsap.set(item, state)
      const active = focus > 0.5
      const visible = Math.abs(distance) < 1.9
      item.inert = !visible
      item.toggleAttribute('data-project-active', active)
      item.dataset.projectSide = distance < 0 ? 'left' : 'right'
      const screen = item.querySelector<HTMLElement>('[data-project-screen]')
      const article = item.querySelector<HTMLElement>('[data-project-article]')
      const select = item.querySelector<HTMLButtonElement>('[data-project-select]')
      if (screen) screen.inert = !active
      if (article) {
        if (active) article.removeAttribute('aria-hidden')
        else article.setAttribute('aria-hidden', 'true')
      }
      if (select) select.hidden = active || !visible
    })
  }
  const go = (next: number) => {
    if (entrance.progress < 1) {
      entranceTween?.scrollTrigger?.kill()
      entranceTween?.kill()
      entrance.progress = 1
    }
    index = ((next % total) + total) % total
    if (count) count.textContent = `${index + 1} de ${total}`
    gsap.killTweensOf(notes)
    notes.forEach((note, i) => {
      note.hidden = i !== index
      if (i === index) gsap.fromTo(note, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: true })
    })
    paint()
  }
  wheel.setAttribute('data-carousel-ready', '')
  wheel.setAttribute('tabindex', '0')
  wheel.setAttribute('role', 'region')
  wheel.setAttribute('aria-label', 'Proyectos. Usa las flechas izquierda y derecha para cambiar de sitio.')
  document.querySelector('[data-arco-prev]')?.addEventListener('click', () => go(index - 1), { signal })
  document.querySelector('[data-arco-next]')?.addEventListener('click', () => go(index + 1), { signal })
  items.forEach((item, i) => {
    item.querySelector('[data-project-select]')?.addEventListener('click', () => go(i), { signal })
    const screen = item.querySelector<HTMLElement>('[data-project-screen]')
    screen?.addEventListener(
      'scroll',
      () => {
        if (screen.scrollTop > 8) item.setAttribute('data-project-explored', '')
      },
      { signal, passive: true },
    )
    if (screen && screen.scrollTop > 8) item.setAttribute('data-project-explored', '')
  })
  wheel.addEventListener('dragstart', event => event.preventDefault(), { signal })
  wheel.addEventListener(
    'pointerdown',
    event => {
      if (event.button !== 0) return
      if ((event.target as Element).closest('[data-project-screen], button')) return
      origin = event.clientX
      moved = false
    },
    { signal },
  )
  wheel.addEventListener(
    'pointermove',
    event => {
      if (origin === null) return
      const delta = event.clientX - origin
      if (Math.abs(delta) > 8) {
        moved = true
        wheel.setPointerCapture(event.pointerId)
        gsap.killTweensOf(items)
        paint(gsap.utils.clamp(-1.4, 1.4, delta / 220), false)
      }
    },
    { signal },
  )
  const release = (event: PointerEvent) => {
    if (origin === null) return
    const delta = event.clientX - origin
    origin = null
    if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId)
    if (moved) go(index - Math.round(gsap.utils.clamp(-1.4, 1.4, delta / 220)))
  }
  window.addEventListener('pointerup', release, { signal })
  wheel.addEventListener(
    'pointercancel',
    () => {
      origin = null
      paint()
      moved = false
    },
    { signal },
  )
  wheel.addEventListener(
    'click',
    event => {
      if (moved) {
        event.preventDefault()
        event.stopPropagation()
        moved = false
        return
      }
      const item = (event.target as Element).closest<HTMLElement>('[data-arco-item]')
      if (item && !item.hasAttribute('data-project-active') && !item.inert) go(items.indexOf(item))
    },
    { capture: true, signal },
  )
  wheel.addEventListener(
    'keydown',
    event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        go(index + (event.key === 'ArrowRight' ? 1 : -1))
      }
    },
    { signal },
  )
  window.addEventListener('resize', () => paint(0, false), { signal })
  if (count) count.textContent = `1 de ${total}`
  paint(0, false)
  entranceTween = gsap.to(entrance, {
    progress: 1,
    ease: 'none',
    onUpdate: () => paint(0, false),
    scrollTrigger: {
      id: 'project-table-entrance',
      trigger: wheel,
      start: 'top 90%',
      end: 'top 42%',
      scrub: 0.5,
      once: true,
      invalidateOnRefresh: true,
    },
  })
  return () => {
    events.abort()
    entranceTween?.scrollTrigger?.kill()
    entranceTween?.kill()
    gsap.killTweensOf([...items, ...notes])
    gsap.set(notes, { clearProps: 'transform,opacity' })
    notes.forEach((note, i) => (note.hidden = i !== 0))
    gsap.set(items, { clearProps: 'transform,opacity,zIndex' })
    items.forEach(item => {
      item.inert = false
      item.removeAttribute('data-project-active')
      item.removeAttribute('data-project-explored')
      item.removeAttribute('data-project-side')
      item.querySelector<HTMLElement>('[data-project-screen]')?.removeAttribute('inert')
      item.querySelector('[data-project-article]')?.removeAttribute('aria-hidden')
      const select = item.querySelector<HTMLButtonElement>('[data-project-select]')
      if (select) select.hidden = true
    })
    wheel.removeAttribute('data-carousel-ready')
    wheel.removeAttribute('tabindex')
    wheel.removeAttribute('role')
    wheel.removeAttribute('aria-label')
  }
}
