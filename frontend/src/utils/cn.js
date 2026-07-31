import clsx from 'clsx'

/**
 * Tiny className combiner. Wraps clsx so components stay tidy.
 * @param  {...any} args
 * @returns {string}
 */
export function cn(...args) {
  return clsx(args)
}
