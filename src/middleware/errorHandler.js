function getErrorTitle(error) {
    let title;
    switch (error.status) {
        case 400:
            title = "Input invalid.";
            break;
        case 401:
            title = "Access unauthorized.";
            break;
        case 403:
            title = "Access forbidden.";
            break;
        case 404:
            title = "Resource not found.";
            break;
        case 500:
            title = "Server error";
            break;
        default:
            title = `Error ${error.status}`;
            break;
    }
    return title;
}


export function handleError(context, error) {
    context.dispatch('setGameIsLoading', {gameIsLoading: false});
    let title = getErrorTitle(error);
    context.commit('setError', {
        error: {
            status: true,
            message: error.message,
            error: title
        }
    });
    if (error.status === 401) {
        let error = context.getters.error;
        context.commit('resetState');
        context.commit('setError', {error: error});
    }
    console.log(error);
}

export function handleFetchError(store, error) {
    let title = getErrorTitle(error);
    store.dispatch('updateError',
        {
            status: true,
            message: error.message,
            error: title
        }
    )
}