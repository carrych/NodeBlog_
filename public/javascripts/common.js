(() => {
// some functionality for btns and items of  admin menu
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
