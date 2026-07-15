
const BlogsPage = async () => {

    const posts = await fetch("https://jsonplaceholder.typicode.com/posts");

    const postData = await posts.json();

    console.log(postData);
  return (
    <div>Blogs Page</div>
  )
}

export default BlogsPage