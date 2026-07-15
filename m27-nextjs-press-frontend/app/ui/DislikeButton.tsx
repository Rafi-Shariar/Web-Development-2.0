"use client";
const DislikeButton = ({blogSlug} : {blogSlug: string}) => {
  return (
    <button onClick={() => {
      console.log("Dislike Button Clicked for blog: ", blogSlug);
    }}>Dislike {blogSlug}</button>
  )
}

export default DislikeButton