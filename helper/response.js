function response(message, data, success) {
    return {
        message: formatMesaage(message),
        data: data || null,
        success: success == null ? true : success,
    };
}

function formatMesaage(str) {
    if (!str) return '';

    // Make first letter capitial
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = response;
