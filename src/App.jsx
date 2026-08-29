import { useEffect, useState } from 'react'
import './styles/product-category-grid.css'
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  Database,
  Edit3,
  LayoutDashboard,
  Menu,
  Package,
  Percent,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  X,
} from 'lucide-react'

import { demoPromotions, demoStates, demoTypes } from './services/api'
import { promocionService as promotionService } from './infrastructure/services'
import { productoService } from './infrastructure/services/productoService'
import { categoriaService } from './infrastructure/services/categoriaService'
import { validatePromotion } from './domain/validation'

const today = new Date().toISOString().slice(0, 10)

const emptyForm = {
  nombre: '',
  descripcion: '',
  tipoDescuentoId: 1,
  valorDescuento: '',
  cantidadMinima: '',
  cantidadPagada: '',
  fechaInicio: `${today}T09:00`,
  fechaFin: `${today}T23:59`,
  activa: false,
  estadoPromocionId: 1,

  // Nuevos campos
  productoIds: [],
  categoriaIds: [],
}

function useObservable(factory, fallback, deps = []) {
  const [value, setValue] = useState(fallback)

  useEffect(() => {
    const subscription = factory().subscribe({
      next: async (response) => {
        if (!response) return

        const data =
          typeof response.json === 'function'
            ? await response.json()
            : response

        if (data) {
          setValue(data)
        }
      },

      error: () => setValue(fallback),
    })

    return () => subscription.unsubscribe()
  }, deps)

  return value
}

