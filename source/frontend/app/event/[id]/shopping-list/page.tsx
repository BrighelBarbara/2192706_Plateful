'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import BackButton from '@/components/backButton/BackButton'  // Importiamo il componente

export default function ShoppingListPage() {
  const { id } = useParams()
  const [ingredients, setIngredients] = useState([
  { id: 1, name: 'Tomatoes', quantity: '2 kg', checked: false },
  { id: 2, name: 'Mozzarella', quantity: '500 g', checked: true },
  { id: 3, name: 'Bread', quantity: '1 loaf', checked: false },
  { id: 4, name: 'Pasta', quantity: '1 kg', checked: false },
  { id: 5, name: 'Onion', quantity: '2 pcs', checked: true },
  { id: 6, name: 'Salt', quantity: '1 pack', checked: false },
  { id: 7, name: 'Water', quantity: '2 bottles', checked: false }
])

  const [newIngredient, setNewIngredient] = useState('')
  const [newQuantity, setNewQuantity] = useState('')

  const handleToggle = (id: number) => {
    setIngredients(prev =>
      prev.map(i =>
        i.id === id ? { ...i, checked: !i.checked } : i
      )
    )
  }

  const handleDelete = (id: number) => {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

 const handleAdd = () => {
  if (!newIngredient.trim()) return
  const newItem = {
    id: Date.now(),
    name: newIngredient.trim(),
    quantity: newQuantity.trim() || '1 unit', 
    checked: false
  }
    setIngredients(prev => [...prev, newItem])
    setNewIngredient('')
    setNewQuantity('')
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-28 pt-6 relative">
      {/* Aggiungiamo il BackButton */}
      <BackButton />

      <h1 className="text-2xl text-center font-bold mb-4">Shopping List</h1>

      <ul className="space-y-3">
        {ingredients.map(item => (
<li key={item.id} className="flex sm:flex-row sm:justify-between sm:items-center border-b pb-3">
  <div className="flex items-center gap-3 w-full">
    <input
      type="checkbox"
      checked={item.checked}
      onChange={() => handleToggle(item.id)}
    />
    <span className={`text-lg ${item.checked ? 'line-through text-gray-400' : ''}`}>
      {item.name}
    </span>
  </div>
  <div className="flex items-center gap-2 mt-2 sm:mt-0">
    <input
      type="text"
      value={item.quantity}
      onChange={e => {
        const value = e.target.value
        setIngredients(prev =>
          prev.map(i => i.id === item.id ? { ...i, quantity: value } : i)
        )
      }}
      className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
      placeholder="Qty"
    />
    <button
      onClick={() => handleDelete(item.id)}
      className="text-red-600 hover:text-red-800 font-bold text-xl"
    >
      ×
    </button>
  </div>
</li>

        ))}
      </ul>

      {/* Add Ingredient */}
      <div className="flex mt-8 items-center gap-2">
        <input
          type="text"
          value={newIngredient}
          onChange={e => setNewIngredient(e.target.value)}
          placeholder="Add Ingredient"
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button
          onClick={handleAdd}
          className="bg-[#aa54ab] text-white p-2 rounded hover:bg-[#600800]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
