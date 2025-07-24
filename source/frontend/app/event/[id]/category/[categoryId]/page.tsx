'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, AlertCircle, Star } from 'lucide-react'
import './../../../../globals.css'
import BackButton from '@/components/backButton/BackButton'

export default function CategoryPage() {
  const { id, categoryId } = useParams()
  const router = useRouter()

  const maxVotes = 2
  const [votedProposals, setVotedProposals] = useState<number[]>([])
  const [votes, setVotes] = useState<{ [key: number]: number }>({})
  const [allergens, setAllergens] = useState<number[]>([])
  const [showHelp, setShowHelp] = useState(false)

  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/proposals/${id}/categories/${categoryId}/proposals`)
        const data = await res.json()

        if (!Array.isArray(data)) {
          console.error('❌ Risposta non valida:', data)
          setError(true)
          setProposals([])
        } else {
          setProposals(data)
          const initialVotes: { [key: number]: number } = {}
          data.forEach(p => { initialVotes[p.id] = p.votes || 0 })
          setVotes(initialVotes)
        }
      } catch (err) {
        console.error('❌ Errore nel recupero proposte:', err)
        setError(true)
        setProposals([])
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [id, categoryId])

  const handleVoteToggle = (proposalId: number) => {
    if (votedProposals.includes(proposalId)) {
      setVotedProposals(votedProposals.filter(id => id !== proposalId))
      setVotes(prev => ({ ...prev, [proposalId]: prev[proposalId] - 1 }))
    } else if (votedProposals.length < maxVotes) {
      setVotedProposals([...votedProposals, proposalId])
      setVotes(prev => ({ ...prev, [proposalId]: (prev[proposalId] || 0) + 1 }))
    }
  }

  const handleNewProposal = () => {
    router.push(`/event/${id}/category/${categoryId}/new-proposal`)
  }

  const handleAllergyToggle = (proposalId: number) => {
    setAllergens(prev =>
      prev.includes(proposalId)
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    )
  }

  const handleProposalClick = (proposalId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/event/${id}/category/${categoryId}/proposal/${proposalId}`)
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user?.id) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black">
      <BackButton />

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
        >
          ?
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-1 capitalize">{categoryId}</h1>
      <div className="text-center mb-6">
        <p className="text-[#7C0A02] font-medium">
          Votes: {votedProposals.length} / {maxVotes}
        </p>
        {votedProposals.length >= maxVotes && (
          <p className="text-red-600 text-sm font-medium mt-1">
            You’ve reached the maximum number of votes
          </p>
        )}
      </div>

      <div className="space-y-4">
        {loading && <p>Loading proposals...</p>}
        {error && <p className="text-red-600">⚠️ Error loading proposals. Please try again later.</p>}
        {!loading && !error && proposals.length === 0 && (
          <p className="text-gray-500 italic">No proposals found in this category.</p>
        )}

        {Array.isArray(proposals) && proposals.map((proposal) => {
          const isVoted = votedProposals.includes(proposal.id)
          return (
            <div
              key={proposal.id}
              className={`border p-4 relative proposal-card hover:bg-gray-50 transition`}
              style={{ cursor: 'pointer' }}
            >
              <div className='flex items-center alert-svg'>
                {(proposal.hasAllergen || allergens.includes(proposal.id)) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="red" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" fill="red"></circle>
                    <line x1="12" x2="12" y1="8" y2="12" stroke="black"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16" stroke="black"></line>
                  </svg>
                )}
                {proposal.mostVoted && (
                  <span className="text-sm text-red-600 flex items-center gap-1 font-semibold">
                    <Star className="w-6 h-6 fill-yellow-500 text-white" />
                  </span>
                )}
              </div>

              <div className="flex gap-4 mb-2 flex-image-title-proposal">
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                  {proposal.image_url ? (
                    <img
                      src={proposal.image_url}
                      alt={proposal.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-lg mb-2">{proposal.title}</h2>
                  <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
                    {(proposal.ingredients || []).map((ingr: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded text-xs whitespace-nowrap"
                      >
                        {ingr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-3 items-center">
                <p className="text-sm text-gray-500">{votes[proposal.id] || 0} votes</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-red-600 text-sm">
                    Report Allergy
                    <input
                      type="checkbox"
                      checked={allergens.includes(proposal.id)}
                      onChange={() => handleAllergyToggle(proposal.id)}
                    />
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    Vote
                    <input
                      type="checkbox"
                      checked={isVoted}
                      onChange={() => handleVoteToggle(proposal.id)}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={(e) => handleProposalClick(proposal.id, e)}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  VIEW DETAILS →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleNewProposal}
        className="mt-8 w-full bg-[#aa54ab] text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 text-lg"
      >
        <Plus className="w-5 h-5" />
        Add new proposal
      </button>
    </div>
  )
}
