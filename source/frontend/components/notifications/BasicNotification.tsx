'use client'

interface BasicNotificationProps {
  name: string
  title: string
  message: string
  time: string
}

export default function BasicNotification({
  name,
  title,
  message,
  time,
}: BasicNotificationProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="border rounded p-4 mb-4 bg-white relative">
    <span className="absolute top-2 right-4 text-xs text-gray-500">{time}</span>
  
    <div className="flex gap-3">
      <div className="bg-gray-300 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm">
        {initials}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  </div>
  
  )
}
