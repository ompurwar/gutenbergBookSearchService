import { createCacheClient } from "../../cache/index.js";
let options = {}
if (process.env.NODE_ENV === 'PROD') {
    options = {
        password: process.env.REDIS_PASS,
        socket: {
            host: process.env.REDIS_SERVER,
            port: process.env.REDIS_PORT
        }
    }
}
if (process.env.NODE_ENV === 'DEV') {
    options = {
        url: process.env.REDIS_SERVER
    }
}
// console.log(options)
const cache = await createCacheClient(options);
// console.log("connected");




// import { createClient } from 'redis';


// let redisConfig = {}
// if (process.env.NODE_ENV = 'PROD') {
//     redisConfig = {

//         password: process.env.REDIS_PASS,
//         socket: {
//             host: process.env.REDIS_SERVER,
//             port: process.env.REDIS_PORT
//         }
//     }
// }
// if (process.env.NODE_ENV = 'DEV') {
//     redisConfig = {
//         url: process.env.REDIS_SERVER
//         // password: process.env.REDIS_PASS,
//         // socket: {
//         //     host: process.env.REDIS_SERVER,
//         //     port: process.env.REDIS_PORT
//         // }
//     }
// }
// const client = createClient(redisConfig);

// client.on('error', err => console.log('Redis Client Error', err));
// await client.connect();

// // await client.set('key', 'ahskdhaskdasldalsdlkad');
// // const value = await client.get('key');

// // console.log(value)
// // await client.disconnect();



export function MakeSearchBooksUseCase({ book_list, InvalidOperationError }) {



    return async function SearchBooks({ filters = [], pageNumber = 1, originalUrl }) {

        // console.log(originalUrl)
        let result;
        const useCache = true;
        if (useCache)
            await cache.get(originalUrl)
        if (result) return result;


        const itemsPerPage = 25;
        const baseUrl = `${process.env.SERVER_END_POINT}${originalUrl}`;
        let parsedUrl = new URL(baseUrl);

        const countResult = await book_list.getBookCounts({ filters });
        const hasNext = hasNextPage(itemsPerPage, countResult.bookCount, pageNumber);
        const hasPrev = pageNumber > 1;

        // Setting the 'pageNumber' for the next page link
        parsedUrl.searchParams.set('pageNumber', hasNext ? pageNumber + 1 : pageNumber);
        const next = parsedUrl.toString();

        // Setting the 'pageNumber' for the previous page link
        parsedUrl.searchParams.set('pageNumber', hasPrev ? pageNumber - 1 : pageNumber);
        const prev = parsedUrl.toString();

        const { books } = await book_list.searchBooksAdvance({ filters, pageNumber, itemsPerPage });
        result = {
            bookCount: countResult.bookCount,
            books,
            currentPageNumber: pageNumber,
            prev,
            next
        }
        if (useCache)
            await cache.set(originalUrl, result)

        return result
    };
}

function hasNextPage(perPage, totalCount, currentPage) {
    const totalPages = Math.ceil(totalCount / perPage);
    return currentPage < totalPages;
}