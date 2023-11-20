import Files, {FileInFolder} from "@/component/Files";
import {filesInFolderData} from "@/data/fileData";

export const folderData = [
    {
        name: "Paramètre",
        type: 'settings',
        content: (
            filesInFolderData.map(folder => folder.name === 'Paramètre' ? (folder.content.map(contentSelect => <FileInFolder {...contentSelect} />)): null)
        ),
        level: 0,
        img: 'assets/icons/settingsFolder.svg',
        position: {
            top: 83,
            left: 99
        },
        draggable: false
    },

]
