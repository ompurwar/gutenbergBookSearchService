import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { config } from 'dotenv';
config()

import MakeDb from "../../db/index.js";
import { BuildMakeBook } from "./book.entity.js";
import BuildMakeBookList from "./book.list.js";
import RequiredParam from '../../utils/required-params.js';
import { InvalidPropertyError } from "../../utils/errors.js";
// import BuildMakeCashFlowList from "./cashflow.list.js";
import { TraverseObj } from "../../utils/traverse_object.js";
import { IsPureObj, GetCollection, SetCollection, GenerateRandomString } from "../../utils/utils.js";
import { UniqueConstraintError } from "../../utils/errors.js";
import { DbUpdateFailedError } from "../../utils/errors.js";
// import MakeDb from "../../db/index.js";

let MakeBook = BuildMakeBook({ RequiredParam, GenerateRandomString, InvalidPropertyError, TraverseObj })
let MakeBookList = BuildMakeBookList({ MakeBook });
let book_list = MakeBookList({ database: await MakeDb() });
book_list.searchBooksAdvance({
    filter: [{
        filed: 'bookId',
        criteria: [1260, 10814, 1480]
    }
        ,
    {
        filed: 'language',
        criteria: ['en', 'fr']
    },
    // {
    //     filed: 'author',
    //     criteria: ['Louisa']
    // },
    // {
    //     filed: 'title',
    //     criteria: ['Men']
    // },
    {
        filed: 'mimeType',
        criteria: ['text/html', 'application/epub+zip']
    },
    {
        filed: 'topic',
        criteria: ['Spanish', 'school']
    }],
    pageNumber: 1,
    itemPerPage: 25
}).then(data => {
    console.log(data)
})