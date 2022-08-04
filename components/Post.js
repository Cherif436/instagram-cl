import { BookmarkIcon, ChatIcon, DotsHorizontalIcon, EmojiHappyIcon, HeartIcon, TrashIcon, } from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { db, storage } from "../firebase";

export default function Post({ img, userImg, caption, username, id }) {
  const {data: session} = useSession()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")), (snapshot) => {setComments(snapshot.docs)})
  }, [db, id])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => setLikes(snapshot.docs))
  }, [db])

  useEffect(() => {
    setHasLiked(
      likes.findIndex(like => like.id === session?.user.uid) !== -1
    )
  }, [likes])

  async function likePost(){
    if(hasLiked){
      await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid))
    }else{
      await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
        username: session?.user.username,

      })
    }
    
  }

  async function sendComment(event){
    event.preventDefault()
    const commentToSend = comment
    setComment("")
    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp()
    })
  }

  async function deletePost(){
    if(window.confirm("Are you sure you want to delete this post ?")){
      deleteDoc(doc(db, "posts", id))
      if(session.user.image){
        deleteObject(ref(storage, `posts/${id}/image`))
      }
      router.push("/")     
    }
    
  }

  return (
    <div className="bg-white border rounded-md my-7">
      {/* Post header */}

      <div className="flex items-center p-5">
        <img className="object-cover h-12 p-1 mr-3 border rounded-full" src={userImg} alt={username} />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* Post image */}
      <img className="object-cover w-full" src={img} alt="" />

      {/* Post buttons */}

      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled onClick={likePost} className="text-red-400 btn" />
            ) : (
              <HeartIcon onClick={likePost} className="btn" />
            )}

            
              <TrashIcon onClick={deletePost} className="p-1 w-9 h-9 btn hover:text-red-600 hover:bg-red-100" />
                        
            <ChatIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}
      

      {/* Post comments */}
      <p className="p-5 truncate"><span className="mr-2 font-bold">{username}</span> {caption}</p>

      {comments.length > 0 && (
        <div className="mx-10 overflow-y-scroll max-h-24 scrollbar-none">
          {comments.map((comment) => (
            <div
              key={comment.data().id}
              className="flex items-center mb-2 space-x-2"
            >
              <img
                className="object-cover rounded-full h-7"
                src={comment.data().userImage}
                alt="user-image"
              />
              <p className="font-semibold">{comment.data().username}</p>
              <p className="flex-1 truncate">{comment.data().comment}</p>
              <Moment fromNow>{comment.data().timestamp?.toDate()}</Moment>
            </div>
          ))}
        </div>
      )}

      {/* Post input box */}

      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input value={comment} onChange={(event) => setComment(event.target.value)} className="flex-1 border-none focus:ring-0" type="text" placeholder="Enter your comment..." />
          <button type="submit" onClick={sendComment} disabled={!comment.trim()} className="font-bold text-blue-400 disabled:text-blue-200">Post</button>
        </form>
      )}
    </div>
  )
}
