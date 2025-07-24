'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PasswordInput from '@/components/passwordInput'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [loginError, setLoginError] = useState('')

    const router = useRouter()
    
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    useEffect(() => {
        if (email && !validateEmail(email)) {
            setEmailError('PROVA Invalid email format (e.g. name@example.com)')
        } else {
            setEmailError('')
        }
    }, [email])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoginError('') // Reset error

        if (!validateEmail(email)) {
            setEmailError('Invalid email format (e.g. name@example.com)')
            return
        }

        try {
  const res = await fetch('http://localhost:4000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()

  if (res.ok && data.user) {
    // ✅ SALVA l'utente nel localStorage
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/home')
  } else {
    setLoginError(data.message || 'Login failed')
  }
} catch (err) {
  console.error('Login error:', err)
  setLoginError('Errore durante il login')
}

}



const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`)
    // Implement actual social login logic
}

return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-white">
        <div className="mb-8 text-center">
            <img src="/logo.png" alt="Plateful logo" className="h-20 mx-auto logo-login"/>
            <h1 className="text-xl -mt-3 font-bold text-[#367ccc]">PLATEFUL</h1>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                required
            />
            {emailError && <p className="text-sm text-red-600 -mt-2">{emailError}</p>}

            <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Password*"
            />

            {loginError && <p className="text-sm text-red-600">{loginError}</p>}

            <Link href="/forgot-password" className="text-sm text-blue-600 underline text-left">
                Forgot password?
            </Link>

            <button
                type="submit"
                className="mt-3 bg-[#0099ff] text-white font-semibold py-2 rounded hover:bg-[#600800] transition"
            >
                Continue
            </button>
        </form>

        <div className="my-4 flex flex-col gap-3 w-full max-w-sm">
            <button
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded text-black bg-white hover:bg-gray-100 transition"
            >
                <img src="/google-icon.svg" alt="Google logo" className="h-5" />
                Sign in with Google
            </button>

            <button
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded text-black bg-white hover:bg-gray-100 transition"
            >
                <img src="/facebook-icon.svg" alt="Facebook logo" className="h-5" />
                Sign in with Facebook
            </button>
        </div>

        <p className="text-sm text-center mt-6 text-black">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-600 underline">
                Sign Up
            </Link>
        </p>
    </div>
)
}
