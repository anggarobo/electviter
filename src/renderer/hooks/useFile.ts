export default function useFile() {
    return {
        // onOpenFile: async () => {
        //     const filePaths = await window.electron.openFileDialog();
  
        //     if (filePaths.length > 0) {
        //         const filePath = filePaths[0];
                
        //         const content = await window.electron.readFile(filePath);
        //         const fileContent = document.getElementById('fileContent')
        //         if (fileContent) {
        //             fileContent.textContent = content
        //         }
        //         document.getElementById('fileContent').textContent = content;
        //     }
        // },
        // onSaveFile: async () => {
        //     const content = 'Hello, this is a test content!';
        //     const filePath = './file.txt';

        //     const result = await window.electron.writeFile(filePath, content);
        //     alert(result);
        // }
    }
}