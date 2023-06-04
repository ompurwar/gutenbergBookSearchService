
export function MakeSearchBooksUseCase({ book_list, InvalidOperationError }) {




    return async function SearchBooks({ filters = [], pageNumber = 1, originalUrl }) {
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

        return {
            bookCount: countResult.bookCount,
            books,
            currentPageNumber: pageNumber,
            prev,
            next
        }
    };

    function hasNextPage(perPage, totalCount, currentPage) {
        const totalPages = Math.ceil(totalCount / perPage);
        return currentPage < totalPages;
    }


    // return async function SearchBooks({ filters = [], pageNumber = 1, originalUrl }) {
    //     const itemsPerPage = 25;
    //     console.log(pageNumber, `${process.env.SERVER_END_POINT}${originalUrl}`)
    //     let parsedUrl = new URL(`${process.env.SERVER_END_POINT}${originalUrl}`);

    //     // Modify existing parameter
    //     let countResult = await book_list.getBookCounts({ filters });
    //     if (hasNextPage(itemsPerPage, countResult.bookCount, pageNumber))
    //         parsedUrl.searchParams.set('pageNumber', pageNumber + 1);

    //     // // Add new parameter
    //     // parsedUrl.searchParams.append('param2', 'value2');
    //     let next = parsedUrl.toString();
    //     if (pageNumber > 1)
    //         parsedUrl.searchParams.set('pageNumber', pageNumber - 1);
    //     else {
    //         parsedUrl.searchParams.set('pageNumber', pageNumber);
    //     }
    //     let prev = parsedUrl.toString()
    //     console.log(parsedUrl.toString());
    //     let { books } = await book_list.searchBooksAdvance({ filters, pageNumber, itemsPerPage });
    //     return {
    //         bookCount: countResult.bookCount,
    //         books,
    //         currentPageNumber: pageNumber,
    //         prev,
    //         next
    //     }
    // };

    // // throw new InvalidOperationError('Common Collection not found');

    // function hasNextPage(perPage, totalCount, currentPage) {
    //     const totalPages = Math.ceil(totalCount / perPage);
    //     return currentPage < totalPages;
    // }
}