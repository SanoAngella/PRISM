/**
 * Consistent success envelope for all endpoints:
 * { success: true, message, data, meta? }
 */
export function ok(res, data = null, message = 'OK', meta = undefined) {
  return res.status(200).json({ success: true, message, data, ...(meta && { meta }) })
}

export function created(res, data = null, message = 'Created') {
  return res.status(201).json({ success: true, message, data })
}

export function noContent(res) {
  return res.status(204).send()
}
