class Msgs {

    Success() {
    return 'Operation completed successfully.';
    }

    Fail() {
        return 'Operation failed.';
    }

    Empty(field){
        return `${field} can not be empty.`;
    }

    LatinLetters(){
        return 'You can enter only Latin letters.';
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

module.exports = new Msgs;
