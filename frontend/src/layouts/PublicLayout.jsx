import { Link, Outlet } from 'react-router-dom'
import Logo from '../components/Logo'
import { Button } from '../components/ui'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
          <Logo />
          <nav className="ml-8 hidden items-center gap-6 md:flex">
            <a href="/#features" className="text-base font-medium text-gray-600 hover:text-gray-900">Platform</a>
            <a href="/#how" className="text-base font-medium text-gray-600 hover:text-gray-900">How it works</a>
            <a href="/#roles" className="text-base font-medium text-gray-600 hover:text-gray-900">For teams</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button as={Link} to="/login" variant="ghost" size="sm">Sign in</Button>
            <Button as={Link} to="/signup" size="sm">Find medicine</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-gray-500">
              AI-powered pharmacy intelligence for smarter early warning and stronger communities.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link to="/signup" className="hover:text-gray-900">Patient portal</Link></li>
              <li><Link to="/login" className="hover:text-gray-900">Pharmacy dashboard</Link></li>
              <li><Link to="/login" className="hover:text-gray-900">Authority console</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>About</li>
              <li>IGAD Husika Hackathon 2026</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Data protection</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 py-4">
          <p className="mx-auto max-w-6xl px-4 text-sm text-gray-500 sm:px-6">
            © 2026 PRISM. Built for the IGAD Husika Hackathon — “Smarter Early Warning, Stronger Communities.”
          </p>
        </div>
      </footer>
    </div>
  )
}
