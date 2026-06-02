export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'n0render-smart-box',
    name: 'N0Render Smart Box',
    description: 'Professional 3D rendering solution',
    priceInCents: 12500, // $125.00
  },
]
