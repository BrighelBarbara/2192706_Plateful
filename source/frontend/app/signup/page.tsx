'use client'

import { useState } from 'react'
import PasswordInput from '@/components/passwordInput'
import { useRouter } from 'next/navigation'
export default function SignupPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agreed, setAgreed] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const router = useRouter()
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
    const [customRestriction, setCustomRestriction] = useState('')

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()

        setPasswordError('') // reset any previous error

        if (!agreed) {
            alert('You must agree to the terms to continue.')
            return
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }
      //API di registrazione 
        const restrictions = [...dietaryRestrictions, customRestriction].filter(Boolean)

        fetch('http://localhost:4000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            dietaryRestrictions: restrictions
          })
        })
        .then(res => {
          if (res.ok) {
            router.push('/home')
          } else {
            return res.json().then(data => {
              alert(data.message || 'Registration failed')
            })
          }
        })
        .catch(err => {
          console.error('Error:', err)
          alert('Something went wrong')
        })
        
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
            {/* Logo */}
            <div className="mb-8 text-center">
                <img src="/logo.png" alt="Plateful logo" className="h-20 mx-auto" />
                <h1 className="text-xl -mt-3 font-bold text-[#367ccc]">PLATEFUL</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="w-full mb-2 max-w-sm flex flex-col gap-4">
                <label className="text-sm font-medium text-black">* Username:</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded px-4 py-2"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <label className="text-sm font-medium text-black">* Email:</label>
                <input
                    type="email"
                    className="border border-gray-300 rounded px-4 py-2"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label className="text-sm font-medium text-black">* Password:</label>
                <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder=""
                />

                <label className="text-sm font-medium text-black">* Confirm password:</label>
                <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder=""
                />

                {/* Dietary restrictions */}
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium text-black">
                        Dietary restrictions, allergies, or preferences (optional):
                    </label>

                    {[
                        'Vegetarian',
                        'Vegan',
                        'Gluten-free',
                        'Celiac (no gluten)',
                        'Nut allergy',
                        'Dairy-free',
                        'Shellfish allergy',
                        'Egg-free',
                        'Lactose intollerante'
                    ].map((item) => (
                        <label key={item} className="text-sm flex items-center gap-2 text-black">
                            <input
                                type="checkbox"
                                value={item}
                                checked={dietaryRestrictions.includes(item)}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setDietaryRestrictions(prev =>
                                        prev.includes(value)
                                            ? prev.filter(i => i !== value)
                                            : [...prev, value]
                                    )
                                }}
                            />
                            {item}
                        </label>
                    ))}

                    <input
                        type="text"
                        placeholder="Add custom restriction (e.g. lactose intolerant)"
                        className="border text-black border-gray-300 rounded px-4 py-2 mt-2"
                        value={customRestriction}
                        onChange={(e) => setCustomRestriction(e.target.value)}
                    />

                    <span className="text-xs text-black -mt-1">
                        This helps us warn other users when proposing dishes that may not be suitable.
                    </span>
                </div>

                {/* Terms and conditions */}
                <label className="text-sm flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                        className="mt-1"
                        required
                    />
                    <span className='text-black'>
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 underline">
                            Terms of Use
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 underline">
                            Privacy Policy
                        </a>.
                    </span>
                </label>
                {passwordError && (
                    <p className="text-sm text-red-600 -mt-2">{passwordError}</p>
                )}

                <button
                    type="submit"
                    className="bg-[#aa54ab] mt-6 text-white font-semibold py-2 rounded hover:bg-[#600800] transition"
                >
                    Sign up
                </button>
            </form>
        </div>
    )
}
