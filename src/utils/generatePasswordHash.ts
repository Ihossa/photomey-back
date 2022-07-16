import bcrypt from "bcrypt";

export default (password: string ='') => {
    return new Promise((res, rej) => {
        bcrypt.genSalt(function (err, salt) {
            if(err) {
                return rej(err)
            }

            bcrypt.hash(password, salt, function (err, hash){
                if(err) return rej(err)
                res(hash)
            })
        })
    })
}