'use client'
import BackButton from '@/components/backButton/BackButton' 
export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 pt-10 bg-white text-black pb-24">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-[#7C0A02]">Terms of Service</h1>
      <p className="text-center text-gray-700">
        By using Plateful, you agree to our terms and conditions.
        <br />
        Make sure to review them carefully before participating in any event.
      </p>
    </div>
  )
}
