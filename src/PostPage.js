import React from 'react'
import { Link, useParams } from 'react-router-dom'

const PostPage = ({posts,handleDelete}) => {
  const { id } = useParams()
  const post=posts.find(post => (post.id).toString() === id)
  return (
    <main className='PostPage'>
    <article className='Post'>
      {
        post &&
        <>
        <h2>{post.title}</h2>
      <p className='postDate'>{post.datetime}</p>
      <p className='postBody'>{(post.body)}</p>
      <Link to={`/edit/${post.id}`}><button className="editButton">Edit Post</button></Link>
      <button onClick={()=>handleDelete(post.id)}>Delete Post</button>
        </>
      }
      {
        post === undefined &&
        <p>Post not found.</p>
      }
      
      </article>
    </main>
  )
}

export default PostPage