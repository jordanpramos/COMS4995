import { getRandomLoc, getRandomSize } from '../game.js';

const minLoc = 0;
const maxLoc = 5;
const loc = getRandomLoc(minLoc, maxLoc);
const smallerLoc = (loc < minLoc);
const biggerLoc = (loc > maxLoc);
const minSize = 0;
const maxSize = 5;
const size = getRandomSize(minSize, maxSize);
const smallerSize = (size < minSize);
const biggerSize = (size > maxSize);

const { assert } = require('chai');
const { describe, it } = require('mocha');

describe('game', () => {
  describe('getRandomLoc', () => {
    it('should return type int between min and max bounds', () => {
      assert.typeOf(loc, 'int', `getRandomLoc() does not return an int`);
    });
  });
});

describe('game', () => {
  describe('getRandomLoc', () => {
    it('should return int above min', () => {
      assert.equal(smallerLoc, false);
    });
  });
});

describe('game', () => {
  describe('getRandomLoc', () => {
    it('should return type int below max', () => {
      assert.equal(biggerLoc, false);
    });
  });
});

describe('game', () => {
  describe('getRandomSize', () => {
    it('should return type int', () => {
      assert.typeOf(size, 'int', `getRandomSize() does not return an int`);
    });
  });
});

describe('game', () => {
  describe('getRandomSize', () => {
    it('should return int above min', () => {
      assert.equal(smallerSize, false);
    });
  });
});

describe('game', () => {
  describe('getRandomSize', () => {
    it('should return int below max', () => {
      assert.equal(biggerSize, false);
    });
  });
});
