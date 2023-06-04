
function BuildMakeBook({ RequiredParam, InvalidPropertyError, TraverseObj, GenerateRandomString }) {

    return function MakeBook(book_data = RequiredParam('book_data')) {
        let valid_book = Validate(book_data);

        const book = {
            ...valid_book
        };

 
        return Object.freeze(book);

    }

    // {
    //     "downloads": 1036,
    //     "gutenberg_id": 146,
    //     "genre": "School Stories",
    //     "total_count": 6,
    //     "title": "A Little Princess: Being the whole story of Sara Crewe now told for the first time",
    //     "author_name": "Burnett, Frances Hodgson",
    //     "language": "en",
    //     "subjects": "Boarding schools -- Fiction,London (England) -- Fiction,Orphans -- Fiction,Schools -- Fiction",
    //     "bookshelves": "Children's Literature,School Stories",
    //     "authors": [
    //       {
    //         "author_name": "Burnett, Frances Hodgson",
    //         "id": 69,
    //         "birth_year": 1849,
    //         "death_year": 1924
    //       }
    //     ],
    //     "formats": [
    //       {
    //         "mime_type": "application/epub+zip",
    //         "link": "http://www.gutenberg.org/ebooks/146.epub.noimages"
    //       }
    //     ]
    //   }

    function Validate({


      
        downloads = RequiredParam('downloads'),
        genre = RequiredParam('genre'),
        title = RequiredParam('title'),
        author_name = RequiredParam('author_name'),
        language = RequiredParam('language'),
        subjects = RequiredParam('subjects'),
        bookshelves = RequiredParam('bookshelves'),
        authors = RequiredParam('authors'),
        formats = RequiredParam('formats'),
        ...other_info


    } = {}) {




        return {
            // user_id,
            downloads,
            genre,
            title,
            author_name,
            language,
            subjects,
            bookshelves,
            authors,
            formats,
            ...other_info
        }
    }
}
const Book_CONSTANTS = {

};

export { BuildMakeBook, Book_CONSTANTS }