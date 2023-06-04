import { GenerateHash, GenerateRandomString } from "./utils.js"

export default function CreateCredentials(password) {
    let salt = GenerateRandomString(10);
    let hash = GenerateHash(password, salt);
    return { salt,hash }
}


