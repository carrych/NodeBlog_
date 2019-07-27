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

    IncorrectData(whatIncorrect){
        return `${whatIncorrect} incorrect`;
    }

    AlreadyExist(whatAlreadyExist){
        return `${whatAlreadyExist} already exist.`;
    }

    CantFind(whatCantFind){
        return `Error. Can't find ${whatCantFind}.`;
    }

    NotRegistred(whatNotRegistred){
        return `That ${whatNotRegistred} is not registered.`;
    }

    Log(inOrOut){
        return `You are logged ${inOrOut}`;
    }

    Login(){
        return `You just a guest. Please login`;
    }

    Admin(){
        return `You are not admin.`;
    }
}

module.exports = new Msgs;
