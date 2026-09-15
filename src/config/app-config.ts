export const SITE_URL = 'https://www.fmcoldays.dev'

export const htmlLang = 'es-MX'
export const ogLocale = 'es_MX'

export interface MetadataConfig {
  author: string
  siteName: string
  siteUrl: string
  ogType: string
  twitter: string
}

export interface CompanyConfig {
  name: string
  legalName: string
  shortName: string
  phone: string
  phoneE164: string
  email: string
  whatsapp: string
  city: string
  region: string
}

export interface AppConfig {
  metadata: MetadataConfig
  company: CompanyConfig
}

const businessDescription =
  'Diseño y desarrollo de páginas web y landing pages para negocios de todo México. Sitios hechos desde cero, a medida de cada negocio, con trato directo con quien los construye. Base en Tuxtla Gutiérrez, Chiapas, y trabajo a distancia en cualquier estado.'

const areaServed = [
  { '@type': 'Country', name: 'México' },
  { '@type': 'State', name: 'Chiapas' },
  { '@type': 'City', name: 'Tuxtla Gutiérrez' },
]

export function getSeoSchema(title: string, description: string, canonical: string, isHome = false, schemaType?: 'service' | 'software') {
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Erick Web',
    alternateName: 'Erick / Web',
    description: businessDescription,
    inLanguage: htmlLang,
    url: SITE_URL,
    image: `${SITE_URL}/images/og/og-image-home.webp`,
    telephone: '+52-961-116-9037',
    email: 'erickgp51@gmail.com',
    currenciesAccepted: 'MXN',
    paymentAccepted: 'Transferencia bancaria, Efectivo',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tuxtla Gutiérrez',
      addressRegion: 'Chiapas',
      addressCountry: 'MX',
    },
    sameAs: [],
    areaServed,
    knowsLanguage: ['es-MX'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de diseño web',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diseño de landing pages',
            description: 'Una página enfocada en un servicio o campaña, pensada para que el visitante te contacte.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diseño de sitios web para negocios',
            description: 'Sitio de varias páginas para presentar tu negocio, tus servicios y tus formas de contacto.',
          },
        },
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+52-961-116-9037',
      contactType: 'sales',
      areaServed: 'MX',
      availableLanguage: ['Spanish'],
    },
  }

  let serviceSchema = null

  if (schemaType === 'service') {
    serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: title,
      description,
      url: canonical,
      inLanguage: htmlLang,
      serviceType: 'Diseño de páginas web',
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
      },
    }
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Erick Web',
    inLanguage: htmlLang,
    publisher: { '@id': `${SITE_URL}/#business` },
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: htmlLang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#business` },
  }

  let breadcrumbSchema = null

  if (!isHome) {
    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: title, item: canonical },
      ],
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [businessSchema, webSiteSchema, webPageSchema, serviceSchema, breadcrumbSchema].filter(Boolean),
  }
}

export const appConfig: AppConfig = {
  metadata: {
    author: 'Erick Web',
    siteName: 'Erick Web',
    siteUrl: SITE_URL,
    ogType: 'website',
    twitter: '',
  },

  company: {
    name: 'Erick Web',
    legalName: 'Erick Web',
    shortName: 'Erick Web',
    phone: '961 116 9037',
    phoneE164: '+52-961-116-9037',
    email: 'erickgp51@gmail.com',
    whatsapp: '529611169037',
    city: 'Tuxtla Gutiérrez',
    region: 'Chiapas',
  },
} as const
