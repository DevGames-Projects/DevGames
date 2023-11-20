'use client'

import React, {useRef} from "react";
import {fileData} from "@/data/fileData";
import {signIn, signOut, useSession} from "next-auth/react";

export default function FileWindow({fileWindow, containerRef, setFileWindow}){
    return(
        <>
            {
                fileWindow.map(windowSelect => {
                    switch (windowSelect.type){
                        case 'read':
                            return <ReadWindow {...windowSelect} fileWindow={fileWindow} setFileWindow={setFileWindow} containerRef={containerRef}/>
                        case 'disconnect':
                            return <DisconnectWindow {...windowSelect} fileWindow={fileWindow} setFileWindow={setFileWindow}/>
                        case 'changePassword':
                            return <ChangePassword {...windowSelect} fileWindow={fileWindow} setFileWindow={setFileWindow} containerRef={containerRef}/>
                        case 'changeEmail':
                            return <ChangeEmail {...windowSelect} fileWindow={fileWindow} setFileWindow={setFileWindow} containerRef={containerRef}/>
                        case 'removeAccount':
                            return <RemoveAccount {...windowSelect} fileWindow={fileWindow} setFileWindow={setFileWindow}/>
                        default:
                            return
                    }
                })
            }
        </>
    )
}


function ReadWindow(props){
    const [windowHeight, setWindowHeight] = React.useState(null)
    const [content, setContent] = React.useState('')
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

        for (let i = 0; i < fileData.length; i++) {
            const element = fileData[i]

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

        props.setFileWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    function minimizeWindow(){
        const nouveauState = props.fileWindow.map(item =>
            item.name === props.name ? { ...item, isMinimize: true } : item
        );
        props.setFileWindow(nouveauState)


        setTimeout(() => {
            props.setFileWindow(prev => {
                const newArray = prev.filter(element => element.name !== props.name)

                return newArray
            })
        }, 100)

    }

    return(
        <section className="window" id={`window-${props.name}`} style={{maxHeight: `${windowHeight - ((windowHeight * 22) / 342)}px`, top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: isTop ? '990' : "50"}}>
            <div className={`headPopUp-${props.name} headPopUp`} ><span>{props.name}</span> <div className="buttons-nav">
                <button className="unShowButton" onClick={minimizeWindow}></button>
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="content">
                {content}
            </div>
        </section>
    )
}

function DisconnectWindow(props){
    const [windowHeight, setWindowHeight] = React.useState(null)

    React.useEffect(() => {
        setWindowHeight(window.innerHeight)
    }, [])

    function closeButton(){

        props.setFileWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section className="window" id={`window-${props.name}`} style={{ top: `${(windowHeight - ((windowHeight * 22) / 342) - 150) / 2}px`, left: `50%`, zIndex: '999', transform: 'translateX(-50%)', width: "20%", resize: "none"}}>
            <div className={`headPopUp-${props.name} headPopUp`} ><span>{props.name}</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="content disconnect">
                <p>Etes vous sur de vouloir vous déconnecter ?</p>
                <div className="buttons">
                    <button onClick={() => signOut()}>Oui</button>
                    <button onClick={closeButton}>Non</button>
                </div>
            </div>
        </section>
    )
}

function RemoveAccount(props){
    const [windowHeight, setWindowHeight] = React.useState(null)
    const [message, setMessage]= React.useState({
        message: "",
        status: ""
    })
    const {data: session} = useSession()

    React.useEffect(() => {
        setWindowHeight(window.innerHeight)
    }, [])

    async function removeAccount(e){
        e.preventDefault()

        const result = await fetch(`https://dev-games-brown.vercel.app/api/auth/removeUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: session?.user.email,
            }),
        })

        const error = await result.json()

        if (error === 'Account Delete'){
            setMessage({
                message: "Votre compte à bien été supprimé, ne quitter pas la page",
                status: true
            })
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }
    }

    function closeButton(){

        props.setFileWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section className="window" id={`window-${props.name}`} style={{ top: `${(windowHeight - ((windowHeight * 22) / 342) - 150) / 2}px`, left: `50%`, zIndex: '999', transform: 'translateX(-50%)', width: "20%", resize: "none"}}>
            <div className={`headPopUp-${props.name} headPopUp`} ><span>{props.name}</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="content disconnect">
                <p>Etes vous sur de vouloir supprimer votre compte ?</p>
                {
                    message.status ?
                        <p className={'check'}>{message.message}</p>
                        :
                        <div className="buttons">
                            <button onClick={removeAccount}>Oui</button>
                            <button onClick={closeButton}>Non</button>
                        </div>
                }
            </div>
        </section>
    )
}

function ChangePassword(props){
    const {data: session} = useSession()
    const [user, setUser]= React.useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [message, setMessage]= React.useState({
        message: "",
        status: ""
    })
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

    async function changePassword(e){
        e.preventDefault()

        const result = await fetch(`https://dev-games-brown.vercel.app/api/auth/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: session?.user.email,
                newPassword: user.newPassword,
                oldPassword: user.oldPassword,
                confirmPassword: user.confirmPassword,
            }),
        })

        const error = await result.json()

        if(result.ok){
            setMessage({
                status: true,
                message:'Votre nouveau mot de passe a bien été modifié'
            })
        }else{
            switch (error){
                case 'erreur taille passwords':
                    setMessage({
                        status: false,
                        message: 'Veuillez entrez des mot de passes valide, de minimum 8 charactères'
                    })
                    break
                case 'erreur same new password':
                    setMessage({
                        status: false,
                        message: 'Votre ancien mot de passe est similaire à votre nouveau'
                    })
                    break
                case 'erreur same password':
                    setMessage({
                        status: false,
                        message: "Votre ancien mot de passe ne correspond pas"
                    })
                    break
                case 'erreur new & confirm':
                    setMessage({
                        status: false,
                        message: "Votre nouveau mot de passe n'est pas conforme avec votre mot de passe de confirmation"
                    })
                    break
                default:
                    break
            }
        }

    }


    React.useEffect(() => {
        if (!props.containerRef.current || typeof window === 'undefined') return;

        const page = document.getElementById(`changePassword`);
        const pageDrag = document.querySelector(`.headPopUpchangePassword`);
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

        props.setFileWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section style={{top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: `990`, width: '60%'}} className='auth open-window-animation' id="changePassword">
            <div className={`headPopUpchangePassword headPopUp`} ><span>Changer votre mot de passe</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="information-form">
                <img src="/assets/icons/changepassword.svg" alt="Personnage signifiant l'utilisateur" className="iconForm"/>

                <form onSubmit={changePassword} className="form-auth">
                    <div className="input-form-container">
                        <span className='title-form'>Veuillez entrer votre ancien mot de passe, puis votre nouveau mot de passe</span>
                        <div className='inputs-form'>
                            <label htmlFor="email">Ancien mot de passe: </label>
                            <input type="password" name="password" id="password" value={user.oldPassword} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                oldPassword: e.target.value
                            }))}/>
                        </div>
                        <div className='inputs-form'>
                            <label htmlFor="password">Nouveau mot de passe: </label>
                            <input type="password" name="password" id="password" value={user.newPassword} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                newPassword: e.target.value
                            }))}/>
                        </div>
                        <div className='inputs-form'>
                            <label htmlFor="password">Confirmer votre mot de passe: </label>
                            <input type="password" name="password" id="password" value={user.confirmPassword} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value
                            }))}/>
                        </div>
                    </div>
                    <div className="button-form">
                        {
                            false  ?
                                <button onClick={closeWindow}>Fermer</button>
                                :
                                <>
                                    <button type='submit' className="send">OK.</button>
                                    <button onClick={closeButton}>Cancel</button>
                                </>
                        }

                        <p className={`message-form ${message.status ? 'check' : 'error'}`}>{message.message}</p>
                    </div>
                </form>
            </div>
        </section>
    )
}

