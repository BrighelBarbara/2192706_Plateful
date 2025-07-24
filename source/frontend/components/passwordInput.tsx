'use client'

import { useState } from 'react'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  name
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative w-full">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full pr-10 text-black transition duration-300"
        required
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition duration-300 hover:scale-110"
        aria-label="Toggle password visibility"
      >
        {show ? (
          // Occhio aperto
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        ) : (
          // Occhio chiuso
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M1 1l22 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.94 17.94A10.5 10.5 0 0112 19.5C7.05 19.5 2.73 16.09 1 12c.65-1.42 1.58-2.72 2.71-3.81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
