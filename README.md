# Erick / Web — Landing en Astro y Tailwind

Proyecto de Erick para ofrecer diseño de páginas web en Tuxtla Gutiérrez, Chiapas. Identidad provisional: **Erick / Web**.

## Desarrollo

```sh
pnpm install
pnpm dev
```

## Revisar y generar el sitio

```sh
pnpm check
pnpm build
pnpm check:launch
pnpm preview
```

Astro genera HTML estático en `dist/`. Tailwind CSS se compila con su integración oficial de Vite. Las fuentes son locales; la imagen original se convierte a WebP con tamaños adaptables. No necesita React ni un servidor para atender formularios.

## Dónde editar

- `src/config/site.mjs`: nombre, URL, WhatsApp, correo, ubicación y estado de indexación.
- `src/pages/index.astro`: contenido, servicios, proceso y preguntas.
- `src/styles/global.css`: Tailwind, colores y tipografías.
- `src/components/Contact.astro`: formulario de consulta.
- `src/lib/inquiry.ts`: validación y construcción del mensaje.

## Recepción de prospectos

El formulario valida nombre y negocio, prepara una consulta y muestra enlaces con el mensaje a WhatsApp **+52 961 116 9037** y al correo **erickgp51@gmail.com**. La persona debe enviarlo desde ese canal. La página no afirma que el mensaje ya se envió, no almacena datos y no expone credenciales.

No está integrado Resend. Para recibir directamente en un buzón desde Astro Actions se necesita una implementación con servidor, un adaptador compatible con el alojamiento, `RESEND_API_KEY` exclusivamente en servidor y un remitente con dominio verificado. El alojamiento estático actual no ejecuta Actions. Esa integración debe incluir protección contra spam, límites de envío, validación de servidor y mensajes reales de éxito/error; nunca se debe poner la clave en variables `PUBLIC_*`.

## SEO y siguientes pasos

Incluye título y descripción local, canonical absoluto, Open Graph, datos estructurados de servicio, robots y sitemap. No hay reseñas, clientes, certificaciones ni cifras de resultados inventadas. El ejemplo HábitA es un concepto ilustrativo; la imagen arquitectónica se generó con IA.

1. Al conectar un dominio definitivo, actualizar `site.url` y volver a generar/publicar el sitio.
2. Verificar la propiedad en Google Search Console y enviar `/sitemap-index.xml`. Esto requiere acceso a la cuenta y al dominio; no se ha realizado automáticamente.
3. Crear o completar un Perfil de Empresa de Google si el negocio cumple los requisitos de elegibilidad y tiene contacto presencial con clientes. Usar datos reales, sin inventar una oficina.
4. Añadir proyectos reales cuando existan, describiendo problemas, entregables y resultados comprobables.
5. Registrar origen de consultas, cotizaciones y ventas para evaluar la captación. No confundir clics con prospectos.

La indexación y las posiciones dependen de Google; no existe garantía de aparecer rápido ni primero. Las campañas pagadas se configuran por separado.

## Publicación

La identidad del proyecto de Sites está en `.openai/hosting.json`. El sitio también se puede desplegar como estático en un alojamiento compatible con Astro. Antes de publicar comprobar `pnpm check:launch`. Para una revisión privada cambiar `publicLaunch` a `false`; para un lanzamiento público debe estar en `true` y el alojamiento debe permitir acceso público.

El proyecto usa pnpm 10.6.3, fijado en `packageManager`. Conserva `pnpm-lock.yaml` en el repositorio. En despliegues usa `pnpm install --frozen-lockfile` para reproducir las versiones instaladas.
