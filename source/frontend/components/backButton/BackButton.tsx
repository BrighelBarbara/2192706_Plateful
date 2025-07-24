'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

const BackButton = () => {
    const router = useRouter()

    const handleBack = () => {
        router.back()  // Torna alla pagina precedente
    }

    return (
        <button
            onClick={handleBack}
            className="absolute top-6 left-6 text-xl text-gray-700 hover:text-gray-900"
        >
            <ChevronLeft />
        </button>
    )
}

export default BackButton
