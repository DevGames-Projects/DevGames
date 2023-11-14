'use client'

import React from "react";
import {useSession} from "next-auth/react";

export default function Folders(props){
    const {data: session} = useSession()
    const folderRef = React.useRef()
    const isClicked = React.useRef(false)
    const [isSelect, setIsSelect] =React.useState(false)
    const [newPosition, setNewPosition] = React.useState({
        top: 0,
        left:0
    })
    const coords = React.useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })


    React.useEffect(() => {
        if (!folderRef.current || !props.containerRef.current || typeof window === 'undefined') return;
        const folder = document.getElementById(`${props.name}-folder`);
        const container = props.containerRef.current

        const folderSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }

        setNewPosition({
            top: (props.position.top * ((window.innerHeight - (window.innerHeight * 22) / 342) - (folder.offsetHeight))) / 100,
            left: (props.position.left * (window.innerWidth - folder.offsetWidth)  ) / 100
        })

        coords.current.lastX = (props.position.left * (window.innerWidth - folder.offsetWidth)  ) / 100
        coords.current.lastY = (props.position.top * ((window.innerHeight - (window.innerHeight * 22) / 342) - (folder.offsetHeight * 2))) / 100


        function handleMouseDown(e){
            if (e.target.id === `${props.name + '-folder'}`){
                if (props.draggable){
                    isClicked.current = true
                    coords.current.startX = e.clientX
                    coords.current.startY = e.clientY
                }
                setIsSelect(true)
            }else {
                setIsSelect(false)
            }
        }

        function handleMouseUp(){
            isClicked.current = false
            coords.current.lastX = folder.offsetLeft
            coords.current.lastY = folder.offsetTop
        }



        function handleMouseMove(e){
            if(!isClicked.current) return

            let nextX = e.clientX - coords.current.startX + coords.current.lastX
            let nextY = e.clientY - coords.current.startY + coords.current.lastY

            if(nextY < folderSize.top && nextX < folderSize.left){
                nextY =folderSize.top - 1
                nextX = folderSize.left - 1
            }else if(nextY < folderSize.top && nextX + folder.offsetWidth > folderSize.right){
                nextX = folderSize.right - folder.offsetWidth - 1
                nextY =folderSize.top - 1
            }else if (nextY + folder.offsetHeight > folderSize.bottom - (window.innerHeight * 22) / 342 && nextX < folderSize.left){
                nextY = folderSize.bottom - (window.innerHeight * 22) / 342 - folder.offsetHeight - 1
                nextX = folderSize.left - 1
            }
            else if (nextY + folder.offsetHeight > folderSize.bottom - (window.innerHeight * 22) / 342 && nextX + folder.offsetWidth > folderSize.right){
                nextY = folderSize.bottom - (window.innerHeight * 22) / 342 - folder.offsetHeight - 1
                nextX = folderSize.right - folder.offsetWidth - 1
            }else if (nextY < folderSize.top){
                nextY =folderSize.top - 1
            }else if(nextY + folder.offsetHeight > folderSize.bottom - (window.innerHeight * 22) / 342){
                nextY = folderSize.bottom - (window.innerHeight * 22) / 342 - folder.offsetHeight - 1
            }else if(nextX < folderSize.left){
                nextX = folderSize.left - 1
            }else if(nextX + folder.offsetWidth > folderSize.right){
                nextX = folderSize.right - folder.offsetWidth - 1
            }

            setNewPosition({
                left: nextX,
                top: nextY
            })

        }

        document.addEventListener('mousedown', handleMouseDown)
        folder.addEventListener('mouseup', handleMouseUp)
        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseUp)

        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            folder.removeEventListener('mousedown', handleMouseDown)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseUp)
        }
    }, [session])


    function handleDoubleClick(){
        if (props.folderWindow.length < 1){
            props.setFolderWindow(prev => ([
                ...prev,
                {
                    name: props.name,
                    type: props.type,
                    isMinimize: props.isMinimize,
                    img: props.img
                }
            ]))
        }else{
            let counter = 0
            for (let i = 0; i < props.folderWindow.length; i++) {
                const element = props.folderWindow[i]

                if(props.folderWindow[i].name === name){
                    counter++
                }
            }

            if (counter === 0){
                props.setFolderWindow(prev => ([
                    ...prev,
                    {
                        name: props.name,
                        type: props.type,
                        isMinimize: props.isMinimize,
                        img: props.img
                    }
                ]))
            }

        }
    }


    return(
        <>
            {
                session?.user ?
                    <article style={{top: newPosition.top, left: newPosition.left, background: isSelect ? 'blue': null, zIndex: "800"}} className="folder" id={props.name + '-folder'} ref={folderRef} onDoubleClick={handleDoubleClick}>
                        <img src={props.img} alt={props.name + ' folder'}/>
                        <p className="folder-name">{props.name}</p>
                    </article>
                    :
                    null
            }

        </>
    )
}