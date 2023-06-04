import { SearchBooksUseCase } from "../../use_cases/books/index.js";
import { InvalidPropertyError } from "../../utils/errors.js";
async function SearchBookController(http_request) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (http_request.method === 'POST' && !http_request.body.data)
        throw new InvalidPropertyError('request body doesn\'t contain field \'data\'');

    let { method, query, params ,path,originalUrl} = http_request;
    console.log(query, params,originalUrl)
    let pageNumber = getPageNumber(query);
    const filters = createFilter(query);
console.log(path)
    // console.log(filters, '==============[pagenumber:', pageNumber)
    const result = await SearchBooksUseCase({ filters, pageNumber ,originalUrl})

    return {
        headers,
        status_code: 200,
        body: { data: result, status: 'success', error: null }
    }

}


const createFilter = (query = {}) => {
    const filters = [];

    let allowedQueryParams = {
        bookId: Number,
        language: String,
        author: String,
        title: String,
        mimeType: String,
        topic: String,
    }


    for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
            const element = query[key];
            if (allowedQueryParams[key]) {
                console.log(key, element.split(','));
                filters.push({
                    filed: key,
                    criteria: element.split(',').map(allowedQueryParams[key])
                });
            }
        }
    }

    return filters;
}
const getPageNumber = (query) => {
    let pageNumber = 1;
    if (query && query.pageNumber) {

        let val = query.pageNumber.split(',');
        console.log(val)
        if (/\d/.test(val[0])) {
            pageNumber = parseInt(val[0]);
            if (pageNumber < 1)
                throw new InvalidPropertyError(' pageNumber cannot be less than one');
        }
    }
    return pageNumber;
}
export default SearchBookController;

