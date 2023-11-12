'use client'

import React from "react";
import {fileData} from "@/data/fileData";

export default function NavBottom({ onglet, setOnglet, fileWindow, setFileWindow }){
    const [ ongletMinimize, setOngletMinimize ] = React.useState({})

    React.useEffect(() => {

        function searchOnglet(){
            for (const [key, value] of Object.entries(onglet)){
                if (value.isMinimize === true){
                    setOngletMinimize(prev => ({
                        ...prev,
                        [key]: {
                            [key]: key,
                            img: value.img,
                            type: 'auth'
                        }
                    }))
                }
            }

            for (let i = 0; i < fileWindow.length; i++) {
                const element = fileWindow[i]

                if (element.isMinimize === true){
                    setOngletMinimize(prev => ({
                        ...prev,
                        [element.name]: {
                            name: element.name,
                            img: element.img,
                            type: 'normal'
                        }
                    }))
                }
            }



        }


        searchOnglet()


        return () => {
            searchOnglet()
        }
    }, [onglet, fileWindow])

    function removeMinimize(type, name, e){
        const updatedOngletMinimize = { ...ongletMinimize };
        if(type === 'auth'){

            // Check if the key (e.target.value) exists in ongletMinimize
            if (updatedOngletMinimize.hasOwnProperty(e.target.className)) {
                const elementName = e.target.className
                // Remove the key from the copy
                delete updatedOngletMinimize[e.target.className];

                // Update the state with the modified copy

                for (const [key, value] of Object.entries(onglet)){
                    if (key === elementName){
                        setOnglet(prev => ({
                            ...prev,
                            [elementName]: {
                                ...prev[elementName],
                                isMinimize: false,
                                isOpen: true
                            }
                        }))

                        setTimeout(() => {
                            document.getElementById(`${key}`).classList.remove('open-window-animation')
                        }, 500)

                    }
                }


                setTimeout(()=> {
                    setOngletMinimize(updatedOngletMinimize);
                }, 200)
            }
        }else if(type === 'normal'){
            for (let i = 0; i <fileData.length; i++) {
                const element = fileData[i]

                if (element.name === name){
                    if (fileWindow.length < 1){
                        setFileWindow(prev => ([
                            ...prev,
                            {
                                name: name,
                                type: element.type,
                                isMinimize: element.isMinimize,
                                img: element.img,
                            }
                        ]))
                    }else{
                        let counter = 0
                        for (let i = 0; i < fileWindow.length; i++) {
                            const element = fileWindow[i]

                            if(fileWindow[i].name === name){
                                counter++
                            }
                        }

                        if (counter === 0){
                            setFileWindow(prev => ([
                                ...prev,
                                {
                                    name: name,
                                    type: element.type,
                                    isMinimize: element.isMinimize,
                                    img: element.img,
                                }
                            ]))
                        }

                    }
                }
            }


            delete updatedOngletMinimize[name];
            setOngletMinimize(updatedOngletMinimize);
        }
    }


    return(
        <>
            {Object.keys(ongletMinimize).length > 0 || fileWindow.length > 0 ? (
                <section className="nav-bottom">
                    {Object.keys(ongletMinimize).map((key, index ) => (
                        <img src={ongletMinimize[key].img} className={key} onClick={(e) => removeMinimize(ongletMinimize[key].type, ongletMinimize[key].name, e)} alt={key}/>
                    ))}
                </section>
            ) : null}
        </>
    )
}