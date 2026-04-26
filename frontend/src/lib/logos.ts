/** Logo filename extension mapping */
export const LOGO_EXTENSIONS: Record<string, string> = {
  ENAU: 'jpeg', ENICAR: 'jpg', EPT: 'jpg', ESAC: 'webp',
  ESAM: 'png', ESIAT: 'jpeg', ESSAI: 'png', FSB: 'png',
  FSEGN: 'jpeg', FSJPST: 'jpeg', IHEC: 'jpeg', INAT: 'jpg',
  INRGREF: 'jpeg', INSAT: 'jpeg', INSCE: 'jpeg', INTES: 'png',
  IPEIB: 'jpg', IPEIN: 'jpg', IPEST: 'jpeg', ISBAN: 'png',
  ISEPBG: 'png', ISETH: 'jpeg', ISETUB: 'jpg', ISLN: 'png',
  ISLT: 'webp', ISPAB: 'jpg', ISSATMateur: 'jpeg', ISSTE: 'jpg',
  SUPCOM: 'png', UCAR: 'png',
}

export const LOGO_NAMES = Object.keys(LOGO_EXTENSIONS).filter(k => k !== 'UCAR')

export function getLogoSrc(name: string): string {
  const ext = LOGO_EXTENSIONS[name]
  return `/logos/${name}.${ext || 'png'}`
}
