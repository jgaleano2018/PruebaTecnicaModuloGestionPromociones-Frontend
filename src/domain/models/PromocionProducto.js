export class PromocionProducto {
  constructor(data = {}) {
    Object.assign(this, { promocionId: 0, productoId: 0, promocion: null, producto: null, ...data })
  }
}
