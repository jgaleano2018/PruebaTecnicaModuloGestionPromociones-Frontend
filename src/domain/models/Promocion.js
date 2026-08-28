export class Promocion {
  constructor(data = {}) {
    Object.assign(this, { id: 0, nombre: '', descripcion: null, tipoDescuentoId: 0, tipoDescuentoNombre: '', valorDescuento: null, cantidadMinima: null, cantidadPagada: null, fechaInicio: '', fechaFin: '', activa: false, estadoPromocionId: 0, estadoPromocionNombre: '', productoIds: [], categoriaIds: [], productos: [], categorias: [], reglas: [], ...data })
  }
}
