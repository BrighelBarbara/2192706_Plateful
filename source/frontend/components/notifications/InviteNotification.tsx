'use client'

import { useState } from 'react'

interface InviteNotificationProps {
    name: string
    message: string
    time: string
}

export default function InviteNotification({
    name,
    message,
    time,
}: InviteNotificationProps) {
    const [showModal, setShowModal] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [accepted, setAccepted] = useState(false)

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()

    const handleAccept = () => {
        setAccepted(true)
        setShowModal(true)
    }

    const handleReject = () => {
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <>
            <div className="border rounded p-5 mb-4 bg-white relative">
                {/* Orario in alto a destra */}
                <span className="absolute top-1 right-4 text-xs text-gray-500">{time}</span>

                <div className="flex items-start gap-3">
                    <div className="bg-gray-300 text-black font-medium rounded-full w-10 aspect-square flex items-center justify-center text-xs leading-none shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 mt-1">{message}</p>
                    </div>
                </div>

                {!accepted && (
                    <div className="mt-4 flex justify-center gap-4">
                        <button
                            onClick={handleAccept}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-medium text-sm"
                        >
                            Yes
                        </button>
                        <button
                            onClick={handleReject}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded font-medium text-sm"
                        >
                            No
                        </button>
                    </div>
                )}
            </div>

            {/* MODALE */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <h2 className="text-lg font-semibold mb-3">Participation Confirmed!</h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-[#0099ff] text-white px-4 py-1 rounded font-medium text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
