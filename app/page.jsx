'use client'

import React, {useRef} from "react";

import Nav from "@/component/Nav";
import {LoginElement, SignInElement} from "@/component/Auth";
import {Loading} from "@/component/Loading";
import NavBottom from "@/component/NavBottom";
import News from "@/component/News";

export default function Page(){
    const [navShow, setNavShow] = React.useState(true)
    const [loadingShow, setLoadingShow] = React.useState(false)
    const [windowHeight, setWindowHeight] = React.useState(null)

    const [onglet, setOnglet] = React.useState({
        login: {
            isMinimize: false,
            img: "/assets/icons/user.svg",
            isOpen: false,
            ongletFirst: false
        },
        signin: {
            isMinimize: false,
            img: "/assets/icons/newUser.svg",
            isOpen: false,
            ongletFirst: false
        },
        news: {
            isMinimize: false,
            img: '/assets/icons/news.svg',
            isOpen: false,
            ongletFirst: false
        }
    })



    const containerRef= useRef()


    React.useEffect(() => {
        if (typeof window !== "undefined") {
            // Access the window object safely
            setWindowHeight(window.innerHeight)
        }
    }, [])

    return(
        <>
            <Nav onglet={onglet} setOnglet={setOnglet} navShow={navShow} />
            <main style={{height: navShow || loadingShow ? `${windowHeight - ((windowHeight * 22) / 342)}px` : `${windowHeight}`}} ref={containerRef} id='mainHome'>
                <LoginElement onglet={onglet} setOnglet={setOnglet} setLoadingShow={setLoadingShow} containerRef={containerRef} />
                <SignInElement onglet={onglet} setOnglet={setOnglet} setLoadingShow={setLoadingShow}  containerRef={containerRef}/>
                <News onglet={onglet} setOnglet={setOnglet}/>
            </main>
            <Loading loadingShow={loadingShow} setLoadingShow={setLoadingShow}/>
            <NavBottom onglet={onglet} setOnglet={setOnglet}/>
        </>
    )
}