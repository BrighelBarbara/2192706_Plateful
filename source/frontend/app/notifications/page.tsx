'use client'

import InviteNotification from '@/components/notifications/InviteNotification'
import BasicNotification from '@/components/notifications/BasicNotification'

export default function NotificationsPage() {

  return (
    <div className="min-h-screen px-6 pt-6 pb-24 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {/* Notifica invito */}
      <InviteNotification
        name="Maria Sanchez"
        message='You have been invited to participate in the event "Spring Dinner Party" on May 25, 2025 at 7:00 PM. The event will take place at Green Garden Hall, New York. Would you like to join?'
        time="18:26 PM"
      />

      {/* Notifiche normali */}
      <BasicNotification
        name="Barbara Bianchi"
        title="Notification Title"
        message="Context of the notification."
        time="22:34 PM"
      />
      <BasicNotification
        name="Sara S."
        title="Notification Title"
        message="Context of the notification."
        time="16:16 PM"
      />
      <BasicNotification
        name="John B."
        title="Notification Title"
        message="Context of the notification."
        time="14:52 PM"
      />
    </div>
  )
}
