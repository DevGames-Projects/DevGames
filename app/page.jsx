'use client'

import React, {useRef} from "react";

import Nav from "@/component/Nav";
import {LoginElement, SignInElement} from "@/component/Auth";
import {Loading} from "@/component/Loading";
import NavBottom from "@/component/NavBottom";
import News from "@/component/News";
import Files from "@/component/Files";
import FileWindow from "@/component/FileWindow";
import {useSession} from "next-auth/react";
import {fileData} from "@/data/fileData";
import {folderData} from "@/data/folderData";
import Folders from "@/component/Folder";
import FolderWindow, {NormalFolderWindow} from "@/component/FolderWindow";
import {useCustomInfo} from "@/component/CustomProvider";

export default function Page(){
    const {data: session} = useSession()
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
    const [fileWindow, setFileWindow] = React.useState([])
    const [folderWindow, setFolderWindow] = React.useState([])
    const containerRef= useRef()
    const { customInfo, setCustomInfoData } = useCustomInfo()

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            // Access the window object safely
            setWindowHeight(window.innerHeight)
        }

        setCustomInfoData(prev => ({
            ...prev,
            fileWindow: fileWindow,
            setFileWindow: setFileWindow
        }))
    }, [])

    return(
        <>
            <Nav onglet={onglet} setOnglet={setOnglet} navShow={navShow} />
            <main style={{height: navShow || loadingShow ? `${windowHeight - ((windowHeight * 22) / 342)}px` : `${windowHeight}`}} ref={containerRef} id='mainHome' onContextMenu={(e) => e.preventDefault()}>
                <LoginElement onglet={onglet} setOnglet={setOnglet} setLoadingShow={setLoadingShow} containerRef={containerRef} />
                <SignInElement onglet={onglet} setOnglet={setOnglet} setLoadingShow={setLoadingShow}  containerRef={containerRef}/>
                <News onglet={onglet} setOnglet={setOnglet}/>
                <FileWindow setFileWindow={setFileWindow} fileWindow={fileWindow} containerRef={containerRef}/>
                <FolderWindow folderWindow={folderWindow} setFolderWindow={setFolderWindow} containerRef={containerRef}/>

                {
                    folderData.map(folder => folder.level === 0 ? <Folders folderWindow={folderWindow} setFolderWindow={setFolderWindow} containerRef={containerRef} {...folder} /> : null)
                }

                {
                    session?.user ?
                        null
                        :
                        fileData.map(fileSelect => fileSelect.firstPage ? <Files fileWindow={fileWindow} setFileWindow={setFileWindow} containerRef={containerRef} {...fileSelect} /> : null)
                }

                {
                    session?.user ?
                        fileData.map(fileSelect => fileSelect.level === session.user.level && !fileSelect.firstPage ? <Files fileWindow={fileWindow} setFileWindow={setFileWindow} containerRef={containerRef} {...fileSelect} /> : null)
                        :
                        null
                }

                {
                    session?.user ?
                        folderData.map(folderSelect => folderSelect.level === session.user.level ? <Folders folderWindow={folderWindow} setFolderWindow={setFolderWindow} containerRef={containerRef} {...folderSelect} /> : null)
                        :
                        null
                }

            </main>
            <Loading loadingShow={loadingShow} setLoadingShow={setLoadingShow}/>
            <NavBottom onglet={onglet} setOnglet={setOnglet} fileWindow={fileWindow} setFileWindow={setFileWindow}/>
        </>
    )
}