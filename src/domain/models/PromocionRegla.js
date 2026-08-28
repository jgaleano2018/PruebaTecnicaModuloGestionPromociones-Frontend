export class PromocionRegla {
  constructor(data = {}) {
    Object.assign(this, { id: 0, promocionId: 0, diasSemana: null, horaInicio: null, horaFin: null, limiteUsosPorTicket: null, promocion: null, ...data })
  }
}
