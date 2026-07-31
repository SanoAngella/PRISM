import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async function on mount (and when deps change), tracking
 * loading / error / data state. `fn` should return a promise.
 */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const run = useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.resolve(fn())
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(run, [run])

  return { data, loading, error, setData, reload: run }
}
