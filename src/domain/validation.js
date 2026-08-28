export function validatePromotion(form) {
  const errors = {}
  const name = form.nombre?.trim() || ''
  if (!name) errors.nombre = 'El nombre es obligatorio'
  if (name.length > 150) errors.nombre = 'Máximo 150 caracteres'
  if (form.valorDescuento != null && form.valorDescuento !== '' && !/^\d{1,16}(\.\d{1,2})?$/.test(String(form.valorDescuento))) errors.valorDescuento = 'Usa un decimal con máximo 2 decimales'
  if (form.cantidadMinima != null && form.cantidadMinima !== '' && !/^\d+$/.test(String(form.cantidadMinima))) errors.cantidadMinima = 'Debe ser un número entero'
  if (form.cantidadPagada != null && form.cantidadPagada !== '' && !/^\d+$/.test(String(form.cantidadPagada))) errors.cantidadPagada = 'Debe ser un número entero'
  if (typeof form.activa !== 'boolean') errors.activa = 'Selecciona un estado válido'
  if (!form.fechaInicio) errors.fechaInicio = 'Indica una fecha de inicio'
  if (!form.fechaFin) errors.fechaFin = 'Indica una fecha de fin'
  if (form.fechaInicio && form.fechaFin && form.fechaInicio > form.fechaFin) errors.fechaFin = 'Debe ser posterior al inicio'
  return errors
}
