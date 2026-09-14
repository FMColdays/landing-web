export interface Inquiry {
  name: string
  business: string
  service: string
  message?: string
}
export function createInquiry(input: Inquiry, phone: string, email: string) {
  const name = input.name.trim().slice(0, 80)
  const business = input.business.trim().slice(0, 120)
  if (name.length < 2 || business.length < 2 || !/^\d{10,15}$/.test(phone) || !email.includes('@')) return null
  const message = `Hola Erick, soy ${name}.\nMi negocio: ${business}.\nMe interesa: ${input.service.trim().slice(0, 100)}.${input.message?.trim() ? `\n\n${input.message.trim().slice(0, 600)}` : ''}\n\n¿Podemos platicar sobre mi página web?`
  return {
    message,
    whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    emailUrl: `mailto:${email}?subject=${encodeURIComponent('Cotización de página web')}&body=${encodeURIComponent(message)}`,
  }
}
