import React from 'react';

const NewsByIdPage = async ({params} : {params : Promise<{id : string}>}) => {

    const {id} = await params;

    return (
        <div>
            <h1>News Id : {id}</h1>
        </div>
    );
};

export default NewsByIdPage;