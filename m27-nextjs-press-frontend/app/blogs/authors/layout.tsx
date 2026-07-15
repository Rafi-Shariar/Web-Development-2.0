import React from "react";

const AuthorsLayout = ({
    children,
} : {
    children: React.ReactNode;
}) => {
  return (
    <div>Authors Layout Is Special Only For Blogs Route Or Nested Routes Inside The Authors Directory


        {children}
    </div>
  )
}

export default AuthorsLayout