export class Categoria {
  constructor(data = {}) {
    Object.assign(this, { id: 0, nombre: '', descripcion: null, activo: true, productos: [], promocionCategorias: [], ...data })
  }
}
