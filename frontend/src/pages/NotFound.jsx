import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Logo />
      <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">404 error</p>
      <h1 className="mt-2 text-3xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-md text-base text-gray-500">
        The page you are looking for doesn’t exist or may have been moved.
      </p>
      <Button as={Link} to="/" className="mt-6">Back to home</Button>
    </div>
  )
}
