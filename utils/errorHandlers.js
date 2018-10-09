
/**
 * Catch Errors
 * 
 * Thanks @wesbos - learn node course
 * Instead of using try{}catch(e){} in each controller, we can wrap the async controller functions in catchErrors
 */
exports.catchErrors = (fn) => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next)
    }
}

/**
 * Not found error
 * Thanks @wesbos
 * 
 * For handling 404s
 */
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
}

/**
 * log any errors
 * TODO: add sentry here
 */
exports.logError = (context, culprit, e) => {
    console.error(">>>>> ", culprit, e)
}