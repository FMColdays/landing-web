import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function setupFaqs(reduced: boolean) {
  const items = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-faq-item]'))
  const scene = document.querySelector<HTMLElement>('[data-faq-scene]')
  const events = new AbortController()
  const topics = [
    'Sobre tu inversión.',
    'Trabajemos desde donde estés.',
    'Una base para crecer en Google.',
    'Empecemos con tu idea.',
    'También después del lanzamiento.',
    'Tu web, tus accesos.',
  ]
  const states = items.map(item => ({ item, open: item.open, animation: undefined as gsap.core.Timeline | undefined }))
  let sceneAnimation: gsap.core.Timeline | undefined
  const updateScene = () => {
    if (!scene) return
    const active = states.findIndex(state => state.open)
    const caption = scene.querySelector('[data-faq-caption]')
    if (caption) caption.textContent = topics[active] || 'Pregunta con confianza.'
    sceneAnimation?.kill()
    sceneAnimation = gsap.timeline({ defaults: { duration: reduced ? 0 : 0.3, ease: 'power2.out', overwrite: 'auto' } })
    sceneAnimation
      .to(scene.querySelector('[data-faq-question]'), { opacity: active >= 0 ? 0.5 : 1 }, 0)
      .to(scene.querySelector('[data-faq-dots]'), { opacity: active >= 0 ? 0 : 1 }, 0)
      .to(scene.querySelector('[data-faq-check]'), { opacity: active >= 0 ? 1 : 0, y: active >= 0 || reduced ? 0 : 6 }, 0)
  }
  const setOpen = (index: number, next: boolean) => {
    const state = states[index]!
    const panel = state.item.querySelector<HTMLElement>('[data-faq-panel]')!
    const answer = panel.firstElementChild!
    state.animation?.kill()
    const height = state.item.open ? panel.getBoundingClientRect().height : 0
    state.open = next
    if (reduced) {
      state.item.open = next
      gsap.set([panel, answer], { clearProps: 'height,overflow,transform,opacity' })
      ScrollTrigger.refresh()
      return
    }
    if (next) state.item.open = true
    gsap.set(panel, { height, overflow: 'hidden' })
    state.animation = gsap.timeline({
      defaults: { duration: reduced ? 0 : next ? 0.42 : 0.3, ease: 'power2.inOut', overwrite: 'auto' },
      onComplete: () => {
        if (!state.open) state.item.open = false
        gsap.set(panel, { clearProps: 'height,overflow' })
        gsap.set(answer, { clearProps: 'transform,opacity' })
        ScrollTrigger.refresh()
      },
    })
    state.animation
      .to(panel, { height: next ? panel.scrollHeight : 0 }, 0)
      .fromTo(
        answer,
        { opacity: next && height === 0 ? 0 : 1, y: next && !reduced && height === 0 ? 6 : 0 },
        { opacity: next ? 1 : 0, y: 0 },
        0,
      )
  }
  states.forEach((state, index) => {
    state.item.querySelector('summary')?.addEventListener(
      'click',
      event => {
        event.preventDefault()
        const next = !state.open
        if (next)
          states.forEach((other, i) => {
            if (i !== index && other.open) setOpen(i, false)
          })
        setOpen(index, next)
        updateScene()
      },
      { signal: events.signal },
    )
  })
  updateScene()
  return () => {
    events.abort()
    sceneAnimation?.kill()
    states.forEach(state => {
      state.animation?.kill()
      state.item.open = state.open
      const panel = state.item.querySelector('[data-faq-panel]')!
      gsap.set([panel, panel.firstElementChild], { clearProps: 'height,overflow,transform,opacity' })
    })
    if (scene) {
      gsap.set(scene.querySelectorAll('[data-faq-question], [data-faq-dots], [data-faq-check]'), { clearProps: 'transform,opacity' })
    }
  }
}
