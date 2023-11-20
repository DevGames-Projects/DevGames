"use client"

import React from "react";
import {useSession} from "next-auth/react";

export default function Nav({setLoginShow, setSignInShow, navShow, onglet, setOnglet}){
    const {data: session} = useSession()
    return(
        <>
            {
                navShow ?
                    session ?
                        <Connected session={session}/>
                        :
                        <Unconnected onglet={onglet} setOnglet={setOnglet} setLoginShow={setLoginShow} setSignInShow={setSignInShow}/>
                    :
                    null
            }
        </>
    )
}

function Unconnected({setLoginShow, setSignInShow, setOnglet, onglet}){
    const [time, setTime] = React.useState({ hour: null, minute: null})
    const [navHeight, setNavHeight] = React.useState(null)

    React.useEffect(() => {
        updateTime();

        function updateTime() {
            const date = new Date();
            setTime({ hour: date.getHours(), minute: date.getMinutes() });
        }

        const intervalId = setInterval(updateTime, 60000);


        setNavHeight((window.innerHeight * 22) / 342);


        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function openLogin(){
        setOnglet(prev => ({
            ...prev,
            login: {
                ...prev.login,
                isOpen: true,
                ongletFirst: true,
                isMinimize: false
            }
        }))

        setTimeout(() => {
            document.getElementById(`login`).classList.remove('open-window-animation')
        }, 500)
    }

    function openSignIn(){
        setOnglet(prev => ({
            ...prev,
            signin: {
                ...prev.signin,
                isOpen: true,
                ongletFirst: true,
                isMinimize: false
            }
        }))

        setOnglet(prev => ({
            ...prev,
            signin: {
                ...prev.signin,
                isMinimize: false,
                isOpen: true
            }
        }))

        setTimeout(() => {
            document.getElementById(`signin`).classList.remove('open-window-animation')
        }, 500)
    }

    return(
        <header id="nav" style={{height: `${navHeight}px`}}>
            <div className="left-nav">
                <img src="/assets/logo.svg" alt="Logo de devGames" className="logo"/>
                <p className="time"><span>{time.hour}</span> : <span>{time.minute}</span></p>
            </div>

            <div className="right-nav">
                <button className="login" onClick={openLogin}>Se Connecter</button>
                <button className="signin" onClick={openSignIn}>S'inscrire</button>
            </div>
        </header>
    )
}

function Connected({session}){
    const [time, setTime] = React.useState({ hour: null, minute: null})
    const [navHeight, setNavHeight] = React.useState(null)

    React.useEffect(() => {
        updateTime();

        function updateTime() {
            const date = new Date();
            setTime({ hour: date.getHours(), minute: date.getMinutes() });
        }

        const intervalId = setInterval(updateTime, 60000);

        setNavHeight((window.innerHeight * 22) / 342);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    return(
        <header id="nav" style={{height: `${navHeight}px`}}>
            <div className="left-nav">
                <img src="/assets/logo.svg" alt="Logo de devGames" className="logo"/>
                <p className="time"><span>{time.hour}</span> : <span>{time.minute}</span></p>
            </div>

            <div className="right-nav">
                <p>{session.user.name}</p>
            </div>
        </header>
    )
}