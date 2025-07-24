'use client'

import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/backButton/BackButton'
import { useCallback } from 'react'

export default function EventMenuPage() {
  const { id } = useParams()
  const router = useRouter()

  const menu = {
    Antipasti: [
      {
        id: 3,
        title: 'Salmon Rolls',
        ingredients: ['Smoked salmon', 'philadelphia', 'zucchini', 'lemon', 'arugula'],
        hasAllergen: true,
        image: '/salmon.jpeg'
      },
    ],
    Primi: [
      {
        id: 2,
        title: 'Rice Salad',
        ingredients: ['Ham', 'Corn', 'Rice'],
        hasAllergen: true,
        image: '/insalata-riso.jpg'
      }

    ],
    Secondi: [
      {
        id: 1,
        title: 'Meatballs',
        ingredients: ['Bread', 'Tomato', 'Basil'],
        hasAllergen: false,
        image: '/meatballs.webp'
      }
    ]
  }



  const handleProposalClick = useCallback(
    (categoryId: string, proposalId: number, e: React.MouseEvent) => {
      e.stopPropagation()
      router.push(`/event/${id}/category/${categoryId}/proposal/${proposalId}`)
    },
    [id, router]
  )

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black relative">
      <BackButton />
      <h1 className="text-4xl font-bold text-center mb-6 text-black">MENU</h1>

      {Object.entries(menu).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>

          {items.map((item, idx) => (
            <div
              key={idx}
              className="border p-4 relative proposal-card mb-3 hover:bg-gray-50 transition"
              style={{ cursor: 'default' }}
            >
              <div className="flex gap-4 mb-2">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded" />
                )}

                <div className="flex-1 flex-image-title-right">
                  {item.hasAllergen && (
                    <div className="alert-logo flex items-center gap-1 mb-1 text-red-600 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="red" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" fill="red"></circle>
                        <line x1="12" x2="12" y1="8" y2="12" stroke="black"></line>
                        <line x1="12" x2="12.01" y1="16" y2="16" stroke="black"></line>
                      </svg>
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{item.title}</h3>

                  {item.ingredients?.length > 0 && (
                    <div className="flex overflow-x-auto space-x-2 scrollbar-hide mt-2 pb-1">
                      {item.ingredients.map((ingr, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 px-3 py-1 rounded text-xs whitespace-nowrap shrink-0"
                        >
                          {ingr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Nuovo pulsante View Details in basso a destra */}
              <div className="mt-4 text-right button-details-container">
                <button
                  onClick={(e) => handleProposalClick(category, item.id, e)}
                  className="button-details text-sm text-black hover:text-black flex items-center gap-1"
                >
                  VIEW DETAILS
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 12H18M18 12L13 7M18 12L13 17"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

        </div>
      ))}
    </div>
  )
}
