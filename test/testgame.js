import { getRandomLoc } from './game.js';
var min_loc = 0;
var max_loc = 5;
let loc = getRandomLoc(min_loc, max_loc);
var smaller_loc = (loc < min_loc);
var bigger_loc = (loc > max_loc);

import { getRandomSize } from './game.js';
var min_size = 0;
var max_size = 5;
let size = getRandomSize(min_size, max_size);
var smaller_size = (size < min_size);
var bigger_size = (size > max_size);

const { assert } = require('chai');
const { describe, it } = require('mocha');

describe('game', () => {
    describe('getRandomLoc', () => {
        it('should return type int between min and max bounds'), () => {
            assert.typeOf(loc, 'int', `getRandomLoc() does not return an int`);
            assert.equal(smaller_loc, false);
            assert.equal(bigger_loc, false);
        }
    });
});

describe('game', () => {
    describe('getRandomSize', () => {
        it('should return type int between min and max bounds'), () => {
            assert.typeOf(size, 'int', `getRandomSize() does not return an int`);
            assert.equal(smaller_size, false);
            assert.equal(bigger_size, false);
        }
    });
});