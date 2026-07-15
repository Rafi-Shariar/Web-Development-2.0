import React from "react";

const BlogsLayout = ({
    children,
} : {
    children: React.ReactNode;
}) => {
  return (
    <div>Blogs Layout Is Special Only For Blogs Route Or Nested Routes Inside The Blogs Directory


        {children}
    </div>
  )
}

export default BlogsLayout