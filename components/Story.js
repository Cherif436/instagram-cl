import {PlusIcon} from "@heroicons/react/solid"
export default function Story({img, username, isUser}) {
  return <div className="relative cursor-pointer group">
      <img className="h-14 rounded-full p-[1.5px] border-red-500 border-2 group-hover:scale-110 transition-transform duration-200 ease-out"  src={img} alt={username} />
      {isUser && <PlusIcon className="absolute h-6 text-white top-4 left-4"/>}
      <p className="text-xs truncate w-14">{username}</p>
  </div>;
}