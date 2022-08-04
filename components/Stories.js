import minifaker from 'minifaker';
import "minifaker/locales/en";
import { useState, useEffect } from 'react';
import Story from './Story';
import { useSession } from 'next-auth/react';

export default function Stories() {
  const [storyUsers, setSoryUsers] = useState([]);
  const {data: session} = useSession()

  useEffect(() => {
    const storyUsers = minifaker.array(20, (i) => (
      {
        username: minifaker.username({locale:"en"}).toLowerCase(),
        img: `https://i.pravatar.cc/150?img=${Math.ceil(Math.random() * 70)}`,
        id: i
      }
      
    ))
    setSoryUsers(storyUsers)
    console.log(storyUsers);
  }, [])

  return (
    <div className="flex p-6 mt-8 space-x-2 overflow-x-scroll bg-white border border-gray-200 rounded-sm scrollbar-none">
      {session && (
        <Story img={session.user.image} username={session.user.username} isUser="true" />
      )}
      {storyUsers.map((user) => (
        <Story key={user.id} username={user.username} img={user.img} />
      ))}
    </div>
  )
}