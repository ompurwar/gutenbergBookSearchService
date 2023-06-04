// import { createCacheClient } from "../../cache/index.js";
import { book_list } from "../../entities/book/index.js";
import { InvalidOperationError } from "../../utils/errors.js";
import RequiredParam from "../../utils/required-params.js";
import { MakeSearchBooksUseCase } from "./SearchBooks.js";


// console.log(options

const SearchBooksUseCase = MakeSearchBooksUseCase({ book_list, InvalidOperationError, RequiredParam });


export { SearchBooksUseCase };