function App() {
  const [page, setPage] = useState('promotions')
  const [menuOpen, setMenuOpen] = useState(true)
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')

  const [promotions, setPromotions] = useState(demoPromotions)

  const types = useObservable(
    () => promotionService.types(),
    demoTypes,
    [],
  )

  const states = useObservable(
    () => promotionService.states(),
    demoStates,
    [],
  )

  const notify = (message) => {
    setNotice(message)

    setTimeout(() => {
      setNotice('')
    }, 3500)
  }

  const reload = () => {
    promotionService.list().subscribe({
      next: async (response) => {
        if (response) {
          const data =
            typeof response.json === 'function'
              ? await response.json()
              : response

          if (Array.isArray(data)) {
            setPromotions(data)
          }
        }
      },

      error: () => notify('No fue posible cargar las promociones'),
    })
  }

  useEffect(() => {
    reload()
  }, [])

  /*
   * ============================================================
   * GUARDAR PROMOCIÓN
   * ============================================================
   *
   * Aquí se construye el payload que será enviado al backend.
   *
   * productoIds y categoriaIds SIEMPRE se envían como arrays.
   */
  const save = (form, editing) => {
    const payload = {
      ...form,

      tipoDescuentoId: Number(form.tipoDescuentoId),

      valorDescuento: Number(form.valorDescuento),

      cantidadMinima:
        form.cantidadMinima !== '' &&
        form.cantidadMinima != null
          ? Number(form.cantidadMinima)
          : null,

      cantidadPagada:
        form.cantidadPagada !== '' &&
        form.cantidadPagada != null
          ? Number(form.cantidadPagada)
          : null,

      estadoPromocionId: Number(form.estadoPromocionId),

      /*
       * IMPORTANTE:
       * Se convierten explícitamente a números.
       */
      productoIds: Array.isArray(form.productoIds)
        ? form.productoIds.map(Number)
        : [],

      categoriaIds: Array.isArray(form.categoriaIds)
        ? form.categoriaIds.map(Number)
        : [],
    }

    console.log(
      'Payload enviado a POST /api/v1/promociones:',
      payload,
    )

    const service = editing
      ? promotionService.updateState(editing.id, payload)
      : promotionService.create(payload)

    service.subscribe({
      next: () => {
        if (!editing) {
          setPromotions((items) => [
            ...items,

            {
              ...payload,

              id:
                Math.max(
                  ...items.map((item) => item.id),
                  0,
                ) + 1,

              tipoDescuentoNombre:
                types.find(
                  (type) =>
                    type.id === Number(
                      payload.tipoDescuentoId,
                    ),
                )?.nombre || 'Porcentaje',

              estadoPromocionNombre:
                states.find(
                  (state) =>
                    state.id === Number(
                      payload.estadoPromocionId,
                    ),
                )?.nombre || 'Programada',
            },
          ])
        } else {
          setPromotions((items) =>
            items.map((item) =>
              item.id === editing.id
                ? {
                    ...item,
                    ...payload,
                  }
                : item,
            ),
          )
        }

        setModal(null)

        notify(
          editing
            ? 'Promoción actualizada'
            : 'Promoción creada',
        )
      },

      error: () => {
        notify(
          editing
            ? 'No fue posible actualizar la promoción'
            : 'No fue posible crear la promoción',
        )
      },
    })
  }

  const remove = (promotion) => {
    if (
      !window.confirm(
        `¿Eliminar “${promotion.nombre}”?`,
      )
    ) {
      return
    }

    promotionService.remove(promotion.id).subscribe({
      next: () => {
        setPromotions((items) =>
          items.filter(
            (item) => item.id !== promotion.id,
          ),
        )

        notify('Promoción eliminada')
      },

      error: () =>
        notify(
          'No fue posible eliminar la promoción',
        ),
    })
  }

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          menuOpen ? '' : 'collapsed'
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Tag size={20} />
          </div>

          {menuOpen && (
            <div>
              <strong>Mercado Norte</strong>
              <small>Operaciones</small>
            </div>
          )}
        </div>

        <nav>
          <button
            className={
              page === 'promotions'
                ? 'active'
                : ''
            }
            onClick={() =>
              setPage('promotions')
            }
          >
            <LayoutDashboard size={18} />

            {menuOpen &&
              'Gestión de promociones'}
          </button>

          <button
            className={
              page === 'summary'
                ? 'active'
                : ''
            }
            onClick={() =>
              setPage('summary')
            }
          >
            <BarChart3 size={18} />

            {menuOpen &&
              'Vista de resumen'}
          </button>
        </nav>

        <div className="sidebar-foot">
          {menuOpen && (
            <>
              <span className="status-dot" />
              API conectada
            </>
          )}

          <button
            className="icon-button"
            aria-label="Contraer menú"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            <Menu size={19} />
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              CENTRO DE CONTROL /{' '}
              {page === 'promotions'
                ? 'PROMOCIONES'
                : 'RESUMEN'}
            </span>

            <h1>
              {page === 'promotions'
                ? 'Gestión de promociones'
                : 'Vista de resumen'}
            </h1>
          </div>

          <div className="top-actions">
            <span className="date-chip">
              <CalendarDays size={15} />
              27 ago 2026
            </span>

            <button className="avatar">
              AM
            </button>
          </div>
        </header>

        {page === 'promotions' ? (
          <PromotionPage
            promotions={promotions}
            onAdd={() =>
              setModal({
                type: 'form',
                data: null,
              })
            }
            onEdit={(item) =>
              setModal({
                type: 'form',
                data: item,
              })
            }
            onRemove={remove}
            onReload={reload}
          />
        ) : (
          <SummaryPage
            promotions={promotions}
            notify={notify}
          />
        )}

        {notice && (
          <div className="toast">
            <Check size={17} />
            {notice}
          </div>
        )}
      </main>

      {modal?.type === 'form' && (
        <PromotionModal
          data={modal.data}
          types={types}
          states={states}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  )
}

function PromotionPage({
  promotions,
  onAdd,
  onEdit,
  onRemove,
  onReload,
}) {
  return (
    <section className="page-body">
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            CATÁLOGO COMERCIAL
          </p>

          <h2>
            Promociones activas y programadas
          </h2>

          <p className="muted">
            Administra el calendario de
            beneficios para tus clientes.
          </p>
        </div>

        <div className="heading-actions">
          <button
            className="button secondary"
            onClick={onReload}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>

          <button
            className="button primary"
            onClick={onAdd}
          >
            <Plus size={17} />
            Adicionar
          </button>
        </div>
      </div>

      <div className="metrics">
        <Metric
          icon={<Tag />}
          label="Total promociones"
          value={promotions.length}
          tone="blue"
        />

        <Metric
          icon={<Check />}
          label="Activas"
          value={
            promotions.filter(
              (item) =>
                item.estadoPromocionNombre ===
                'Activa',
            ).length
          }
          tone="green"
        />

        <Metric
          icon={<CalendarDays />}
          label="Programadas"
          value={
            promotions.filter(
              (item) =>
                item.estadoPromocionNombre ===
                'Programada',
            ).length
          }
          tone="orange"
        />
      </div>

      <div className="table-card">
        <div className="table-head">
          <div>
            <h3>
              Listado de promociones
            </h3>

            <span className="muted">
              {promotions.length}{' '}
              registros encontrados
            </span>
          </div>

          <span className="table-label">
            <Database size={14} />
            Datos en tiempo real
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Promoción</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Vigencia</th>
                <th>Estado</th>
                <th className="align-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {promotions.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.nombre}
                    </strong>

                    <small>
                      {item.descripcion ||
                        'Sin descripción'}
                    </small>
                  </td>

                  <td>
                    {item.tipoDescuentoNombre}
                  </td>

                  <td>
                    <strong>
                      {item.tipoDescuentoNombre ===
                      'Porcentaje'
                        ? `${item.valorDescuento}%`
                        : item.valorDescuento}
                    </strong>
                  </td>

                  <td>
                    <span>
                      {formatDate(
                        item.fechaInicio,
                      )}
                    </span>

                    <small>
                      hasta{' '}
                      {formatDate(
                        item.fechaFin,
                      )}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`badge ${item.estadoPromocionNombre.toLowerCase()}`}
                    >
                      {
                        item.estadoPromocionNombre
                      }
                    </span>
                  </td>

                  <td className="align-right">
                    <button
                      className="table-action edit"
                      aria-label={`Editar ${item.nombre}`}
                      onClick={() =>
                        onEdit(item)
                      }
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      className="table-action delete"
                      aria-label={`Eliminar ${item.nombre}`}
                      onClick={() =>
                        onRemove(item)
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon,
  label,
  value,
  tone,
}) {
  return (
    <div className="metric">
      <div
        className={`metric-icon ${tone}`}
      >
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>
          {value
            .toString()
            .padStart(2, '0')}
        </strong>
      </div>
    </div>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat(
    'es-CO',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
    .format(new Date(value))
    .replace('.', '')
}

/* ============================================================= */
/* MODAL DE PROMOCIÓN                                             */
/* ============================================================= */

function PromotionModal({
  data,
  types,
  states,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => {
    if (!data) {
      return {
        ...emptyForm,
        productoIds: [],
        categoriaIds: [],
      }
    }

    return {
      ...data,

      fechaInicio:
        data.fechaInicio
          ?.slice(0, 16) || '',

      fechaFin:
        data.fechaFin
          ?.slice(0, 16) || '',

      productoIds:
        Array.isArray(data.productoIds)
          ? data.productoIds.map(Number)
          : data.productoId
            ? [Number(data.productoId)]
            : [],

      categoriaIds:
        Array.isArray(data.categoriaIds)
          ? data.categoriaIds.map(Number)
          : data.categoriaId
            ? [Number(data.categoriaId)]
            : [],
    }
  })

  const [errors, setErrors] =
    useState({})

  const [products, setProducts] =
    useState([])

  const [categories, setCategories] =
    useState([])

  const [loadingProducts, setLoadingProducts] =
    useState(true)

  const [loadingCategories, setLoadingCategories] =
    useState(true)

  /*
   * ============================================================
   * CARGAR PRODUCTOS
   * ============================================================
   */
  useEffect(() => {
    setLoadingProducts(true)

    productoService.list().subscribe({
      next: async (response) => {
        try {
          const data =
            typeof response?.json ===
            'function'
              ? await response.json()
              : response

          setProducts(
            Array.isArray(data)
              ? data
              : data?.data || [],
          )
        } catch {
          setProducts([])
        } finally {
          setLoadingProducts(false)
        }
      },

      error: () => {
        setProducts([])
        setLoadingProducts(false)
      },
    })
  }, [])

  /*
   * ============================================================
   * CARGAR CATEGORÍAS
   * ============================================================
   */
  useEffect(() => {
    setLoadingCategories(true)

    categoriaService.list().subscribe({
      next: async (response) => {
        try {
          const data =
            typeof response?.json ===
            'function'
              ? await response.json()
              : response

          setCategories(
            Array.isArray(data)
              ? data
              : data?.data || [],
          )
        } catch {
          setCategories([])
        } finally {
          setLoadingCategories(false)
        }
      },

      error: () => {
        setCategories([])
        setLoadingCategories(false)
      },
    })
  }, [])

  /*
   * ============================================================
   * CAMBIO DE CAMPOS
   * ============================================================
   */
  const change = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    /*
     * Limpiar error del campo cuando
     * el usuario empieza a corregirlo.
     */
    setErrors((current) => {
      const next = { ...current }

      delete next[name]

      return next
    })
  }

  /*
   * ============================================================
   * SELECCIONAR PRODUCTO
   * ============================================================
   *
   * Aunque el backend recibe un array,
   * actualmente permitimos seleccionar
   * un producto.
   */
  const selectProduct = (product) => {
    setForm((current) => ({
      ...current,

      productoIds: [Number(product.id)],
    }))

    setErrors((current) => {
      const next = { ...current }

      delete next.productoIds

      return next
    })
  }

  /*
   * ============================================================
   * SELECCIONAR CATEGORÍA
   * ============================================================
   */
  const selectCategory = (category) => {
    setForm((current) => ({
      ...current,

      categoriaIds: [Number(category.id)],
    }))

    setErrors((current) => {
      const next = { ...current }

      delete next.categoriaIds

      return next
    })
  }

  /*
   * ============================================================
   * GUARDAR
   * ============================================================
   */
  const submit = (event) => {
    event.preventDefault()

    /*
     * Validación completa:
     *
     * - campos normales
     * - producto obligatorio
     * - categoría obligatoria
     */
    const next = validatePromotion({
      ...form,

      productoIds:
        Array.isArray(form.productoIds)
          ? form.productoIds
          : [],

      categoriaIds:
        Array.isArray(form.categoriaIds)
          ? form.categoriaIds
          : [],
    })

    setErrors(next)

    /*
     * Si existe cualquier error,
     * NO se llama al backend.
     */
    if (Object.keys(next).length > 0) {
      return
    }

    /*
     * El payload que recibe App.save()
     * contiene los dos arrays.
     */
    onSave(
      {
        ...form,

        productoIds:
          form.productoIds.map(Number),

        categoriaIds:
          form.categoriaIds.map(Number),
      },
      data,
    )
  }

  return (
    <div className="modal-backdrop">
      <div className="modal modal-large">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              MÓDULO GESTIÓN DE PROMOCIONES
            </span>

            <h2>
              {data
                ? 'Editar promoción'
                : 'Adicionar promoción'}
            </h2>
          </div>

          <button
            className="icon-button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>

          {/* ================================================== */}
          {/* PRODUCTOS                                          */}
          {/* ================================================== */}

          <div className="selection-section">
            <div className="selection-header">
              <div>
                <p className="section-kicker">
                  PRODUCTOS
                </p>

                <h3>
                  Selecciona un producto
                </h3>

                <p className="muted">
                  Debes seleccionar un producto
                  para asociarlo a la promoción.
                </p>
              </div>

              <span className="selection-indicator">
                <Check size={14} />

                {form.productoIds.length
                  ? 'Producto seleccionado'
                  : 'Producto requerido'}
              </span>
            </div>

            <div className="selection-grid">
              {loadingProducts ? (
                <div className="selection-empty">
                  <RefreshCw size={20} />

                  <strong>
                    Cargando productos...
                  </strong>
                </div>
              ) : products.length ? (
                products.map((product) => {
                  const selected =
                    form.productoIds.includes(
                      Number(product.id),
                    )

                  return (
                    <button
                      type="button"
                      key={product.id}
                      className={`selection-card ${
                        selected
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        selectProduct(
                          product,
                        )
                      }
                    >
                      <div className="selection-card-top">
                        <div className="selection-product-icon">
                          <Package
                            size={17}
                          />
                        </div>

                        <strong>
                          {product.nombre}
                        </strong>

                        {selected && (
                          <span className="selection-check">
                            <Check
                              size={14}
                            />
                          </span>
                        )}
                      </div>

                      <div className="selection-card-info">
                        {product.codigoBarras && (
                          <span>
                            Código:{' '}
                            {
                              product.codigoBarras
                            }
                          </span>
                        )}

                        <span>
                          Stock:{' '}
                          {
                            product.stockActual
                          }
                        </span>

                        <span>
                          ${' '}
                          {
                            product.precioVenta
                          }
                        </span>
                      </div>

                      <small>
                        {product.descripcion ||
                          'Sin descripción'}
                      </small>
                    </button>
                  )
                })
              ) : (
                <div className="selection-empty">
                  <Package size={24} />

                  <strong>
                    No hay productos
                    disponibles
                  </strong>

                  <span>
                    No se encontraron
                    productos para
                    seleccionar.
                  </span>
                </div>
              )}
            </div>

            {errors.productoIds && (
              <div className="selection-error">
                {errors.productoIds}
              </div>
            )}
          </div>

          <div className="form-divider" />

          {/* ================================================== */}
          {/* CATEGORÍAS                                         */}
          {/* ================================================== */}

          <div className="selection-section">
            <div className="selection-header">
              <div>
                <p className="section-kicker">
                  CATEGORÍAS
                </p>

                <h3>
                  Selecciona una categoría
                </h3>

                <p className="muted">
                  Debes seleccionar una
                  categoría para asociarla a la
                  promoción.
                </p>
              </div>

              <span className="selection-indicator">
                <Check size={14} />

                {form.categoriaIds.length
                  ? 'Categoría seleccionada'
                  : 'Categoría requerida'}
              </span>
            </div>

            <div className="selection-grid category-grid">
              {loadingCategories ? (
                <div className="selection-empty">
                  <RefreshCw size={20} />

                  <strong>
                    Cargando categorías...
                  </strong>
                </div>
              ) : categories.length ? (
                categories.map((category) => {
                  const selected =
                    form.categoriaIds.includes(
                      Number(category.id),
                    )

                  return (
                    <button
                      type="button"
                      key={category.id}
                      className={`selection-card category-card ${
                        selected
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        selectCategory(
                          category,
                        )
                      }
                    >
                      <div className="selection-card-top">
                        <div className="selection-category-icon">
                          <Tag size={17} />
                        </div>

                        <strong>
                          {category.nombre}
                        </strong>

                        {selected && (
                          <span className="selection-check">
                            <Check
                              size={14}
                            />
                          </span>
                        )}
                      </div>

                      <small>
                        {category.descripcion ||
                          'Categoría de productos'}
                      </small>
                    </button>
                  )
                })
              ) : (
                <div className="selection-empty">
                  <Tag size={24} />

                  <strong>
                    No hay categorías
                    disponibles
                  </strong>

                  <span>
                    No se encontraron
                    categorías para
                    seleccionar.
                  </span>
                </div>
              )}
            </div>

            {errors.categoriaIds && (
              <div className="selection-error">
                {errors.categoriaIds}
              </div>
            )}
          </div>

          <div className="form-divider" />

          {/* ================================================== */}
          {/* DATOS DE PROMOCIÓN                                 */}
          {/* ================================================== */}

          <div className="form-grid">
            <Field
              label="Nombre *"
              name="nombre"
              value={form.nombre}
              onChange={change}
              maxLength={150}
              error={errors.nombre}
            />

            <Field
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={change}
              wide
            />

            <Select
              label="Tipo de descuento"
              name="tipoDescuentoId"
              value={form.tipoDescuentoId}
              options={types}
              onChange={change}
            />

            <Field
              label="Valor descuento"
              name="valorDescuento"
              type="number"
              step="0.01"
              value={form.valorDescuento}
              onChange={change}
              error={errors.valorDescuento}
            />

            <Field
              label="Cantidad mínima"
              name="cantidadMinima"
              type="number"
              step="1"
              value={form.cantidadMinima}
              onChange={change}
              error={errors.cantidadMinima}
            />

            <Field
              label="Cantidad pagada"
              name="cantidadPagada"
              type="number"
              step="1"
              value={form.cantidadPagada}
              onChange={change}
              error={errors.cantidadPagada}
            />

            <Field
              label="Fecha inicio *"
              name="fechaInicio"
              type="datetime-local"
              value={form.fechaInicio}
              onChange={change}
              error={errors.fechaInicio}
            />

            <Field
              label="Fecha fin *"
              name="fechaFin"
              type="datetime-local"
              value={form.fechaFin}
              onChange={change}
              error={errors.fechaFin}
            />

            <Select
              label="Estado de promoción"
              name="estadoPromocionId"
              value={form.estadoPromocionId}
              options={states}
              onChange={change}
            />

            <label className="toggle-field">
              <span>Estado activo</span>

              <input
                type="checkbox"
                name="activa"
                checked={form.activa}
                onChange={change}
              />

              <i />
            </label>
          </div>

          {/* ================================================== */}
          {/* FOOTER                                             */}
          {/* ================================================== */}

          <div className="modal-footer">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="button primary"
            >
              <Check size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  wide,
  ...props
}) {
  return (
    <label
      className={`field ${
        wide ? 'wide' : ''
      }`}
    >
      <span>{label}</span>

      <input
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        {...props}
      />

      {error && <em>{error}</em>}
    </label>
  )
}

function Select({
  label,
  name,
  value,
  options,
  onChange,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <select
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.nombre}
          </option>
        ))}
      </select>
    </label>
  )
}

