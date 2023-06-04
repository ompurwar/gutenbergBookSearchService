
import RequiredParam from '../../utils/required-params.js';
import { InvalidPropertyError } from "../../utils/errors.js";
import { TraverseObj } from "../../utils/traverse_object.js";

import MakeDb from "../../db/index.js";
import BuildMakeBookList from './book.list.js';
import { BuildMakeBook } from './book.entity.js';

let MakeBook = BuildMakeBook({ RequiredParam, InvalidPropertyError, TraverseObj })
let MakeBookList = BuildMakeBookList({ MakeBook });
let book_list = MakeBookList({ database: await MakeDb() });


export {
    book_list
}