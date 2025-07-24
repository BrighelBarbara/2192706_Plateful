'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Event = {

  id: number
  title: string
  location: string
  event_date: string
  event_time: string
  creator_name: string
  status: string
  image: string
}

// Dati fittizi per ora
const otherEvents = [
  { id: '2', title: 'Event 1', sharedBy: 'Sara G.', image: '/backgraound.webp' },
  { id: '3', title: 'Graduation', sharedBy: 'Luca M.', image: '/laurea.jpeg' }
]

const draftEvents = [
  { id: 'd1', eventName: 'Team Lunch', date: '2025-07-10' },
  { id: 'd2', eventName: '', date: '' }
]

const pastEvents = [
  { id: 'p1', title: 'Dinner 2024', date: '2024-11-22' },
  { id: 'p2', title: 'New Year Brunch', date: '2025-01-01', image: '/brunch.webp' }
]

function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-semibold text-lg text-left w-full"
      >
        {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        {title}
      </button>
      {open && <div className="mt-2 flex flex-col gap-3">{children}</div>}
    </div>
  )
}

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [deletingFromDrafts, setDeletingFromDrafts] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const [drafts, setDrafts] = useState<
  { id: string; eventName: string; date: string; image?: string }[]
  >(draftEvents)
  //const [yourEventList, setYourEventList] = useState<any[]>([])
  const [yourEventList, setYourEventList] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  //  Caricamento eventi reali dal backend
  useEffect(() => {
    fetch('http://localhost:4000/api/events')
      .then(res => res.json())
      .then(data => {
        setYourEventList(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading events:', err)
        setLoading(false)
      })
  }, [])

  const handleDelete = (id: string) => {
    setDeletingFromDrafts(false)
    setEventToDelete(id)
    setShowModal(true)
  }

  const handleDeleteDraft = (id: string) => {
    setDeletingFromDrafts(true)
    setEventToDelete(id)
    setShowModal(true)
  }

  //!!! da sistemare 
  const confirmDelete = () => {
    setShowModal(false)
    if (eventToDelete) {
      if (deletingFromDrafts) {
        setDrafts(prev => prev.filter(d => d.id !== eventToDelete))
      } else {
        setYourEventList(prev => prev.filter(e => e.id.toString() !== eventToDelete))
      }
    }
  }

  const handleEditDraft = (eventName: string, date: string) => {
    const params = new URLSearchParams()
    if (eventName) params.set('eventName', eventName)
    if (date) params.set('date', date)
    router.push(`/edit-event?${params.toString()}`)
  }

  const handleEditYourEvent = (title: string, date: string) => {
    const params = new URLSearchParams()
    params.set('eventName', title)
    params.set('date', date)
    router.push(`/edit-event?${params.toString()}`)
  }

  return (
    <div className="min-h-screen p-6 bg-white pb-32 text-black relative">
      <h1 className="text-4xl font-bold mb-6">Events</h1>

      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
        >
          ?
        </button>
      </div>

      {/* Your Events */}
      <CollapsibleSection title="Your Events" defaultOpen={true}>
        {yourEventList.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No events yet.</p>
        ) : (
          yourEventList.map(Event => (
            <div
              key={Event.id}
              className="card-event relative rounded overflow-hidden border group"
            >
              {Event.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-[4px] brightness-[.6]"
                  style={{ backgroundImage: `url(${Event.image})` }}
                />
              )}
              <div className="relative z-10 flex justify-between items-start p-4 h-full">
                <Link href={`/event/${Event.id}`} className="flex-1 mr-4">
                  <div>
                    <p className={`font-semibold ${Event.image ? 'text-white' : 'text-black'}`}>
                      {Event.title}
                    </p>
                    <p className={`text-sm ${Event.image ? 'text-white/80' : 'text-gray-600'}`}>
                      {new Date(Event.event_date).toLocaleDateString()} – {Event.location}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-col gap-2 items-start">
                  <button
                    onClick={() => handleEditYourEvent(Event.title, Event.event_date)}
                    className="text-blue-200 text-sm font-medium hover:underline text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(Event.id.toString())}
                    className="text-red-200 text-sm font-medium hover:underline text-left"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </CollapsibleSection>

      {/* Shared With You */}
      <CollapsibleSection title="Shared With You" defaultOpen={true}>
        {otherEvents.map(event => (
          <div
            key={event.id}
            className="card-event relative bg-gray-100/70 border rounded overflow-hidden group"
          >
            {event.image && (
              <div
                className="absolute inset-0 bg-cover blur-[4px] brightness-[.7]"
                style={{ backgroundImage: `url(${event.image})` }}
              />
            )}
            <div className="relative z-10 p-4">
              <Link href={`/event/${event.id}`} className="block">
                <p className={`font-semibold ${event.image ? 'text-white' : 'text-gray-800'}`}>
                  {event.title}
                </p>
              </Link>
              <p className={`text-xs mt-1 ${event.image ? 'text-white/80' : 'text-gray-500'}`}>
                Shared by: <span className="font-medium">{event.sharedBy}</span>
              </p>
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* Drafts */}
      {drafts.length > 0 && (
        <CollapsibleSection title="Drafts">
          {drafts.map(draft => (
            <div
              key={draft.id}
              className="card-event relative bg-gray-200 rounded overflow-hidden group"
            >
              {draft.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-[4px] brightness-[.6]"
                  style={{ backgroundImage: `url(${draft.image})` }}
                />
              )}
              <div className="relative z-10 p-4 flex justify-between items-start">
                <div>
                  <p className={`font-semibold ${draft.image ? 'text-white' : 'text-black'}`}>
                    {draft.eventName || 'Untitled Draft'}
                  </p>
                  <p className={`text-sm ${draft.image ? 'text-white/80' : 'text-gray-600'}`}>
                    {draft.date || 'No date selected'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEditDraft(draft.eventName, draft.date)}
                    className="text-blue-600 text-sm font-medium hover:underline text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="text-red-600 text-sm font-medium hover:underline text-left"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CollapsibleSection>
      )}

      {/* Past Events */}
      <CollapsibleSection title="Past Events">
        {pastEvents.map(event => (
          <div
            key={event.id}
            className="card-event relative bg-gray-100 border rounded overflow-hidden group opacity-50 hover:bg-gray-200 transition"
          >
            {event.image && (
              <div
                className="absolute inset-0 bg-cover bg-center blur-[4px] brightness-[.6]"
                style={{ backgroundImage: `url(${event.image})` }}
              />
            )}
            <div className="relative z-10 p-4">
              <Link href={`/event/${event.id}`} className="block">
                <p className={`font-semibold ${event.image ? 'text-white' : 'text-black'}`}>{event.title}</p>
                <p className={`text-sm ${event.image ? 'text-white/80' : 'text-gray-600'}`}>{event.date}</p>
              </Link>
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* Add Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6">
        <button
          onClick={() => router.push('/new-event')}
          className="w-full bg-[#aa54ab] hover:bg-[#600800] text-white font-semibold py-3 rounded flex items-center justify-center gap-2 shadow"
        >
          + Add new event
        </button>
      </div>

      {/* Confirm Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <p className="text-sm text-gray-800 mb-4">
              Are you sure you want to delete this {deletingFromDrafts ? 'draft' : 'event'}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 px-4 py-2 rounded hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
