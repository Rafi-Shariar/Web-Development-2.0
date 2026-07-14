import React from 'react';

const BlogsLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <div>
            <h1>Only for blogs routes</h1>
            <div>
                {children}
            </div>
        </div>
    );
};

export default BlogsLayout;