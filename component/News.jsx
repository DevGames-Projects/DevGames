'use client'

import {newsData} from "@/data/newsData";
import React from 'react'
import {setHttpClientAndAgentOptions} from "next/dist/server/setup-http-agent-env";

export default function News({onglet, setOnglet}){
    const sliderRef = React.useRef(null)

    React.useEffect(() => {
        if (!sliderRef.current) return
        const slider = sliderRef.current
        slider.scrollTop = slider.scrollHeight
    }, [onglet.news.isOpen])

    return(
        <>
            {
                onglet.news.isOpen ?
                    <>
                        <section id='news' style={{transformOrigin: 'bottom right'}} ref={sliderRef} className='news-container open-window-animation'>
                            <div className='news'>
                                {
                                    newsData.map(news => <NewsContent key={news.id} {...news} content={news.content.replace(/\n/g, '<br>')} />)
                                }
                            </div>
                        </section>
                        <ButtonNews setOnglet={setOnglet} onglet={onglet}/>
                    </>
                    :
                    <ButtonNews setOnglet={setOnglet} onglet={onglet}/>
            }
        </>
    )
}

function ButtonNews({setOnglet, onglet}){

    function openNews(){
        if(onglet.news.isOpen){
            document.getElementById('news').classList.remove('open-window-animation')
            document.getElementById('news').classList.add('minimize-window-animation')

            setTimeout(() => {
                document.getElementById('news').classList.remove('minimize-window-animation')
                setOnglet(prev => ({
                    ...prev,
                    news: {
                        ...prev.news,
                        isOpen: false
                    }
                }))


            }, 200)
        }else{
            setOnglet(prev => ({
                ...prev,
                news: {
                    ...prev.news,
                    isOpen: true
                }
            }))
        }
    }
    return(
        <img src="/assets/icons/news.svg" className='news-button' onClick={openNews} alt=""/>
    )
}

function NewsContent(props){
    const [colorText, setColorText] = React.useState(null)
    React.useEffect(() => {
        const arrayColor = ["#61988E", "#FCE762", "#CBB9A8", "#ABA9BF"]
        const randomNumber = Math.floor(Math.random() * arrayColor.length)

        setColorText(arrayColor[randomNumber])
    }, [])
    return(
        <article>
            <h2 className='news-title' style={{color: colorText !== null ? colorText : null}}>v {props.version}:</h2>
            <p style={{lineHeight: "25px"}} dangerouslySetInnerHTML={{__html: props.content}}></p>
        </article>
    )
}