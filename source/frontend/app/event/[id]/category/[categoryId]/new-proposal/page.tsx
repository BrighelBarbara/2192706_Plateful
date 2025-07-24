'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ImagePlus, Plus, Check } from 'lucide-react'
import BackButton from '@/components/backButton/BackButton'

export default function NewProposalPage() {
  const { id: eventId, categoryId } = useParams<{ id: string; categoryId: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [ingredientWarnings, setIngredientWarnings] = useState<string[]>([])

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user?.id) {
      router.push('/login')
    }
  }, [user, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients(prev => [...prev, newIngredient.trim()])
      setNewIngredient('')
      setIngredientWarnings([]) // reset warning per semplicità
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!user.id) {
    alert("User ID is missing")
    return
  }

  if (!eventId) {
    alert("Event ID is missing")
    return
  }

  if (!categoryId) {
    alert("Category ID is missing")
    return
  }

  if (ingredients.length === 0) {
    alert("At least one ingredient is required")
    return
  }

  if (!title.trim()) {
    alert("Title is required")
    return
  }

  const payload = {
    event_id: parseInt(eventId),
    user_id: parseInt(user.id),
    category_name: categoryId, // usa il nome della categoria
    title: title.trim(),
    description: description.trim(),
    ingredients,
    image_url: image ? `/uploads/${image.name}` : null // fittizio o null se non usi upload
  }

  try {
    const res = await fetch('http://localhost:4000/api/proposals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text()
      try {
        const err = JSON.parse(text)
        alert(err.message || 'Failed to create proposal')
      } catch {
        alert(`Error: ${text}`)
      }
      return
    }

    const data = await res.json()
    console.log('✅ Proposal created:', data)
    setShowConfirmation(true)
  } catch (err) {
    console.error('❌ Error creating proposal:', err)
    alert('Something went wrong')
  }
}


  return (
    <div className="min-h-screen bg-white text-black px-6 pb-24 pt-6">
      <BackButton />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
        >
          ?
        </button>
      </div>

      <h1 className="text-4xl font-semibold text-center mb-6">New proposal</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Proposal Name */}
        <div>
          <label className="text-lg font-semibold mb-2 block">Proposal name</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-400 rounded px-4 py-2 text-black"
            required
          />
        </div>

        {/* Upload Image (non ancora gestita lato backend) */}
        <div className="border-2 border-dashed border-gray-400 rounded-md py-8 flex flex-col items-center justify-center">
          <ImagePlus className="w-12 h-12 text-gray-500 mb-2" />
          <label className="text-sm">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <span className="cursor-pointer underline text-gray-600">Choose photo to Upload</span>
          </label>
          {image && <p className="text-xs mt-2 text-gray-500">{image.name}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-lg font-semibold mb-2 block">Ingredients</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {ingredients.map((ingr, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-300 text-sm px-4 py-1 rounded-full"
              >
                <span>{ingr}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(i)}
                  className="ml-2 text-gray-600 hover:text-red-600"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={e => setNewIngredient(e.target.value)}
              placeholder="Add Ingredient"
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-black"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-[#0099ff] text-white p-2 rounded"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-lg font-semibold mb-2 block">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 text-black resize-none"
          />
        </div>

        {/* Confirm */}
        <button
          type="submit"
          className="bg-[#aa54ab] text-white w-full py-3 rounded text-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#650000]"
        >
          <Check className="w-5 h-5" />
          Confirm
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md px-6 pt-12 text-white flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Proposal submitted!</h2>
            <p>Your proposal has been successfully submitted. You can now return to the event.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => router.push(`/event/${eventId}/category/${categoryId}`)}
                className="bg-[#aa54ab] text-white px-4 py-2 rounded hover:bg-[#650000]"
              >
                Back to Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}