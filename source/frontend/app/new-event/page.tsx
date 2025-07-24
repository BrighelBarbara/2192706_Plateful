'use client'

import { useState, useEffect } from 'react'
import {
  CalendarDays,
  Image as ImageIcon,
  UtensilsCrossed,
  Users,
  Save,
  Plus,
  Calendar,
  Check
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/backButton/BackButton'

export default function NewEventPage() {
  const router = useRouter()

  const [eventName, setEventName] = useState('')
  const [eventImage, setEventImage] = useState<string | null>(null)
  const [date, setDate] = useState('')
  const [votingDeadline, setVotingDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showEventCreatedModal, setShowEventCreatedModal] = useState(false)
  const [categories, setCategories] = useState([
    { name: 'Antipasti', count: 1, selected: false },
    { name: 'Primi Piatti', count: 1, selected: false },
    { name: 'Secondi Piatti', count: 1, selected: false },
    { name: 'Dolci', count: 1, selected: false }
  ])
  const [participants, setParticipants] = useState<any[]>([])
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const defaultCategories = [
    { id: 1, name: 'Antipasti' },
    { id: 2, name: 'Primi Piatti' },
    { id: 3, name: 'Secondi Piatti' },
    { id: 4, name: 'Contorni' },
    { id: 5, name: 'Dolci' },
    { id: 6, name: 'Bevande' }
  ]

  const mockUsers = [
    { id: 1, name: 'Alice Rossi', email: 'alice@example.com', initials: 'AR' },
    { id: 2, name: 'Marco Bianchi', email: 'marco@example.com', initials: 'MB' },
    { id: 3, name: 'Sara Verdi', email: 'sara@example.com', initials: 'SV' },
    { id: 4, name: 'Luca Neri', email: 'luca@example.com', initials: 'LN' }
  ]

  const [user, setUser] = useState<any>(null)

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }
}, [])


  const handleCreateEvent = async () => {
    const selectedCategoryIds = categories
      .map(cat => {
        const match = defaultCategories.find(dc => dc.name === cat.name)
        return cat.selected && match ? match.id : null
      })
      .filter(Boolean)

    if (!user || !user.id) {
      alert('Utente non autenticato o ID mancante')
      return
    }

    const participantIds = participants.map(p => p.id)

      const payload = {
    title: eventName,
    description: '',
    event_date: date,
    event_time: time,
    location,
    max_participants: participants.length,
    voting_deadline: votingDeadline,
    created_by: user.id,
    categories: selectedCategoryIds,
    participants: participantIds
  }

  console.log('📦 Payload to send:', payload)

  try {
    const response = await fetch('http://localhost:4000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  })

      if (!response.ok) {
        const data = await response.json()
        alert(data.message || 'Failed to create event')
        return
      }

      setShowEventCreatedModal(true)
    } catch (err) {
      console.error('Error creating event:', err)
      alert('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black relative">
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-6">New Event</h1>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-sm">Event Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-semibold text-sm">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold text-sm">Voting Deadline</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              value={votingDeadline}
              onChange={e => setVotingDeadline(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="font-semibold text-sm">Location</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold text-sm">Time</label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <label className="font-semibold text-sm block mb-2">Categories</label>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={i} className={`flex items-center justify-between px-2 py-1 rounded ${!cat.selected ? 'opacity-50' : ''}`}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cat.selected}
                  onChange={() => {
                    const updated = [...categories]
                    updated[i].selected = !updated[i].selected
                    updated[i].count = updated[i].selected ? Math.max(1, updated[i].count) : 0
                    setCategories(updated)
                  }}
                />
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="mt-8">
        <label className="font-semibold text-sm block mb-2">Participants</label>
        <div className="flex items-center gap-2 flex-wrap">
          {participants.map((p, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-medium">
              {typeof p === 'string' ? p : p.initials}
            </div>
          ))}

          {/* Add participant button */}
          <button
            type="button"
            onClick={() => setShowParticipantModal(true)}
            className="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center hover:bg-gray-400"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <button
          className="w-full bg-[#DB9A18] hover:bg-[#600800] text-white font-semibold py-3 rounded flex items-center justify-center gap-2"
          onClick={handleCreateEvent}
        >
          <Check className="w-5 h-5" />
          Confirm
        </button>
      </div>

      {/* Modale selezione partecipanti */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-black shadow-xl space-y-4">
            <h2 className="text-lg font-semibold mb-2">Select Participants</h2>

            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockUsers
                .filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center border-b py-1"
                  >
                    <span>{user.name}</span>
                    <button
                      className="bg-[#aa54ab] text-white px-3 py-1 rounded text-sm"
                      onClick={() => {
                        if (!participants.some(p => p.id === user.id)) {
                          setParticipants(prev => [...prev, user])
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowParticipantModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event created modal */}
      {showEventCreatedModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-black">
            <h2 className="text-lg font-semibold mb-4">Event Created!</h2>
            <p className="text-sm text-gray-700 mb-6">
              Your event has been successfully created. You can now return to the homepage to view it.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowEventCreatedModal(false)
                  router.push('/home')
                }}
                className="px-4 py-2 rounded bg-[#DB9A18] hover:bg-[#600800] text-white text-sm"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
