import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok, created } from '../utils/ApiResponse.js'
import Reservation from '../models/Reservation.js'
import Medicine from '../models/Medicine.js'
import Inventory from '../models/Inventory.js'
import { ROLES, RESERVATION_STATUS } from '../utils/constants.js'

function code() {
  return `PRX-${Math.floor(1000 + Math.random() * 9000)}`
}

/** POST /api/reservations — patient reserves a medicine at a pharmacy. */
export const createReservation = asyncHandler(async (req, res) => {
  const { medicine, pharmacy, quantity, patientName, patientPhone } = req.body

  const [med, stock] = await Promise.all([
    Medicine.findById(medicine),
    Inventory.findOne({ medicine, pharmacy }),
  ])
  if (!med) throw ApiError.notFound('Medicine not found')
  if (!stock || stock.status === 'out') throw ApiError.badRequest('Medicine is out of stock at this pharmacy')
  if (stock.quantity < quantity) throw ApiError.badRequest('Requested quantity exceeds available stock')

  const reservation = await Reservation.create({
    code: code(),
    medicine,
    pharmacy,
    patient: req.user?._id,
    patientName,
    patientPhone,
    quantity,
    unitPrice: stock.price,
  })
  const populated = await reservation.populate(['medicine', 'pharmacy'])
  return created(res, populated, 'Reservation confirmed')
})

/** GET /api/reservations — scoped by role. */
export const listReservations = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.user.role === ROLES.PHARMACY) {
    filter.pharmacy = req.user.pharmacy?._id || req.user.pharmacy
  } else if (req.user.role === ROLES.PATIENT) {
    filter.patient = req.user._id
  }
  if (req.query.status) filter.status = req.query.status

  const reservations = await Reservation.find(filter)
    .populate(['medicine', 'pharmacy'])
    .sort({ createdAt: -1 })
  return ok(res, reservations, 'Reservations')
})

/** PATCH /api/reservations/:id/status — pharmacy updates fulfilment state. */
export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!Object.values(RESERVATION_STATUS).includes(status)) {
    throw ApiError.badRequest('Invalid reservation status')
  }
  const reservation = await Reservation.findById(req.params.id)
  if (!reservation) throw ApiError.notFound('Reservation not found')

  // Pharmacy users may only manage their own reservations.
  if (req.user.role === ROLES.PHARMACY) {
    const pid = String(req.user.pharmacy?._id || req.user.pharmacy)
    if (String(reservation.pharmacy) !== pid) throw ApiError.forbidden()
  }

  reservation.status = status
  await reservation.save()
  return ok(res, reservation, 'Reservation updated')
})
