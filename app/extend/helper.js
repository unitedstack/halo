'use strict';

const cp = require('child_process');
const _ = require('lodash');
const util = require('util');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

module.exports = {
  _, uuid,
  password: {
    hash: async (originalPassword, saltRounds = 10) => {
      return await bcrypt.hash(originalPassword, saltRounds);
    },
    compare: async (originalPassword, hashPassword) => {
      return await bcrypt.compare(originalPassword, hashPassword);
    },
  },
  pagination: (data = [], page = 1, limit = 10) => {
    let prev = null,
      next = null,
      count = 0;

    if (!Array.isArray(data)) {
      throw new TypeError('First argument must be an array.');
    }

    if (limit === '0' || limit === 0) {
      limit = 0;
      count = data.length;
      return { data, prev, next, count, page, limit };
    }

    limit = limit > 0 ? parseInt(limit, 10) : 10;
    page = page > 0 ? parseInt(page, 10) : 1;
    count = data.length;
    prev = page > 1 ? page - 1 : null;
    next = count > page * limit ? page + 1 : null;

    const start = (page - 1) * limit;
    const end = start + limit;
    data = data.slice(start, end);

    return { data, prev, next, count, page, limit };
  },
  exec: util.promisify(cp.exec),
  xor(oldArr, newArr) {
    if (!Array.isArray(oldArr) || !Array.isArray(newArr)) {
      throw new TypeError('Both arguments must be array.');
    }
    oldArr = Array.from(new Set(oldArr));
    newArr = Array.from(new Set(newArr));

    return {
      toDel: _.pullAll(_.union(oldArr, newArr), newArr),
      toAdd: _.pullAll(_.union(oldArr, newArr), oldArr),
    };
  },

};
