class ErrorMsg {

    Success() {
    return 'Operation completed successfully.';
    }

    Fail() {
        return 'Operation failed.';
    }

    CorectData(){
        return 'Please pass correct data.';
    }

    AlreadyExist(whatAlreadyExist){
        return `${whatAlreadyExist} already exist.`;
    }

    CantFind(whatCantFind){
        return `Error. Can't find ${whatCantFind}.`;
    }
}

module.exports = new ErrorMsg;
