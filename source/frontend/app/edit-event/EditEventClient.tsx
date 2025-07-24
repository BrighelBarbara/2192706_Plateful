'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Calendar, Check } from 'lucide-react'
import BackButton from '@/components/backButton/BackButton'

export default function NewEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventImage, setEventImage] = useState<string | null>(null)
  const [eventName, setEventName] = useState('')
  const [date, setDate] = useState('')
  const [votingDeadline, setVotingDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDraftSavedModal, setShowDraftSavedModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState([
    { name: 'Antipasti', count: 2, selected: false },
    { name: 'Primi', count: 1, selected: true },
    { name: 'Secondi', count: 1, selected: true }
  ])
  const [participants, setParticipants] = useState(['MS', 'SS', 'BB'])
  const [showPopup, setShowPopup] = useState(false)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const mockUsers = [
    { id: 1, name: 'Alice Rossi', email: 'alice@example.com', initials: 'AR' },
    { id: 2, name: 'Marco Bianchi', email: 'marco@example.com', initials: 'MB' },
    { id: 3, name: 'Sara Verdi', email: 'sara@example.com', initials: 'SV' },
    { id: 4, name: 'Luca Neri', email: 'luca@example.com', initials: 'LN' }
  ]

  useEffect(() => {
    if (!searchParams) return

    const nameFromQuery = searchParams.get('eventName')
    const dateFromQuery = searchParams.get('date')

    if (nameFromQuery || dateFromQuery) {
      if (nameFromQuery) setEventName(nameFromQuery)
      if (dateFromQuery) setDate(dateFromQuery)
    } else {
      const savedDraft = localStorage.getItem('eventDraft')
      if (savedDraft) {
        const draft = JSON.parse(savedDraft)
        setEventName(draft.eventName || '')
        setDate(draft.date || '')
        setVotingDeadline(draft.votingDeadline || '')
        setLocation(draft.location || '')
        setTime(draft.time || '')
        setCategories(draft.categories || [])
        setParticipants(draft.participants || [])
      }
    }
  }, [searchParams])

  const handleSaveDraft = () => {
    const draft = {
      eventName,
      date,
      votingDeadline,
      location,
      time,
      categories,
      participants,
      eventImage,
    }

    localStorage.setItem('eventDraft', JSON.stringify(draft))
    setShowDraftSavedModal(true)
  }


  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.find(cat => cat.name === newCategory)) {
      setCategories([...categories, { name: newCategory, count: 1, selected: true }])
      setNewCategory('')
    }
  }

  const handleCountChange = (index: number, amount: number) => {
    const updated = [...categories]
    const cat = updated[index]

    if (!cat.selected) return

    const newCount = cat.count + amount
    if (newCount >= 1) {
      cat.count = newCount
      setCategories(updated)
    }
  }


  const toggleCategory = (index: number) => {
    const updated = [...categories]
    const cat = updated[index]

    cat.selected = !cat.selected
    cat.count = cat.selected ? Math.max(1, cat.count) : 0

    setCategories(updated)
  }


  const handleAddParticipant = () => {
    setShowParticipantModal(true)
  }


  const handleConfirmChanges = () => {
    localStorage.removeItem('eventDraft')
    setShowPopup(true)
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }


  const handleClosePopup = () => {
    setShowPopup(false)
    router.push('/home')
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black relative">
      <BackButton />
      <h1 className="text-3xl text-center font-bold mb-6">Edit Event</h1>

      {/* Event Info */}
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-sm">Event Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            placeholder="e.g., Birthday Dinner"
          />
        </div>
        <div>
          <label className="font-semibold text-sm block mb-1">Event Image</label>
          <label
            htmlFor="event-image"
            className="cursor-pointer text-sm inline-block hover:bg-gray-300"
            style={{
              background: 'lightgray',
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid lightgray'
            }}
          >
            Choose File
          </label>
          <input
            id="event-image"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => setEventImage(reader.result as string)
                reader.readAsDataURL(file)
              }
            }}
            className="hidden"
          />
          {eventImage && (
            <img
              src={eventImage}
              alt="Event preview"
              className="mt-2 w-full h-32 object-cover rounded border"
            />
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-semibold text-sm">Date</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <label className="font-semibold text-sm">Voting deadline</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                value={votingDeadline}
                onChange={e => setVotingDeadline(e.target.value)}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="font-semibold text-sm">Location</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g., Rome, Italy"
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
                  onChange={() => toggleCategory(i)}
                />
                {cat.name}
              </label>
              <div className="flex items-center border rounded overflow-hidden">
                <button
                  type="button"
                  disabled={!cat.selected}
                  onClick={() => handleCountChange(i, -1)}
                  className={`px-2 ${cat.selected ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 cursor-not-allowed'}`}
                >
                  −
                </button>
                <span className="px-4">{cat.count}</span>
                <button
                  type="button"
                  disabled={!cat.selected}
                  onClick={() => handleCountChange(i, 1)}
                  className={`px-2 ${cat.selected ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 cursor-not-allowed'}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Add Category"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="bg-gray-300 rounded-full p-2 hover:bg-gray-400"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="mt-8">
        <label className="font-semibold text-sm block mb-2">Participants</label>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddParticipant}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-black"
          >
            <Plus className="w-4 h-4" />
          </button>
          {participants.map((p, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-medium"
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <button
          className="w-full bg-[#0099ff] hover:bg-[#600800] text-white font-semibold py-3 rounded flex items-center justify-center gap-2"
          onClick={handleConfirmChanges}
        >
          <Check className="w-5 h-5" />
          Confirm Changes
        </button>

        <button
          className="w-full text-red-600 font-semibold py-3 rounded hover:bg-red-50"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {/* Event Updated Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Event Updated!</h2>
            <p className="text-sm text-gray-800 mb-4">
              Your changes have been saved. You can now return to the home page.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleClosePopup}
                className="bg-[#DB9A18] text-white px-4 py-2 rounded hover:bg-[#600800]"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {showDraftSavedModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-black">
            <h2 className="text-lg font-semibold mb-4">Draft Saved!</h2>
            <p className="text-sm text-gray-700 mb-6">
              Your event draft has been saved in your browser. You can return later to finish editing.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDraftSavedModal(false)
                  router.push('/home')
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-black shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-sm text-gray-700 mb-6">
              If you cancel now, all unsaved changes will be lost. Do you really want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                No, go back
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('eventDraft')
                  router.push('/home')
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Participant Modal */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Add Participant</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockUsers
                .filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(user => (
                  <div key={user.id} className="flex justify-between items-center border rounded px-3 py-2">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (!participants.includes(user.initials)) {
                          setParticipants(prev => [...prev, user.initials])
                        }
                        setShowParticipantModal(false)
                        setSearchTerm('')
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Add
                    </button>
                  </div>
                ))}
              {searchTerm &&
                mockUsers.filter(user =>
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <p className="text-sm text-gray-500">No users found.</p>
                )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setShowParticipantModal(false)
                  setSearchTerm('')
                }}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
