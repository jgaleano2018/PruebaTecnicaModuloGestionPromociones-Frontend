export class PromocionCategoria {
  constructor(data = {}) {
    Object.assign(this, { promocionId: 0, categoriaId: 0, promocion: null, categoria: null, ...data })
  }
}
