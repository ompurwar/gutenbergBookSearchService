'use strict';
import serverless from 'serverless-http';
import app from './index.js'

export const book_search = serverless(app);