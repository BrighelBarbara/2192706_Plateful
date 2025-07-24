'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/backButton/BackButton'
import {
  Calendar,
  MapPin,
  MoreVertical,
  User,
  List,
  ChevronRight
} from 'lucide-react'



export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [event, setEvent] = useState<any>(null)
  const [openPopup, setOpenPopup] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  // 🔄 Carica i dati reali dell'evento
useEffect(() => {
  const fetchEvent = async () => {
    const res = await fetch(`http://localhost:4000/api/events/${id}`);
    const data = await res.json();
    setEvent(data);
  };
  fetchEvent();
}, [id]);

  // ⏱️ Countdown per la deadline
  useEffect(() => {
    if (!event?.voting_deadline) return
    const interval = setInterval(() => {
      const deadline = new Date(event.voting_deadline).getTime()
      const now = new Date().getTime()
      const distance = deadline - now

      if (distance <= 0) {
        setCountdown('Voting has ended')
        setIsVotingClosed(true)
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [event?.voting_deadline])

  // ⏳ Mostra caricamento
  if (!event) {
    return <p className="text-center text-gray-500 mt-10">Loading event...</p>
  }

  return (
    <div className="min-h-screen bg-white pb-28 px-6 pt-6 text-black relative">
      <BackButton />

      <div className="flex justify-center items-center mb-2">
        <h1 className="text-3xl text-center font-bold">{event.title}</h1>
      </div>

      {!isVotingClosed && (
        <div className="text-center text-red-600 font-semibold text-sm mb-4">
          Voting ends in: {countdown}
        </div>
      )}

      <div className="flex justify-center items-center mb-4">
        <div className="absolute right-4">
          <button onClick={() => setOpenPopup(prev => !prev)}>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {openPopup && (
            <div className="absolute right-0 mt-2 bg-white border shadow text-sm rounded z-20">
              <button
                onClick={() => {
                  setShowModal(true)
                  setOpenPopup(false)
                }}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Cancel Participation
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Date: <span className="font-medium">{event.event_date}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Time: <span className="font-medium">{event.event_time}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Location: <span className="font-medium">{event.location}</span>
        </p>
      </div>

      {/* Voting/Menu view */}
      {isVotingClosed ? (
        <div className="space-y-3 mb-6">
          <Link
            href={`/event/${id}/menu`}
            className="w-full bg-[#0099ff] text-white py-3 rounded-md font-semibold flex items-center justify-between px-4"
          >
            <span className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Menu
            </span>
            <ChevronRight className="w-5 h-5" />
          </Link>

          <Link href={`/event/${id}/shopping-list`}>
            <button className="w-full bg-gray-200 rounded p-4 font-semibold flex justify-between items-center mt-4">
              🛒 Shopping List
              <span className="text-xl text-[#7C0A02]">&rsaquo;</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
{event.categories?.map((category: any, index: number) => (
  <button
    key={index}
    onClick={() => router.push(`/event/${id}/category/${category.name.toLowerCase()}`)}
    className="w-full bg-gray-200 rounded p-4 font-semibold flex justify-between items-center"
  >
    {category.name}
    <span className="text-xl text-[#7C0A02]">&rsaquo;</span>
  </button>
))}

        </div>
      )}

{/* Participants */}
<div className="mt-6">
  <div className="flex items-center gap-2 mb-2">
    <User className="w-5 h-5 text-gray-600" />
    <h2 className="text-lg font-semibold">Participants</h2>
  </div>
  
  {event.participants && event.participants.length > 0 ? (
    <ul className="space-y-2 mt-2">
      {event.participants.map((participant: any) => (
        <li key={participant.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <span className="font-medium">{participant.first_name} {participant.last_name}</span>
          <span className="text-gray-600">({participant.email})</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 mt-2">No participants yet</p>
  )}
</div>

      {/* Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <p className="text-sm text-gray-800 mb-3">
              Are you sure you want to cancel your participation?
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Optionally, let the organizer know why you’re leaving:
            </p>

            <textarea
              placeholder="Type your reason here..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded p-2 text-sm mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 px-4 py-2 rounded hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Cancellation reason:', cancelReason)
                  alert('Participation canceled.' + (cancelReason ? `\n\nReason: ${cancelReason}` : ''))
                  setShowModal(false)
                  setCancelReason('')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
