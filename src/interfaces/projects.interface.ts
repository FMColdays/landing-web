import type { ImageMetadata } from 'astro'

export interface Projects {
  nombre: string
  giro: string
  imagen: ImageMetadata
  alt: string
  categoria: string
  enfoque: string
}
