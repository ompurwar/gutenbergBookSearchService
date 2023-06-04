export class UniqueConstraintError extends Error {
    constructor(value) {
        super(`${value} must be unique.`)
        this.code = 500;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UniqueConstraintError);
        }
    }
}

export class InvalidPropertyError extends Error {
    constructor(msg) {
        super(msg)
        this.code = 400;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidPropertyError);
        }
    }
}

export class RequiredParameterError extends Error {
    constructor(param) {
        super(`${param} can not be null or undefined.`)
        this.code = 400;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequiredParameterError);
        }
    }
}
export class DbInsertFailedError extends Error {
    constructor(param) {
        super(`Db insert failed on ${param} collection`)
        this.code = 500;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DbInsertFailedError);
        }
    }
}
export class DbUpdateFailedError extends Error {
    constructor(param) {
        super(`Db update failed on ${param} collection`)
        this.code = 500;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DbUpdateFailedError);
        }
    }
}
export class UserNotFoundByEmailError extends Error {
    constructor(param) {
        super(`User with email: ${param} doesn't exist.`)
        this.code = 404;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotFoundByEmailError);
        }
    }
}
export class UnauthorizedAccess extends Error {
    constructor(param) {
        super(`User with email: ${param} have supplied wrong password`)
        this.code = 401;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedAccess)
        }
    }
}
export class InvalidAuthTokenError extends Error {
    constructor(param) {
        super(`Oops! Invalid Auth token!`)
        this.code = 401;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidAuthTokenError);
        }
    }
}
export class InvalidOperationError extends Error {
    constructor(action) {
        super(`Invalid Operation: ${action}`)
        this.code = 401;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidOperationError);
        }
    }
}

export class DuplicateEmailError extends Error {
    constructor(action) {
        super(`Invalid Operation: ${action}`)
        this.code = 601;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicateEmailError);
        }
    }
}