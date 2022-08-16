const noop = () => {};
const NO_PARAMS = {};
const NO_HEADERS = {};

function request ({
    method = 'GET',
    url,
    type = 'json',
    params = NO_PARAMS,
    headers = NO_HEADERS,
    body,
    checkStatusInResponse = false,
    onSuccess = noop,
    onError = noop,
}) {
    const req = new XMLHttpRequest();

    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();

    req.open(method, url + (queryString ? `?${queryString}` : ''));

    Object.keys(headers).forEach((key) => {
        req.setRequestHeader(key, headers[key]);
    });
    req.responseType = type;

    req.onload = function(event) {
        const target = event.target;

        if (target.status !== 200) {
            onError(target.statusText);

            return;
        }

        if (checkStatusInResponse && target.response.status !== 'ok') {
            onError(target.statusText);

            return;
        }

        onSuccess(target.response);
    }

    req.onerror = function() {
        onError();
    }

    req.send(body);
}