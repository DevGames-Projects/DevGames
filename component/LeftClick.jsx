'use client'

import React from "react";

export default function LeftClick({isLeftCLick, setIsLeftClick, mousePosition}){

    React.useEffect(() => {
        function handleClick(e){
            if(e.target.id !== 'left-click' && e.target.className !== 'create-file'){
                setIsLeftClick(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => {
            document.addEventListener('mousedown', handleClick)
        }
    })

    return(
        <>
            {
                isLeftCLick ?
                    <div className="left-click" id='left-click' style={{top: `${mousePosition.top}px`, left: mousePosition.left}}>
                        <button className="create-file">Create new file</button>
                        <button className="create-file">Create new folder</button>
                    </div>
                    :
                     null
            }
        </>
    )
}