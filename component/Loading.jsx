'use client'

import React from 'react'

export function Loading({setLoadingShow, loadingShow}){
    const [position, setPosition] = React.useState({
        top: 0,
        left: 0
    })

    React.useEffect(() => {
        if (!loadingShow) return

        const container = document.querySelector('.loading')

        function handleMove(e){
            setPosition({
                top: e.clientY,
                left: e.clientX
            })
        }


        container.addEventListener('mousemove', handleMove)

        setTimeout(() => {
            setLoadingShow(false)
        }, 6000)

        return () => {
            container.removeEventListener('mousemove', handleMove)
        }
    }, [loadingShow])

    return(
        <>
            {
                loadingShow ?
                    <section className="loading">
                        <div class="loading-window">
                            <div className="headPopUp"></div>
                            <p>Loading...</p>
                            <div className="loading-container">
                                <div className="loading-cube"></div>
                            </div>

                            <div style={{top: `${position.top}px`, left: `${position.left}px`}} className="cursor-waiting"></div>
                        </div>
                    </section>
                    :
                    null
            }
        </>
    )
}