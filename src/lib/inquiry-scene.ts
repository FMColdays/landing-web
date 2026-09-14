import gsap from 'gsap'

export function setupInquiryScene(form: HTMLFormElement) {
  const scene = document.querySelector<HTMLElement>('[data-inquiry-scene]')
  if (!scene) return { prepare: () => {}, dispose: () => {} }
  const find = <T extends Element = HTMLElement>(key: string) => scene.querySelector<T>(`[data-scene-${key}]`)!
  const field = (key: string) => form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  const browser = find('browser')
  const card = find('inquiry')
  const tiles = scene.querySelectorAll('[data-scene-tile]')
  const caption = find('caption')
  const media = gsap.matchMedia()
  let prepared = false
  let prepare = () => {}

  media.add({ reduced: '(prefers-reduced-motion: reduce)', animated: '(prefers-reduced-motion: no-preference)' }, context => {
    const reduced = Boolean(context.conditions?.reduced)
    const events = new AbortController()
    let transition: gsap.core.Timeline | undefined
    let layout: gsap.core.Timeline | undefined
    let previousKind = -1
    let previousCaption = ''
    const duration = reduced ? 0 : 0.45

    const update = context.add('update', () => {
      const name = field('name').value.trim()
      const business = field('business').value.trim()
      const service = field('service') as HTMLSelectElement
      const kind = service.selectedIndex
      const ready = name.length >= 2 && business.length >= 2
      find('business').textContent = business || 'Tu negocio, aquí.'
      find('card-business').textContent = business || 'Tu negocio'
      find('card-name').textContent = name ? `Una idea de ${name}.` : ''
      find('card-service').textContent = service.value
      find('kind').textContent =
        ['Landing page', 'Sitio de servicios', 'Una nueva versión', 'Lo definimos juntos'][kind] || 'Tu próxima web'

      if (kind !== previousKind) {
        previousKind = kind
        layout?.kill()
        const multiple = kind === 1
        const explore = kind === 3
        layout = gsap.timeline({ defaults: { duration, ease: 'power3.out', overwrite: 'auto' } })
        layout
          .to(find('nav'), { opacity: multiple ? 1 : 0 }, 0)
          .to(find('copy'), { y: multiple ? -9 : 0, opacity: explore ? 0.45 : 1 }, 0)
          .to(find('art'), { y: multiple ? -9 : 0, opacity: explore ? 0.45 : 1 }, 0)
          .to(tiles, { y: multiple ? -15 : 0, opacity: multiple ? 1 : 0.5, stagger: reduced ? 0 : 0.055 }, 0)
          .to(find<SVGElement>('art').querySelector('rect'), { attr: { fill: kind === 2 ? '#c8e9e8' : '#e8eec7' } }, 0)
        if (!reduced) layout.fromTo(find('spark'), { rotation: 0 }, { rotation: 90, duration: 0.65 }, 0)
      }

      const nextCaption = prepared
        ? 'Tu siguiente paso: una conversación.'
        : ready
          ? 'Ya tenemos por dónde empezar.'
          : name.length >= 2
            ? `¡Hola, ${name.split(/\s+/)[0]}! Ahora, tu negocio.`
            : 'Cuéntame un poco de tu idea.'
      if (nextCaption !== previousCaption) {
        previousCaption = nextCaption
        caption.textContent = nextCaption
        gsap.fromTo(find('bubble'), { y: reduced ? 0 : 4 }, { y: 0, duration, overwrite: true })
      }
    }) as () => void

    const show = context.add('show', (next: boolean) => {
      transition?.kill()
      prepared = next
      transition = gsap.timeline({ defaults: { duration, ease: 'power3.out', overwrite: 'auto' } })
      transition
        .to(
          browser,
          {
            autoAlpha: next ? 0 : 1,
            rotation: next && !reduced ? -9 : -3,
            y: next && !reduced ? -12 : 0,
            scale: next && !reduced ? 0.96 : 1,
          },
          0,
        )
        .to(card, { autoAlpha: next ? 1 : 0, rotation: next || reduced ? 0 : 5, y: next || reduced ? 0 : 18 }, reduced ? 0 : 0.08)
      update()
    }) as (next: boolean) => void

    form.addEventListener(
      'input',
      () => {
        if (prepared) show(false)
        else update()
      },
      { signal: events.signal },
    )
    form.addEventListener('change', update, { signal: events.signal })
    form.addEventListener('reset', () => queueMicrotask(() => show(false)), { signal: events.signal })
    prepare = () => show(true)
    show(prepared)
    return () => {
      events.abort()
      transition?.kill()
      layout?.kill()
    }
  })

  return { prepare: () => prepare(), dispose: () => media.revert() }
}
