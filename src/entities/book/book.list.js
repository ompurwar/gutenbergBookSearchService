export default function BuildMakeBookList({ MakeBook }) {
    const cash_flow_collection = 'Cash_Flow_Store';
    function DocToBook(book_info) {
        return MakeBook({
            ...book_info
        });
    }

    const createTopicMaker = (column, prefix = true) => (criteria = []) => {
        let subjectQuery = criteria.map(val => { return `(LOWER(s.name) LIKE ("%${val.toLowerCase()}%"))` }) || [];
        let bookshelfQuery = criteria.map(val => `LOWER(bsh.name) LIKE '%${val.toLowerCase()}%'`) || [];
        let topicQuery = `((\n${subjectQuery.join(' OR ')}) \nOR (${bookshelfQuery.join(' OR ')}\n))`;

        return topicQuery
    }
    function createQueryMaker(column, prefix = true) {
        return (criteria = []) =>
            `(${criteria.map(val => `LOWER(${column}) LIKE ('%${val.toUpperCase()}%')`).join(' OR ')})`;
    }

    function createInQueryMaker(column, prefix = true) {
        return (criteria = []) => {
            return `${prefix ? column + '' : ''} IN (${criteria.map(_ => typeof _ === 'string' ? `'${_}'` : _).join(',')})`;
        }
    }

    return function MakeBookList({ database }) {
       
        const queryMakers = {
            'topic': createTopicMaker('s'),
            'language': createInQueryMaker('l.code'),
            'author': createQueryMaker('a.name'),
            'mimeType': createInQueryMaker('f.mime_type'),
            'bookId': createInQueryMaker('b.gutenberg_id'),
            'title': createQueryMaker('b.title'),
        };

        const createWhereClause = (filter = []) => {

            let whereClause = filter.map(({ filed, criteria = [] }) => {
                // console.log('[createWhereClause]', filed, criteria)
                if (criteria.length === 0) return '';
                const queryMaker = queryMakers[filed];
                return queryMaker ? `(${queryMaker(criteria)})` : '';
            });

            return `${whereClause.length ? 'WHERE ' + whereClause.filter(_ => _).join(' AND ') : ''}`;
        };

        const tableJoin = `books_book AS b
        LEFT JOIN books_book_authors AS ba ON ba.book_id = b.id
        LEFT JOIN books_author AS a ON a.id = ba.author_id
        LEFT JOIN books_book_subjects AS bsub ON bsub.book_id = b.id
        LEFT JOIN books_subject AS s ON s.id = bsub.subject_id
        LEFT JOIN books_book_languages AS bl ON bl.book_id = b.id
        LEFT JOIN books_language AS l ON l.id = bl.language_id
        LEFT JOIN books_book_bookshelves AS bbsh ON bbsh.book_id = b.id
        LEFT JOIN books_bookshelf AS bsh ON bsh.id = bbsh.bookshelf_id
        LEFT JOIN books_format AS f ON f.book_id = b.id AND f.mime_type IS NOT NULL `;

        async function getBookCounts({ filters = [] }) {
            const whereClause = createWhereClause(filters);
            let bookCountQuery = `(Select COUNT(distinct b.id, b.title,b.download_count,l.code) as bookCount FROM ${tableJoin} ${whereClause})`;

            let [count] = await database.query(bookCountQuery);
            return { bookCount: (count[0] && count[0].bookCount) || 0 };
        }

        async function searchBooksAdvance({ filters = [], pageNumber = 1, itemsPerPage = 5 }) {

            const whereClause = createWhereClause(filters);
            let offset = (pageNumber - 1) * itemsPerPage;

            // same book with different language should be treated differently
            const searchQuery = `
            SELECT 
            b.gutenberg_id as bookId,
            b.id as sysBookId, 
            b.title, 
            l.code as language, 
            GROUP_CONCAT(DISTINCT CONCAT('[', s.id, ',\\"' , s.name , '\\"]'))  as subjects,
            GROUP_CONCAT(DISTINCT CONCAT('[', bsh.id, ',\\"' , bsh.name , '\\"]'))  as bookshelves,
            GROUP_CONCAT(DISTINCT CONCAT('[',a.id,',\\"', a.name , '\\",' , COALESCE(a.birth_year, '"NA"'), ',', COALESCE(a.death_year,'"NA"'), ']')) as authors,
            GROUP_CONCAT(DISTINCT CONCAT('[\\"', f.mime_type , '\\",\\"' , f.url, '\\"]')) as formats
            FROM ${tableJoin} 
            ${whereClause}            
            GROUP BY  b.id, b.title, b.download_count, l.code 
            ORDER BY b.download_count DESC
            LIMIT  ${itemsPerPage} OFFSET ${offset}`;

            // console.log(searchQuery, filters)
            let [rows] = await database.query(searchQuery);


            // console.time('toBeParsed');


            // Constants to be used in parsing
            const fieldsToBeParsed = ['formats', 'authors', 'bookshelves', 'subjects'];
            const fieldToKeyMap = {
                'formats': ['mimeType', 'url'],
                'authors': ['id', 'name', 'birthYear', 'deathYear'],
                'bookshelves': ['id', 'name'],
                'subjects': ['id', 'name']
            };
            function convertArrayToObject(array, field) {
                return array.reduce((obj, val, idx) => {
                    obj[fieldToKeyMap[field][idx]] = val;
                    return obj;
                }, {});
            }

            const books = rows.map(row => {
                fieldsToBeParsed.forEach(field => {
                    try {
                        if (row[field] && row[field].length) {
                            const parsedField = JSON.parse(`[${row[field]}]`);
                            row[field] = parsedField.map(arr => convertArrayToObject(arr, field));
                        } else {
                            row[field] = {};
                            console.log(`Empty or undefined field: ${field}`);
                        }
                    } catch (error) {
                        console.error(`Error parsing field '${field}' in row: `, row);
                        console.error(error.message);
                    }
                });
                return row;
            });



            // console.timeEnd('toBeParsed');
            return { books: rows };
        }

        return {
            getBookCounts,
            searchBooksAdvance
        }
    };

}



