export const fileData = [
    {
        name: "README",
        content:
            <span style={{display: 'flex', flexDirection: "column", gap: "20px", lineHeight: '25px', padding: "10px"}}>
                <h1 style={{fontWeight: 'normal'}}>Bonjour et bienvenue sur DevGames</h1>
                <p>Si vous êtes ici, c'est que vous êtes, en quelque sorte interessé par la magie du développement Frontend ( HTML / CSS ) ! </p>
                <h3 style={{fontWeight: 'normal'}}>Parfait !!</h3>
                <p>Je voudrais vous prévenir de quelque chose... DevGames n'est pas un tuto interactif pour apprendre le développement web. C'est un site pour <strong style={{fontWeight: 'normal'}}>APPRENDRE</strong> le développement web. Le site est fait avec des principe de science qui vous mettront dans les meilleurs conditions pour apprendre et retenir.</p>
                <h2 style={{fontWeight: 'normal'}}>Êtes-vous prêt à commencer ?!!</h2>
                <p>Si oui, commencez maintenant en vous connectant ou en créant un compte</p>
            </span>
        ,
        type: 'read',
        isMinimize: false,
        level: 1,
        img: 'assets/icons/file.svg',
        position: {
            top: 3,
            left: 3
        },
        draggable: true,
        firstPage: true
    },

]


export const filesInFolderData = [
    {
        name: "Paramètre",
        content: [
            {
                name: "Se déconnecter",
                type: 'disconnect',
                isMinimize: false,
                img: 'assets/icons/disconnection.svg',
            },
            {
                name: "Changer de Mot de passe",
                type: 'changePassword',
                isMinimize: false,
                img: 'assets/icons/changepassword.svg',
            },
            {
                name: "Changer d'email",
                type: 'changeEmail',
                isMinimize: false,
                img: 'assets/icons/changemail.svg',
            },
            {
                name: "Supprimer son compte",
                type: 'removeAccount',
                isMinimize: false,
                img: 'assets/icons/removeuser.svg',
            },
        ],
    },
]