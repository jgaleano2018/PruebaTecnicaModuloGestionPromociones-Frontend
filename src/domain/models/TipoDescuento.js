export class TipoDescuento {
  constructor(data = {}) {
    Object.assign(this, { id: 0, nombre: '', descripcion: null, activo: true, promociones: [], ...data })
  }
}
