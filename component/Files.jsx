'use client'

import React from "react";

export default function Files(props){
    const fileRef = React.useRef()
    const isClicked = React.useRef(false)
    const [isSelect, setIsSelect] =React.useState(false)
    const [newPosition, setNewPosition] = React.useState({
        top: props.position.top,
        left: props.position.left
    })
    const coords = React.useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })


    React.useEffect(() => {
        if (!fileRef.current || !props.containerRef.current || typeof window === 'undefined') return;
        const file = document.getElementById(`${props.name}`);
        const container = props.containerRef.current

        const fileSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }


        function handleMouseDown(e){
            if (e.target === file){
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
            coords.current.lastX = file.offsetLeft
            coords.current.lastY = file.offsetTop
        }



        function handleMouseMove(e){
            if(!isClicked.current) return

            let nextX = e.clientX - coords.current.startX + coords.current.lastX
            let nextY = e.clientY - coords.current.startY + coords.current.lastY

            if(nextY < fileSize.top && nextX < fileSize.left){
                nextY =fileSize.top - 1
                nextX = fileSize.left - 1
            }else if(nextY < fileSize.top && nextX + file.offsetWidth > fileSize.right){
                nextX = fileSize.right - file.offsetWidth - 1
                nextY =fileSize.top - 1
            }else if (nextY + file.offsetHeight > fileSize.bottom - (window.innerHeight * 22) / 342 && nextX < fileSize.left){
                nextY = fileSize.bottom - (window.innerHeight * 22) / 342 - file.offsetHeight - 1
                nextX = fileSize.left - 1
            }
            else if (nextY + file.offsetHeight > fileSize.bottom - (window.innerHeight * 22) / 342 && nextX + file.offsetWidth > fileSize.right){
                nextY = fileSize.bottom - (window.innerHeight * 22) / 342 - file.offsetHeight - 1
                nextX = fileSize.right - file.offsetWidth - 1
            }else if (nextY < fileSize.top){
                nextY =fileSize.top - 1
            }else if(nextY + file.offsetHeight > fileSize.bottom - (window.innerHeight * 22) / 342){
                nextY = fileSize.bottom - (window.innerHeight * 22) / 342 - file.offsetHeight - 1
            }else if(nextX < fileSize.left){
                nextX = fileSize.left - 1
            }else if(nextX + file.offsetWidth > fileSize.right){
                nextX = fileSize.right - file.offsetWidth - 1
            }

            setNewPosition({
                left: nextX,
                top: nextY
            })

        }

        document.addEventListener('mousedown', handleMouseDown)
        file.addEventListener('mouseup', handleMouseUp)
        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseUp)

        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
            file.removeEventListener('mousedown', handleMouseDown)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseUp)
        }
    }, [])


    function handleDoubleClick(){
        if (props.fileWindow.length < 1){
            props.setFileWindow(prev => ([
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
            for (let i = 0; i < props.fileWindow.length; i++) {
                const element = props.fileWindow[i]

                if(props.fileWindow[i].name === name){
                    counter++
                }
            }

            if (counter === 0){
                props.setFileWindow(prev => ([
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
        <article style={{top: newPosition.top, left: newPosition.left, background: isSelect ? 'blue': null}} class="file" id={props.name} ref={fileRef} onDoubleClick={handleDoubleClick}>
            <img src={props.img} alt={props.name + 'file'}/>
            <p class="file-name">{props.name}</p>
        </article>
    )
}