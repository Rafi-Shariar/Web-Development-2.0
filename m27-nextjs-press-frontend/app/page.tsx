import Link from "next/link";
import LikeButton from "./ui/LikeButton";

export default function Home() {
  console.log("Root Route");
  return (
    <div>
      Hello NextJS

      Blog Page <Link href={"/blogs/1"} >Blogs</Link>

      <LikeButton />
    </div>
  );
}
