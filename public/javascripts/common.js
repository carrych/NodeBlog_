(() => {
// change bg color when we get file
    function adminMenu() {
        let inputWithFile = document.querySelectorAll('.form-control-file');

        inputWithFile.forEach((file) => {
            file.addEventListener('change', () => {
                if (file.className === 'form-control-file')
                    file.className = 'form-control-file-green';
                else file.className = 'form-control-file';
            });
        });
    }

    window.onload = adminMenu;
})();