function ChangeEmail(props){
    const {data: session} = useSession()
    const [user, setUser]= React.useState({
        oldEmail: "",
        newEmail: "",
        confirmEmail: ""
    })
    const [message, setMessage]= React.useState({
        message: "",
        status: ""
    })
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

    async function changeMail(e){
        e.preventDefault()

        const result = await fetch(`https://dev-games-brown.vercel.app/api/auth/changeEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: session?.user.email,
                newEmail: user.newEmail,
                oldEmail: user.oldEmail,
                confirmEmail: user.confirmEmail,
            }),
        })

        const error = await result.json()
        console.log(error)

        if(result.ok){
            setMessage({
                status: true,
                message:'Votre nouveau mot de passe a bien été modifié'
            })
        }else{
            switch (error){
                case 'erreur taille email':
                    setMessage({
                        status: false,
                        message: 'Veuillez entrez des addresses mail valides'
                    })
                    break
                case 'erreur same new email':
                    setMessage({
                        status: false,
                        message: 'Votre ancien email est similaire à votre nouveau'
                    })
                    break
                case 'erreur same email':
                    setMessage({
                        status: false,
                        message: "Votre ancien email ne correspond pas"
                    })
                    break
                case 'erreur new & confirm':
                    setMessage({
                        status: false,
                        message: "Votre nouvelle adresse mail n'est pas conforme avec votre addresse mail de confirmation"
                    })
                    break
                default:
                    break
            }
        }

    }


    React.useEffect(() => {
        if (!props.containerRef.current || typeof window === 'undefined') return;

        const page = document.getElementById(`changeEmail`);
        const pageDrag = document.querySelector(`.headPopUpchangeEmail`);
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

        props.setFileWindow(prev => {
            const newArray = prev.filter(element => element.name !== props.name)

            return newArray
        })
    }

    return(
        <section style={{top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: `990`, width: '60%'}} className='auth open-window-animation' id="changeEmail">
            <div className={`headPopUpchangeEmail headPopUp`} ><span>Changer votre mot de passe</span> <div className="buttons-nav">
                <button className="closeButton" onClick={closeButton}></button>
            </div></div>

            <div className="information-form">
                <img src="/assets/icons/changemail.svg" alt="Personnage signifiant l'utilisateur" className="iconForm"/>

                <form onSubmit={changeMail} className="form-auth">
                    <div className="input-form-container">
                        <span className='title-form'>Veuillez entrer votre ancien mail, puis votre nouveau mail</span>
                        <div className='inputs-form'>
                            <label htmlFor="email">Ancien mail: </label>
                            <input type="email" name="email" id="email" value={user.email} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                oldEmail: e.target.value
                            }))}/>
                        </div>
                        <div className='inputs-form'>
                            <label htmlFor="password">Nouveau mail: </label>
                            <input type="email" name="email" id="email" value={user.password} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                newEmail: e.target.value
                            }))}/>
                        </div>
                        <div className='inputs-form'>
                            <label htmlFor="password">Confirmer votre mail: </label>
                            <input type="email" name="email" id="email" value={user.password} onChange={(e) => setUser((prev) => ({
                                ...prev,
                                confirmEmail: e.target.value
                            }))}/>
                        </div>
                    </div>
                    <div className="button-form">
                        {
                            false  ?
                                <button onClick={closeButton}>Fermer</button>
                                :
                                <>
                                    <button type='submit' className="send">OK.</button>
                                    <button onClick={closeButton}>Cancel</button>
                                </>
                        }

                        <p className={`message-form ${message.status ? 'check' : 'error'}`}>{message.message}</p>
                    </div>
                </form>
            </div>
        </section>
    )
}