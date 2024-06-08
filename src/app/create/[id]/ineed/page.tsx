import CreationButtonBar from '@/app/components/CreationButtonBar'
import React from 'react'

const INeedRoute = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <div className='w-3/5 mx-auto'>
                <h2>Here will be what I want to get for my thing</h2>
            </div>

            <form>
                <input type="hidden" name="thingId" value={params.id} />
                <div>

                </div>
                <CreationButtonBar />
            </form>
        </>
    )
}

export default INeedRoute