function SummaryPage({
  promotions,
  notify,
}) {
  const [from, setFrom] =
    useState('2026-08-01')

  const [to, setTo] =
    useState('2026-08-31')

  const counts = {
    programada: promotions.filter(
      (item) =>
        item.estadoPromocionNombre ===
        'Programada',
    ).length,

    activa: promotions.filter(
      (item) =>
        item.estadoPromocionNombre ===
        'Activa',
    ).length,

    finalizada: promotions.filter(
      (item) =>
        item.estadoPromocionNombre ===
        'Finalizada',
    ).length,

    total: promotions.length,
  }

  const current = promotions.filter(
    (item) =>
      item.fechaInicio.slice(0, 10) <=
        to &&
      item.fechaFin.slice(0, 10) >=
        from &&
      item.estadoPromocionNombre !==
        'Finalizada',
  )

  return (
    <section className="page-body">
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            LECTURA EJECUTIVA
          </p>

          <h2>
            Resumen de operación
          </h2>

          <p className="muted">
            Una lectura rápida del estado
            actual de tus promociones.
          </p>
        </div>

        <button
          className="button secondary"
          onClick={() =>
            notify(
              'Sesión cerrada correctamente',
            )
          }
        >
          <ChevronRight size={16} />
          Salir
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-panel">
          <div className="panel-title">
            <div>
              <span className="section-kicker">
                CONTADOR SIMPLE POR ESTADO
              </span>

              <h3>
                Distribución de promociones
              </h3>
            </div>

            <BarChart3 size={20} />
          </div>

          <div className="count-grid">
            <Count
              label="Programadas"
              value={counts.programada}
              tone="orange"
            />

            <Count
              label="Activas"
              value={counts.activa}
              tone="green"
            />

            <Count
              label="Finalizadas"
              value={counts.finalizada}
              tone="gray"
            />

            <Count
              label="Total"
              value={counts.total}
              tone="blue"
            />
          </div>
        </div>

        <div className="summary-panel accent-panel">
          <div className="panel-title">
            <div>
              <span className="section-kicker">
                INDICADOR
              </span>

              <h3>
                Cobertura vigente
              </h3>
            </div>

            <Percent size={20} />
          </div>

          <strong className="big-number">
            {counts.total
              ? Math.round(
                  (counts.activa /
                    counts.total) *
                    100,
                )
              : 0}

            <small>%</small>
          </strong>

          <p className="muted">
            de tus promociones están
            activas hoy
          </p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <div>
            <span className="section-kicker">
              PROMOCIONES VIGENTES
            </span>

            <h3>
              Consulta por rango de fechas
            </h3>
          </div>

          <span className="table-label">
            <Package size={14} />
            {current.length} vigentes
          </span>
        </div>

        <div className="filters">
          <label className="field">
            <span>Fecha inicio</span>

            <input
              type="date"
              value={from}
              onChange={(event) =>
                setFrom(
                  event.target.value,
                )
              }
            />
          </label>

          <label className="field">
            <span>Fecha fin</span>

            <input
              type="date"
              value={to}
              onChange={(event) =>
                setTo(
                  event.target.value,
                )
              }
            />
          </label>

          <button
            className="button primary filter-button"
            onClick={() =>
              notify(
                `Consulta actualizada: ${current.length} promociones`,
              )
            }
          >
            <RefreshCw size={16} />
            Consultar
          </button>
        </div>

        <div className="current-list">
          {current.length ? (
            current.map((item) => (
              <div
                className="current-row"
                key={item.id}
              >
                <div className="current-icon">
                  <Tag size={17} />
                </div>

                <div>
                  <strong>
                    {item.nombre}
                  </strong>

                  <span>
                    {item.descripcion ||
                      'Promoción comercial'}
                  </span>
                </div>

                <span
                  className={`badge ${item.estadoPromocionNombre.toLowerCase()}`}
                >
                  {
                    item.estadoPromocionNombre
                  }
                </span>

                <strong className="current-value">
                  {item.tipoDescuentoNombre ===
                  'Porcentaje'
                    ? `${item.valorDescuento}%`
                    : item.tipoDescuentoNombre}
                </strong>
              </div>
            ))
          ) : (
            <div className="empty">
              No hay promociones vigentes en
              este rango.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Count({
  label,
  value,
  tone,
}) {
  return (
    <div className="count">
      <span
        className={`count-dot ${tone}`}
      />

      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  )
}

export default App