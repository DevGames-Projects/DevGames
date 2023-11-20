'use client'

import React, {useRef} from "react";
import {fileData} from "@/data/fileData";
import {signIn, useSession} from "next-auth/react";
import {folderData} from "@/data/folderData";

export default function FolderWindow({folderWindow, containerRef, setFolderWindow}){
    return(
        <>
            {
                folderWindow.map(windowSelect => {
                    switch (windowSelect.type){
                        case 'normal':
                            return <NormalFolderWindow {...windowSelect} folderWindow={folderWindow} setFolderWindow={setFolderWindow} containerRef={containerRef}/>
                        case 'settings':
                            return <SettingsFolderWindow {...windowSelect} folderWindow={folderWindow} setFolderWindow={setFolderWindow} containerRef={containerRef}/>
                        default:
                            return
                    }
                })
            }
        </>
    )
}


export function SettingsFolderWindow(props){
    const [content, setContent] = React.useState(null)
    const [windowHeight, setWindowHeight] = React.useState(null)
    const [newPosition, setNewPosition] = React.useState({
        top: 0,
        left: 0
    })
    const isClicked = React.useRef(false)
    const coords = React.useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })

    const [isTop, setIsTop] = React.useState(false)


    React.useEffect(() => {
        if (!props.containerRef.current || typeof window === 'undefined') return;

        for (let i = 0; i < folderData.length; i++) {
            const element = folderData[i]

            if (element.name === props.name){
                setContent(element.content)
            }
        }

        setWindowHeight(window.innerHeight)
        const page = document.getElementById(`window-${props.name}`);
        const pageDrag = document.querySelector(`.headPopUp-${props.name}`);
        const container = props.containerRef.current
        const pageSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }


        function handleMouseDown(e){
            if (e.target === pageDrag){
                isClicked.current = true
                coords.current.startX = e.clientX
                coords.current.startY = e.clientY
                setIsTop(true)
            }else {
                setIsTop(false)
            }
        }

        function handleMouseUp(){
            isClicked.current = false
            coords.current.lastX = page.offsetLeft
            coords.current.lastY = page.offsetTop
        }

        function handleMouseMove(e){
            if(!isClicked.current) return

            let nextX = e.clientX - coords.current.startX + coords.current.lastX
            let nextY = e.clientY - coords.current.startY + coords.current.lastY

            if(nextY < pageSize.top && nextX < pageSize.left){
                nextY =pageSize.top - 1
                nextX = pageSize.left - 1
            }else if(nextY < pageSize.top && nextX + page.offsetWidth > pageSize.right){
                nextX = pageSize.right - page.offsetWidth - 1
                nextY =pageSize.top - 1
            }else if (nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342 && nextX < pageSize.left){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
                nextX = pageSize.left - 1
            }
            else if (nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342 && nextX + page.offsetWidth > pageSize.right){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
                nextX = pageSize.right - page.offsetWidth - 1
            }else if (nextY < pageSize.top){
                nextY =pageSize.top - 1
            }else if(nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
            }else if(nextX < pageSize.left){
                nextX = pageSize.left - 1
            }else if(nextX + page.offsetWidth > pageSize.right){
                nextX = pageSize.right - page.offsetWidth - 1
            }

            setNewPosition({
                left: nextX,
                top: nextY
            })

        }

        pageDrag.addEventListener('mousedown', handleMouseDown)
        pageDrag.addEventListener('mouseup', handleMouseUp)
        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseUp)

        return () => {
            pageDrag.removeEventListener('mouseup', handleMouseUp)
            pageDrag.removeEventListener('mousedown', handleMouseDown)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseUp)
        }
    }, [])

    function closeButton(){

        props.setFolderWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section className="window-folder" id={`window-${props.name}`} style={{maxHeight: `${windowHeight - ((windowHeight * 22) / 342)}px`, top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: isTop ? '990' : "50"}}>
            <div className={`headPopUp-${props.name} headPopUp`} ><span>{props.name}</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="content">
                {content}
            </div>
        </section>
    )
}

export function NormalFolderWindow(props){
    const [content, setContent] = React.useState(null)
    const [windowHeight, setWindowHeight] = React.useState(null)
    const [newPosition, setNewPosition] = React.useState({
        top: 0,
        left: 0
    })
    const isClicked = React.useRef(false)
    const coords = React.useRef({
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0
    })

    const [isTop, setIsTop] = React.useState(false)


    React.useEffect(() => {
        if (!props.containerRef.current || typeof window === 'undefined') return;

        for (let i = 0; i < folderData.length; i++) {
            const element = folderData[i]

            if (element.name === props.name){
                setContent(element.content)
            }
        }

        setWindowHeight(window.innerHeight)
        const page = document.getElementById(`window-${props.name}`);
        const pageDrag = document.querySelector(`.headPopUp-${props.name}`);
        const container = props.containerRef.current
        const pageSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }


        function handleMouseDown(e){
            if (e.target === pageDrag){
                isClicked.current = true
                coords.current.startX = e.clientX
                coords.current.startY = e.clientY
                setIsTop(true)
            }else {
                setIsTop(false)
            }
        }

        function handleMouseUp(){
            isClicked.current = false
            coords.current.lastX = page.offsetLeft
            coords.current.lastY = page.offsetTop
        }

        function handleMouseMove(e){
            if(!isClicked.current) return

            let nextX = e.clientX - coords.current.startX + coords.current.lastX
            let nextY = e.clientY - coords.current.startY + coords.current.lastY

            if(nextY < pageSize.top && nextX < pageSize.left){
                nextY =pageSize.top - 1
                nextX = pageSize.left - 1
            }else if(nextY < pageSize.top && nextX + page.offsetWidth > pageSize.right){
                nextX = pageSize.right - page.offsetWidth - 1
                nextY =pageSize.top - 1
            }else if (nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342 && nextX < pageSize.left){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
                nextX = pageSize.left - 1
            }
            else if (nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342 && nextX + page.offsetWidth > pageSize.right){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
                nextX = pageSize.right - page.offsetWidth - 1
            }else if (nextY < pageSize.top){
                nextY =pageSize.top - 1
            }else if(nextY + page.offsetHeight > pageSize.bottom - (window.innerHeight * 22) / 342){
                nextY = pageSize.bottom - (window.innerHeight * 22) / 342 - page.offsetHeight - 1
            }else if(nextX < pageSize.left){
                nextX = pageSize.left - 1
            }else if(nextX + page.offsetWidth > pageSize.right){
                nextX = pageSize.right - page.offsetWidth - 1
            }

            setNewPosition({
                left: nextX,
                top: nextY
            })

        }

        pageDrag.addEventListener('mousedown', handleMouseDown)
        pageDrag.addEventListener('mouseup', handleMouseUp)
        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseUp)

        return () => {
            pageDrag.removeEventListener('mouseup', handleMouseUp)
            pageDrag.removeEventListener('mousedown', handleMouseDown)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseUp)
        }
    }, [])

    function closeButton(){

        props.setFolderWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section className="window-folder" id={`window-${props.name}`} style={{maxHeight: `${windowHeight - ((windowHeight * 22) / 342)}px`, top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: isTop ? '990' : "50"}}>
            <div className={`headPopUp-${props.name} headPopUp`} ><span>{props.name}</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="content-folder">
                {content}
            </div>
        </section>
    )
}