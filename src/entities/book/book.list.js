export default function BuildMakeBookList({ MakeBook, BOOK_CONSTANTS, UniqueConstraintError, DbUpdateFailedError }) {
    const cash_flow_collection = 'Cash_Flow_Store';
    function DocToBook(book_info) {
        return MakeBook({
            ...book_info
        });
    }
    return function MakeBookList({ database }) {
        const createTopicQuery = (criteria = []) => {
            let subjectQuery = criteria.map(val => `LOWER(s.name) LIKE ('%${val.toLowerCase()}%')`) || [];
            let bookshelfQuery = criteria.map(val => `LOWER(bsh.name) LIKE ('%${val.toLowerCase()}%')`) || [];
            let topicQuery = `((\n${subjectQuery.join(' OR ')}) \nOR (${bookshelfQuery.join(' OR ')}\n))`
            return topicQuery
        }

        const createBookIdQuery = (criteria = [], a = true) => {
            let bookIdQuery = `${a ? 'b.' : ''}gutenberg_id IN (${criteria.join(',')})`;
            return bookIdQuery
        }
        const createLanguageQuery = (criteria = []) => {
            let bookLangQuery = `l.code IN (${criteria.map(_ => `'${_}'`).join(',')})`;
            return bookLangQuery
        }
        const createAuthorQuery = (criteria = []) => {
            let bookAuthorQuery = criteria.map(val => `LOWER(a.name) LIKE ('%${val.toLowerCase()}%')`) || [];;
            return `(${bookAuthorQuery.join(' OR ')})`
        }
        // const createMineQuery = (criteria = []) => {
        //     let bookAuthorQuery = criteria.map(val => `f.mime_type = '${val}'`) || [];;
        //     return `(${bookAuthorQuery.join(' OR ')})`
        // }
        const createMineQuery = (criteria = []) => {
            let bookMineQuery = `f.mime_type IN (${criteria.map(_ => `'${_}'`).join(',')})`;
            return bookMineQuery
        }
        // const createMineQuery = (criteria = []) => {
        //     let bookMineQuery = `f.mime_type IN (${criteria.map(_ => `'${_}'`).join(',')})`;
        //     return bookMineQuery
        // }
        const createTitleQuery = (criteria = [], a = true) => {

            let bookTitleQuery = criteria.map(val => `LOWER(${a ? 'b.' : ''}title) LIKE lower('%${val}%')`) || [];
            return `(${bookTitleQuery.join(' OR ')})`;
        }

        const createWhereClause = (filter = [], a = false) => {
            let where = ''
            let whereClause = []
            if (filter.length) {

                whereClause = filter.map(({ filed, criteria = [] }) => {
                    console.log(filed, criteria);
                    if (criteria.length === 0) return '';

                    if (filed === 'topic') {
                        let topicQuery = createTopicQuery(criteria);
                        return topicQuery;
                    }

                    if (filed === 'language') {
                        let languageQuery = createLanguageQuery(criteria);
                        return languageQuery;
                    }

                    if (filed === 'bookId') {
                        let bookIdQuery = createBookIdQuery(criteria, a);
                        return bookIdQuery;
                    }
                    if (filed === 'author') {
                        let authorQuery = createAuthorQuery(criteria);
                        return authorQuery;
                    }
                    if (filed === 'title') {
                        let titleQuery = createTitleQuery(criteria, a);
                        return titleQuery;
                    }
                    if (filed === 'mimeType') {
                        let titleQuery = createMineQuery(criteria);
                        return titleQuery;
                    }
                })
            }
            whereClause.push('f.mime_type IS NOT NULL');
            console.log(whereClause)
            where = `${whereClause.length ? 'where ' + whereClause.filter(_ => _).join('\n AND ') : ''}`
            return where;
        };


        let tableJoin = `books_book AS b
        LEFT JOIN books_book_authors AS ba ON ba.book_id = b.id
        LEFT JOIN books_author AS a ON a.id = ba.author_id
        LEFT JOIN books_book_subjects AS bsub ON bsub.book_id = b.id
        LEFT JOIN books_subject AS s ON s.id = bsub.subject_id
        LEFT JOIN books_book_languages AS bl ON bl.book_id = b.id
        LEFT JOIN books_language AS l ON l.id = bl.language_id
        LEFT JOIN books_book_bookshelves AS bbsh ON bbsh.book_id = b.id
        LEFT JOIN books_bookshelf AS bsh ON bsh.id = bbsh.bookshelf_id
        LEFT JOIN books_format AS f ON f.book_id = b.id `;




        async function getBookCounts({ filters = [] }) {

            // console.log(filters)
            const whereClause = createWhereClause(filters);



            let bookCountQuery = ` (Select COUNT(distinct b.id ) as bookCount \tFROM ${tableJoin}\n ${whereClause} )`

            // console.log(`[Book counter query]\n============`, bookCountQuery)
            // return

            let [count] = await database.query(bookCountQuery);
            console.log(count)

            let bookCount = 0
            if (count[0] && count[0].bookCount) {
                bookCount = count[0].bookCount;
            }
            return { bookCount };

        }

        async function searchBooksAdvance({ filters = [], pageNumber = 1, itemsPerPage = 5 }) {
            let book_fileds = ['bookId', 'title'];
            book_fileds = []

            let tableJoin = `books_book AS b
            LEFT JOIN books_book_authors AS ba ON ba.book_id = b.id
            LEFT JOIN books_author AS a ON a.id = ba.author_id
            LEFT JOIN books_book_subjects AS bsub ON bsub.book_id = b.id
            LEFT JOIN books_subject AS s ON s.id = bsub.subject_id
            LEFT JOIN books_book_languages AS bl ON bl.book_id = b.id
            LEFT JOIN books_language AS l ON l.id = bl.language_id
            LEFT JOIN books_book_bookshelves AS bbsh ON bbsh.book_id = b.id
            LEFT JOIN books_bookshelf AS bsh ON bsh.id = bbsh.bookshelf_id
            LEFT JOIN books_format AS f ON f.book_id = b.id` ;

            // AND f.mime_type IS NOT NULL



            if (pageNumber < 1)
                pageNumber = 1;

            let offset = (pageNumber - 1) * (itemsPerPage);

            const whereClause = createWhereClause(filters);





            // let fullQuery = `SELECT
            // b.download_count as downloads,
            // bsh.name as genre,
            // b.gutenberg_id,
            // b.id,
            // b.title AS title,
            // l.code AS language,
            // GROUP_CONCAT(DISTINCT CONCAT('{ "id": ' , s.id , ',\"subject\": "', REPLACE(s.name, '"', '\\'') , '"}')) AS subjects,
            // GROUP_CONCAT(DISTINCT CONCAT('{"id": "', bsh.id, '", "name": "', bsh.name, '"}')) AS bookshelves,
            // GROUP_CONCAT(DISTINCT CONCAT('{"author_name": "', a.name, '", "id": ', a.id, ',"birth_year": ', a.birth_year, ',"death_year": ', a.death_year, '}')) AS authors,
            // GROUP_CONCAT(DISTINCT CONCAT('{"mime_type": "', f.mime_type, '", "link": "', f.url, '"}')) AS formats
            // FROM
            // ${tableJoin}
            // ${whereClause}
            // GROUP BY  b.id, b.title, b.download_count, l.code 
            // ORDER BY b.download_count DESC
            // LIMIT ${itemsPerPage} OFFSET ${offset}`;

            let fullQuery = `SELECT
            bsh.name as genre,
        
            b.title AS title,
            l.code AS language,
            GROUP_CONCAT(DISTINCT CONCAT('{ "id": ' , s.id , ',\"subject\": "', REPLACE(s.name, '"', '\\'') , '"}')) AS subjects,
            GROUP_CONCAT(DISTINCT CONCAT('{"id": "', bsh.id, '", "name": "', bsh.name, '"}')) AS bookshelves,
            GROUP_CONCAT(DISTINCT CONCAT('{"author_name": "', a.name, '", "id": ', a.id, ',"birth_year": ', a.birth_year, ',"death_year": ', a.death_year, '}')) AS authors,
            GROUP_CONCAT(DISTINCT CONCAT('{"mime_type": "', f.mime_type, '", "link": "', f.url, '"}')) AS formats
            FROM
            ${tableJoin}
            ${whereClause}
            GROUP BY  b.id, b.title, b.download_count, l.code 
            ORDER BY b.download_count DESC
            LIMIT ${itemsPerPage} OFFSET ${offset}`;




            // console.log(`[FUll query]\n================`, fullQuery)
            // console.log(`[Book counter query]\n============`, bookCountQuery)
            // return

            let [rows, fields] = await database.query(fullQuery);

            let books = rows.map(_ => {
                // the data is coming in string format  "{},{},{}"
                //  we meet to convert it to  "[{},{},{}]" and  than parse it
                //  the concat function has t limit of how much length it can concatenate in  which case it returns currepted data
                // needs to think of the solution
                const toBeParsed = [
                    'formats',
                    'authors',
                    'bookshelves',
                    'subjects'
                ];


                toBeParsed.forEach(field => {
                    try {
                        if (_[field] && _[field].length) {
                            _[field] = JSON.parse(`[${_[field]}]`);
                            _[field] = _[field].filter(_ => _); // removing null values
                        } else {
                            _[field] = [];
                        }

                    } catch (error) {

                        console.log(error.message)
                        console.log(field, _[field], _)
                    }
                })
           
                return _
            })


            // console.log(books);
            // console.log(JSON.stringify(books.slice(0, 3), null, 2))
            return { books };

        }

        async function findById(book_id) {
            const db = await database;

            return null;
        }

        return Object.freeze({

            searchBooksAdvance,
            getBookCounts,
            findById,
        })





    }
}


