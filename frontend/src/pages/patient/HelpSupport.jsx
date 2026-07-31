import { useState } from 'react'
import {
  Search,
  HelpCircle,
  ChevronDown,
  BookOpen,
  PlayCircle,
  FileText,
  Headphones,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
} from 'lucide-react'
import { Button, Card } from '../../components/ui'
import { faqs, portalMeta } from '../../data/portal'

const TOPICS = ['Reservations', 'Medicine Search', 'Orders', 'Account', 'Pharmacy Reports', 'Alerts']
const FACES = [Angry, Frown, Meh, Smile, Laugh]

const GUIDES = [
  { icon: BookOpen, title: 'Getting Started', desc: 'Learn the basics of using PRISM to find and reserve medicines.', action: 'Open Guide' },
  { icon: PlayCircle, title: 'Video Tutorials', desc: 'Watch step-by-step videos on key features.', action: 'Watch' },
  { icon: FileText, title: 'Patient Handbook', desc: 'Complete guide to using PRISM as a patient.', action: 'Download PDF' },
]

export default function HelpSupport() {
  const [open, setOpen] = useState(0)
  const [rating, setRating] = useState(null)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Help &amp; Support</h1>
      <p className="mt-1 text-base text-gray-500">Find answers, contact support, and learn how to use PRISM.</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-md font-semibold text-gray-900"><HelpCircle size={18} className="text-pine-700" /> How can we help?</p>
            <div className="relative mt-3">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search articles, guides or FAQs..." className="h-11 w-full rounded-md border border-gray-300 bg-white pl-11 pr-3 text-base focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button key={t} className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50">{t}</button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3.5">
              <FileText size={17} className="text-pine-700" />
              <h2 className="text-md font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {faqs.map((f, i) => (
                <div key={f.q}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                    <span className="text-sm font-medium text-gray-900">{f.q}</span>
                    <ChevronDown size={17} className={`shrink-0 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                  </button>
                  {open === i && <p className="px-5 pb-4 text-sm text-gray-500">{f.open2 || f.a}</p>}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3.5">
              <BookOpen size={17} className="text-pine-700" />
              <h2 className="text-md font-semibold text-gray-900">User Guides</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              {GUIDES.map((g) => (
                <div key={g.title} className="flex flex-col rounded-lg border border-gray-200 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-pine-50 text-pine-700"><g.icon size={19} /></span>
                  <p className="mt-3 text-sm font-semibold text-gray-900">{g.title}</p>
                  <p className="mt-1 flex-1 text-xs text-gray-500">{g.desc}</p>
                  <Button size="sm" variant="secondary" className="mt-3 w-full">{g.action}</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-md font-semibold text-gray-900"><Smile size={18} className="text-pine-700" /> Was this page helpful?</p>
            <p className="mt-1 text-sm text-gray-500">Rate your experience</p>
            <div className="mt-3 flex items-center gap-3">
              {FACES.map((Face, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    rating === i ? 'bg-pine-100 text-pine-700' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Face size={22} />
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Additional comments (optional)</label>
                <textarea rows={2} placeholder="Tell us how we can improve..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
              </div>
              <Button variant="pine">Send Feedback</Button>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pine-50 text-pine-700"><Headphones size={19} /></span>
              <div>
                <h2 className="text-md font-semibold text-gray-900">Contact Support</h2>
                <p className="text-xs text-gray-500">Need personalized assistance?</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="pine" icon={MessageSquare}>Live Chat</Button>
              <Button variant="secondary" icon={Mail}>Email Support</Button>
            </div>
            <div className="mt-4 space-y-2.5 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Mail size={15} className="text-gray-400" /> support@prism.rw</p>
              <p className="flex items-center gap-2"><Phone size={15} className="text-gray-400" /> +250 788 555 111</p>
              <p className="flex items-center gap-2"><Clock size={15} className="text-gray-400" /> Mon–Fri · 8:00–18:00</p>
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-md font-semibold text-gray-900"><ShieldCheck size={18} className="text-pine-700" /> Platform Status</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-50 px-3 py-2.5 text-sm font-medium text-success-700">
              <CheckCircle2 size={16} /> All Systems Operational
            </div>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Connected Pharmacies</span><span className="font-semibold text-gray-900">{portalMeta.connectedPharmacies}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">API Response</span><span className="font-semibold text-success-600">Normal</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Last Incident</span><span className="font-medium text-gray-700">None in the last 30 days.</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-md font-semibold text-gray-900"><AlertTriangle size={18} className="text-pine-700" /> Report an Issue</p>
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Category</label>
                  <select className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 focus:border-pine-500 focus:ring-2 focus:ring-pine-100">
                    <option>Select a category</option>
                    <option>Reservations</option>
                    <option>Search</option>
                    <option>Account</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Subject</label>
                  <input placeholder="Brief summary of the issue" className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-600">Description</label>
                <textarea rows={3} placeholder="Please provide as much detail as possible..." className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pine-500 focus:ring-2 focus:ring-pine-100" />
              </div>
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                  <Paperclip size={14} /> Choose File
                </button>
                <Button variant="pine">Submit Report</Button>
              </div>
              <p className="text-xs text-gray-400">Attach Screenshot (optional)</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
