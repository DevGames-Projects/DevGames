'use client'

import React from "react";

export default function NavBottom({ onglet, setOnglet }){
    const [ ongletMinimize, setOngletMinimize ] = React.useState({})

    React.useEffect(() => {

        function searchOnglet(){
            for (const [key, value] of Object.entries(onglet)){
                if (value.isMinimize === true){
                    setOngletMinimize(prev => ({
                        ...prev,
                        [key]: {
                            [key]: key,
                            img: value.img
                        }
                    }))
                }
            }



        }

        console.log(ongletMinimize)

        searchOnglet()


        return () => {
            searchOnglet()
        }
    }, [onglet])

    function removeMinimize(e){
        const updatedOngletMinimize = { ...ongletMinimize };

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
    }


    return(
        <>
            {Object.keys(ongletMinimize).length > 0 ? (
                <section className="nav-bottom">
                    {Object.keys(ongletMinimize).map((key, index ) => (
                        <img src={ongletMinimize[key].img} className={key} onClick={removeMinimize} alt={key}/>
                    ))}
                </section>
            ) : null}
        </>
    )
}