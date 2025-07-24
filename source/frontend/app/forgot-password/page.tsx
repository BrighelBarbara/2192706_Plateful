'use client'

import { useState } from 'react'
import BackButton from '@/components/backButton/BackButton' 

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Simulate email check — replace with real API call
        const registeredEmails = ['user@example.com']

        if (!registeredEmails.includes(email.trim().toLowerCase())) {
            setMessage("No account found with this email.")
            setMessageType('error')
        } else {
            setMessage(
                "We sent you an email to reset your password. If you don't receive it within a few minutes, check your Spam folder."
            )
            setMessageType('success')
            // Trigger API call to send reset email here
            console.log('Reset password requested for', email)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white">
            {/* Logo */}
            <BackButton />
            <div className="mb-6 text-center">
                <img src="/logo.png" alt="Plateful logo" className="h-20 mx-auto" />
                <h1 className="text-xl font-bold text-[#367ccc]">PLATEFUL</h1>
            </div>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
                Forgot Password
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m6-8V7a6 6 0 00-12 0v2m14 0H4v10h16V9z" />
                </svg>
            </h2>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-gray-100 p-4 rounded shadow-md flex flex-col gap-4"
            >
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-black mb-1">Email:</label>
                    <input
                        type="email"
                        className="border border-gray-300 rounded px-4 py-2 text-black bg-white"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-[#367ccc] text-white font-semibold py-2 rounded hover:bg-[#600800] transition"
                >
                    Get new password
                </button>

                {message && (
                    <p className={`text-sm mt-2 ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    )
}
