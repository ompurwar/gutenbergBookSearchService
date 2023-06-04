
export default function IsValidEmail(email) {
    const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    return valid.test(email)
}