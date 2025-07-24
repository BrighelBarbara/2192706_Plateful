'use client'
import BackButton from '@/components/backButton/BackButton' 
export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 pt-10 bg-white text-black pb-24">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-[#7C0A02]">Privacy Policy</h1>
      <p className="text-center text-gray-700">
        We value your privacy. Your data is secure and only used to improve your experience on Plateful.
        <br />
        No personal information is shared without your consent.
      </p>
    </div>
  )
}
