'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import BackButton from '@/components/backButton/BackButton'
import { calculateWarnings, Participant } from '@/utils/restrictions'

interface Proposal {
  id: number
  title: string
  description: string
  ingredients: string[]
  image: string
  hasAllergen: boolean
  mostVoted?: boolean
  participants: Participant[]
}

export default function ProposalPage() {
  const { proposalId } = useParams()
  const propId = Array.isArray(proposalId) ? proposalId[0] : proposalId

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [restrictionWarnings, setRestrictionWarnings] = useState<string[]>([])

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/proposals/${propId}`)
        const data = await res.json()
        setProposal(data)

        const warnings = calculateWarnings(data.ingredients, data.participants)
        setRestrictionWarnings(warnings)
      } catch (error) {
        console.error('Failed to fetch proposal:', error)
      }
    }

    if (propId) fetchProposal()
  }, [propId])

  if (!proposal) return <div>Loading...</div>

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black">
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-4">{proposal.title}</h1>

      <div className="mb-4">
        <img
          src={proposal.image}
          alt={proposal.title}
          className="w-full h-25 object-cover rounded-lg image-proposal-pdp"
          onError={(e) => (e.currentTarget.src = '/images/default-image.jpg')}
        />
      </div>

      <div className="space-y-4">
        <p className="text-lg">{proposal.description}</p>

        <p className="text-md font-semibold">Ingredients:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {proposal.ingredients.map((ingr, idx) => (
            <span key={idx} className="bg-gray-200 px-3 py-1 rounded text-md">
              {ingr}
            </span>
          ))}
        </div>

        {restrictionWarnings.length > 0 && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">Food restriction alerts from participants:</p>
            </div>
            {restrictionWarnings.map((msg, idx) => (
              <p key={idx}>⚠️ {msg}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
