'use client'

import {
  LogOut,
  Info,
  Lock,
  FileText,
  User2,
  Mail,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Stato immagine profilo
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [dietaryRestrictions, setDietaryRestrictions] = useState([
    'Lactose intolerant',
    'Nut allergy',
    'Shellfish allergy'
  ])


  // Stato modifica informazioni
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('User')
  const [email, setEmail] = useState('testing@gmail.com')
  const [editedUsername, setEditedUsername] = useState(username)
  const [editedEmail, setEditedEmail] = useState(email)

  const handleLogout = () => {
    console.log('User logged out')
    router.push('/login')
  }

  // Eventi utente con data
  const events = [
    {
      name: 'Birthday Party',
      date: '2025-09-01',
      image: '/sample-image.jpg'
    },
    {
      name: 'Event 2',
      date: '2025-10-15',
      image: '/picnic.jpg'
    },
    {
      name: 'Event 3',
      date: '2025-12-20',
      image: ''
    },
    {
      name: 'Event 4',
      date: '2026-01-05',
      image: ''
    }
  ]


  const carouselRef = useRef<HTMLDivElement>(null)
  const [pageIndex, setPageIndex] = useState(0)

  const scrollToPage = (direction: 'prev' | 'next') => {
    const container = carouselRef.current
    if (!container) return

    const cardWidth = container.firstChild
      ? (container.firstChild as HTMLElement).offsetWidth + 16
      : 0

    const maxPage = events.length - 1
    const newIndex =
      direction === 'next'
        ? Math.min(pageIndex + 1, maxPage)
        : Math.max(pageIndex - 1, 0)

    container.scrollTo({ left: newIndex * cardWidth, behavior: 'smooth' })
    setPageIndex(newIndex)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-24 bg-white text-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Hello, <span className="text-[#aa54ab]">{username}</span>
        </h1>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-300 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
            aria-label="Upload profile picture"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User2 className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Informazioni personali */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">Personal Info</h2>
          {!editing && (
            <button
              onClick={() => {
                setEditedUsername(username)
                setEditedEmail(email)
                setEditing(true)
              }}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User2 className="text-[#0088dd]" />
              <input
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#0088dd]" />
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUsername(editedUsername)
                  setEmail(editedEmail)
                  setEditing(false)
                }}
                className="text-sm text-[#aa54ab] font-semibold hover:underline"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User2 className="text-[#0088dd]" />
              <span>{username}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-[#0088dd]" />
              <span>{email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Allergie / restrizioni */}
      {dietaryRestrictions.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Dietary Restrictions</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
            {dietaryRestrictions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Eventi dell’utente */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Your Events</h2>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar gap-4 snap-x scroll-smooth"
        >
          {events.map((event, i) => (
            <div
              key={i}
              className="relative snap-start flex-shrink-0 w-4/5 h-32 rounded overflow-hidden cursor-pointer"
            >
              <Link href={`/event/${i}`} className="block w-full h-full">
                {/* Sfondo dinamico */}
                {event.image ? (
                  <>
                    {/* Immagine sfondo */}
                    <div
                      className="absolute inset-0 bg-center bg-cover brightness-[0.6]"
                      style={{ backgroundImage: `url('${event.image}')` }}
                    />
                    {/* Layer sfocatura + scurimento */}
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-300" />
                )}


                {/* Testo in overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center z-10 text-white">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p className="text-sm mt-1 opacity-90">{event.date}</p>
                </div>
              </Link>
            </div>
          ))}

        </div>

        {/* Pagine + Frecce */}
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="flex gap-2">
            {events.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i === pageIndex ? 'bg-black' : 'bg-gray-400'}`}
              ></span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollToPage('prev')}
              className="bg-white border rounded-full p-1 shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToPage('next')}
              className="bg-white border rounded-full p-1 shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 my-6"></div>

      {/* Link extra */}
      <div className="space-y-4 mb-6">
        <Link href="/help" className="flex items-center gap-3 text-left w-full text-gray-700">
          <Info className="w-5 h-5" />
          Help
        </Link>
        <Link href="/privacy" className="flex items-center gap-3 text-left w-full text-gray-700">
          <Lock className="w-5 h-5" />
          Privacy
        </Link>
        <Link href="/terms" className="flex items-center gap-3 text-left w-full text-gray-700">
          <FileText className="w-5 h-5" />
          Terms of Service
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-[#981919] text-white font-semibold py-3 rounded flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        LOG OUT
      </button>
    </div>
  )
}
