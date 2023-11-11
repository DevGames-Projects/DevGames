"use client"

import React, {useRef} from "react";
import {signIn} from "next-auth/react";

export function LoginElement({ containerRef, setLoadingShow, setOnglet, onglet}){
    const [message, setMessage] = React.useState({
        status: false,
        message: ''
    })
    const [user, setUser] = React.useState({
        email: '',
        password: ""
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
    const [page, setPage] = React.useState(null)

    const loginRef = useRef()

    async function Login(e){
        e.preventDefault()
        setLoadingShow(true)
        const result = await signIn('credentials', {
            email: user.email,
            password: user.password,
            type: 'logIn',
            redirect: false
        })


        if(result.ok){
            setMessage({
                status: true,
                message:'Votre compte a bien été trouvé'
            })
        }
    }


    React.useEffect(() => {
        if (!loginRef.current || !containerRef.current || typeof window === 'undefined') return;

        setPage(document.getElementById('login'))
        const page = document.getElementById('login');
        const pageDrag = document.querySelector('.headPopUpLogin');
        const container = containerRef.current
        const pageSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }


        function handleMouseDown(e){
            isClicked.current = true
            coords.current.startX = e.clientX
            coords.current.startY = e.clientY
            setOnglet(prev => ({
                ...prev,
                signin: {
                    ...prev.signin,
                    ongletFirst: false
                },
                login: {
                    ...prev.login,
                    ongletFirst: true
                }
            }))
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
    }, [onglet.login.isOpen])

    function closeWindow(){
        setOnglet(prev => ({
            ...prev,
            login: {
                ...prev.login,
                isOpen: false
            }
        }))
    }

    function minimizeWindow(){

        page.classList.add('minimize-window-animation')

        setTimeout(() => {
            setOnglet(prev => ({
                ...prev,
                login: {
                    ...prev.login,
                    isOpen: false,
                    isMinimize: true
                }
            }))


        }, 200)
    }

    return(
        <>
            {
                onglet.login.isOpen ?
                    <section ref={loginRef} style={{top: `${newPosition.top}px`, left: `${newPosition.left}px`, zIndex: `${onglet.login.ongletFirst ? '900': '10'}`}} className='auth open-window-animation' id="login">
                        <div className="headPopUpLogin" ><span>Re bonjour sur  DevGames</span> <div className="buttons-nav">
                            <button className="unShowButton" onClick={minimizeWindow}></button>
                            <button className="closeButton" onClick={closeWindow}></button>
                        </div></div>

                        <div className="information-form">
                            <img src="/assets/icons/user.svg" alt="Personnage signifiant l'utilisateur" className="iconForm"/>

                            <form onSubmit={Login} className="form-auth">
                                <div className="input-form-container">
                                    <span className='title-form'>Entre le nom et mot de passe de votre compte DevGames</span>
                                    <div className='inputs-form'>
                                        <label htmlFor="email">Email: </label>
                                        <input type="email" name="email" id="email" value={user.email} onChange={(e) => setUser((prev) => ({
                                            ...prev,
                                            email: e.target.value
                                        }))}/>
                                    </div>
                                    <div className='inputs-form'>
                                        <label htmlFor="password">Mot de passe: </label>
                                         <input type="password" name="password" id="password" value={user.password} onChange={(e) => setUser((prev) => ({
                                             ...prev,
                                             password: e.target.value
                                         }))}/>
                                    </div>
                                </div>
                                <div className="button-form">
                                    <button type='submit' className="send">OK.</button>
                                    <button onClick={closeWindow}>Cancel</button>

                                    <p className={`message-form ${message.status ? 'check' : 'error'}`}>{message.message}</p>
                                </div>
                            </form>
                        </div>
                    </section>
                    :
                    null
            }
        </>

    )
}



export function SignInElement({containerRef, setOnglet, onglet, setLoadingShow}){
    const [message, setMessage] = React.useState({
        status: null,
        message: ''
    })
    const [user, setUser] = React.useState({
        email: '',
        username: '',
        password: ""
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

    const SignInRef = useRef()

    async function SignIn(e){
        e.preventDefault()
        setLoadingShow(true)
        const result = await signIn('credentials', {
            username: user.username,
            email: user.email,
            password: user.password,
            type: 'signIn',
            redirect: false
        })

        if(result.ok){
            setMessage({
                status: true,
                message:'Votre compte a bien été crée'
            })
        }
    }

    React.useEffect(() => {
        if (!SignInRef.current || !containerRef.current || typeof window === 'undefined') return;

        const page = document.getElementById('signin');
        const container = containerRef.current
        const pageDrag = document.querySelector('.headPopUpSignIn');
        const pageSize = {
            top: 0,
            left: 0,
            bottom: window.innerHeight,
            right: window.innerWidth

        }


        function handleMouseDown(e){
            isClicked.current = true
            coords.current.startX = e.clientX
            coords.current.startY = e.clientY
            setOnglet(prev => ({
                ...prev,
                signin: {
                    ...prev.signin,
                    ongletFirst: true
                },
                login: {
                    ...prev.login,
                    ongletFirst: false
                }
            }))
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
    }, [onglet.signin.isOpen])

    function closeWindow(){
        setOnglet(prev => ({
            ...prev,
            signin: {
                ...prev.signin,
                isOpen: false
            }
        }))
    }

    function minimizeWindow(){
        setOnglet(prev => ({
            ...prev,
            signin: {
                ...prev.signin,
                isOpen: false,
                isMinimize: true
            }
        }))
    }

    return(
        <>
            {
                onglet.signin.isOpen ?
                    <section ref={SignInRef} style={{zIndex: `${onglet.signin.isMinimize ? '900' : '10'}`, top: `${newPosition.top}px`, left: `${newPosition.left}px`}} className='auth' id="signin">
                        <div className="headPopUpSignIn" >
                            <span>Bienvenu sur  DevGames</span>
                            <div class="buttons-nav">
                                <button className="unShowButton" onClick={minimizeWindow}></button>
                                <button className="closeButton" onClick={closeWindow}></button>
                            </div>
                        </div>

                        <div className="information-form">
                            <img src="/assets/icons/newUser.svg" alt="Personnage signifiant l'utilisateur" className="iconForm"/>

                            <form onSubmit={SignIn} className="form-auth">
                                <div className="input-form-container">
                                    <span className='title-form'>Entre le nom et mot de passe de votre compte DevGames</span>
                                    <div className='inputs-form'>
                                        <label htmlFor="name">Nom: </label>
                                        <input type="text" name="name" id="name" value={user.username} onChange={(e) => setUser(prev => ({
                                            ...prev,
                                            username: e.target.value
                                        }))}/>
                                    </div>
                                    <div className='inputs-form'>
                                        <label htmlFor="email">Email: </label>
                                        <input type="email" name="email" id="email" value={user.email} onChange={(e) => setUser((prev) => ({
                                            ...prev,
                                            email: e.target.value
                                        }))}/>
                                    </div>
                                    <div className='inputs-form'>
                                        <label htmlFor="password">Mot de passe: </label>
                                        <input type="password" name="password" id="password" value={user.password} onChange={(e) => setUser((prev) => ({
                                            ...prev,
                                            password: e.target.value
                                        }))}/>
                                    </div>
                                </div>
                                <div className="button-form">
                                    <button type='submit' className="send">OK.</button>
                                    <button onClick={closeWindow}>Cancel</button>

                                    <p className={`message-form ${message.status ? 'check' : 'error'}`}>{message.message}</p>
                                </div>
                            </form>
                        </div>
                    </section>
                    :
                    null
            }
        </>

    )
}