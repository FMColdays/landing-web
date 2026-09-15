import flotal from '@images/trabajos/flotal.webp'
import fuel from '@images/trabajos/fuel-software-control.webp'
import clave from '@images/trabajos/desarrolladora-clave.webp'
import montajes from '@images/trabajos/montajes.webp'
import type { Projects } from '@/interfaces'

export const PROJECTS: Projects[] = [
  {
    nombre: 'Flotal',
    url: 'https://www.flotal.ai',
    giro: 'Control de llantas y sensores TPMS',
    imagen: flotal,
    alt: 'Diseño del sitio de Flotal, con su portada y secciones de soluciones para flotillas.',
    categoria: 'Tecnología para flotas',
    enfoque: 'Presentar sus soluciones de llantas y sensores con una estructura clara para quienes administran flotillas.',
  },
  {
    nombre: 'Fuel Software Control',
    url: 'https://www.fuelsoftwarecontrol.ai',
    giro: 'Control de combustible para flotas',
    imagen: fuel,
    alt: 'Diseño del sitio de Fuel Software Control, con su portada en tonos violeta y sus soluciones de combustible.',
    categoria: 'Software empresarial',
    enfoque: 'Explicar el control de combustible y sus soluciones con una presentación visual enfocada en empresas y flotillas.',
  },
  {
    nombre: 'Desarrolladora Clave',
    url: 'https://clave.com.mx',
    giro: 'Desarrollo de vivienda e infraestructura en México',
    imagen: clave,
    alt: 'Diseño del sitio de Desarrolladora Clave, con su portada de vivienda, cifras y presentación de la empresa.',
    categoria: 'Desarrollo inmobiliario',
    enfoque: 'Dar espacio a su experiencia, sus proyectos y su trabajo en vivienda e infraestructura.',
  },
  {
    nombre: 'Gasolinera Montajes',
    url: 'https://www.gpomontajes.com',
    giro: 'Estación de servicio en Tuxtla Gutiérrez',
    imagen: montajes,
    alt: 'Diseño del sitio de Gasolinera Montajes, con su portada fotográfica y sus servicios.',
    categoria: 'Sitio de servicios',
    enfoque: 'Presentar la estación, sus servicios y la información que necesita quien busca cargar combustible en Tuxtla.',
  },
]
