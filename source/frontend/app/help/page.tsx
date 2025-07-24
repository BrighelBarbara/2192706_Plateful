'use client'
import BackButton from '@/components/backButton/BackButton'
import { AlertCircle, Star } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-start px-6 pt-10 bg-white text-black pb-24">
      <BackButton />

      <h1 className="text-2xl font-bold mb-4 text-[#0099ff] text-center">Help Center</h1>
      <p className="text-center text-gray-700 mb-6">
        Here you can find answers to common questions about using Plateful.
      </p>

<h2 className="text-xl font-bold text-[#0099ff] mb-2">Proposal Icons</h2>

{/* Star Icon Info */}
<div className="icon-legend flex items-start mb-4 gap-4 border p-4 rounded shadow-sm bg-gray-50">
  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 mt-1" />
  <div>
    <h2 className="font-semibold text-black">Most Voted</h2>
    <p className="text-sm text-gray-700">
      This icon appears on the most popular proposal within a category, based on all participant votes.
    </p>
  </div>
</div>

{/* Alert Icon Info */}
<div className="icon-legend flex items-start gap-4 border p-4 rounded shadow-sm bg-gray-50">
  <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
  <div>
    <h2 className="font-semibold text-black">Contains Allergens</h2>
    <p className="text-sm text-gray-700">
      This symbol indicates the dish contains allergens, either declared in the recipe or reported by a participant.
      If you have dietary concerns, avoid selecting or preparing this dish.
    </p>
  </div>
</div>


      <div className="w-full max-w-md mx-auto space-y-6 mt-10">
  <h2 className="text-xl font-bold text-[#0099ff] mb-2">Frequently Asked Questions</h2>

  {/* FAQ 1 */}
 <div className="border p-4 rounded bg-gray-50 shadow-sm">
  <h3 className="font-semibold text-black mb-1">How many dishes can I vote for?</h3>
  <p className="text-sm text-gray-700">
    You can vote for as many dishes as are planned in this category. If you try to vote for more than the allowed number, you'll need to remove one of your previous votes first.
  </p>
</div>


  {/* FAQ 2 */}
  <div className="border p-4 rounded bg-gray-50 shadow-sm">
    <h3 className="font-semibold text-black mb-1">Can I propose a new dish?</h3>
    <p className="text-sm text-gray-700">
      Yes! Use the "Add new proposal" button in each category to submit your idea. You can include a title, description, and ingredients.
    </p>
  </div>

  {/* FAQ 3 */}
  <div className="border p-4 rounded bg-gray-50 shadow-sm">
    <h3 className="font-semibold text-black mb-1">How do I report an allergy?</h3>
    <p className="text-sm text-gray-700">
      Under each dish proposal, there’s a checkbox labeled "Report Allergy". Select it if you know the dish includes allergens that should be flagged.
    </p>
  </div>

  {/* FAQ 4 */}
  <div className="border p-4 rounded bg-gray-50 shadow-sm">
    <h3 className="font-semibold text-black mb-1">What happens after voting ends?</h3>
    <p className="text-sm text-gray-700">
      Once voting is closed, the most voted dishes will be automatically added to the final menu. You’ll be able to view the full menu and access the shopping list.
    </p>
  </div>

  {/* FAQ 5 */}
  <div className="border p-4 rounded bg-gray-50 shadow-sm">
    <h3 className="font-semibold text-black mb-1">How do I know how much of each ingredient to buy?</h3>
    <p className="text-sm text-gray-700">
      The shopping list includes ingredients with editable quantities. Adjust the amount based on how many people you expect and share responsibilities with other participants.
    </p>
  </div>
</div>

    </div>
  )
}
