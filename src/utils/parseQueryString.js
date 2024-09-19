const parseQueryString = (queryString) => {
    if (!queryString) {
        return {};
    }

    const queries = queryString.substring(1).split('&');

    const params = queries.reduce((accumulator, el) => {
        const [key, value] = el.split('=');
        return { ...accumulator, [key]: value };
    }, {});

    return params;
};

export default parseQueryString;
