export class Producto {
  constructor(data = {}) {
    Object.assign(this, { id: 0, codigoBarras: '', nombre: '', descripcion: null, precioVenta: 0, precioCosto: 0, stockActual: 0, categoriaId: 0, activo: true, categoria: null, promocionProductos: [], detallesVenta: [], ...data })
  }
}
