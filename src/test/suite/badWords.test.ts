import * as vscode from 'vscode';
import * as assert from 'assert';
import { getBadWords, splitWithIndex } from '../../utilities/badWords';

suite('badWords.ts test suite', () => {
    test('splitWithIndex splits properly with one word', () => {
        const lineOfText = {
            text: 'test'
        } as vscode.TextLine;

        const returnValue = splitWithIndex(lineOfText);

        assert.ok(returnValue.length === 1);
        const word = returnValue[0];

        assert.ok(word.word === 'test');
        assert.ok(word.indexInLine === 0);
    });

    test('splitWithIndex splits properly with more than one word', () => {
        const lineOfText = {
            text: 'this is a test'
        } as vscode.TextLine;

        const returnValue = splitWithIndex(lineOfText);

        assert.ok(returnValue.length === 4);
        const firstWord = returnValue[0];

        assert.ok(firstWord.word === 'this');
        assert.ok(firstWord.indexInLine === 0);

        const secondWord = returnValue[1];

        assert.ok(secondWord.word === 'is');
        assert.ok(secondWord.indexInLine === 5);   
        
        const thirdWord = returnValue[2];

        assert.ok(thirdWord.word === 'a');
        assert.ok(thirdWord.indexInLine === 8);

        const fourthWord = returnValue[3];

        assert.ok(fourthWord.word === 'test');
        assert.ok(fourthWord.indexInLine === 10);         
    });

    test('splitWithIndex splits properly when there are special characters', () => {
        const lineOfText = {
            text: '// a comment! Fun!'
        } as vscode.TextLine;

        const returnValue = splitWithIndex(lineOfText);

        assert.ok(returnValue.length === 3);
        const firstWord = returnValue[0];

        assert.ok(firstWord.word === 'a');
        assert.ok(firstWord.indexInLine === 3);

        const secondWord = returnValue[1];

        assert.ok(secondWord.word === 'comment');
        assert.ok(secondWord.indexInLine === 5);   
        
        const thirdWord = returnValue[2];

        assert.ok(thirdWord.word === 'Fun');
        assert.ok(thirdWord.indexInLine === 14);        
    });

    test('getBadWords returns an empty array if no bad words are found', () => {
        const lineOfText = {
            text: 'no bad words here!'
        } as vscode.TextLine;

        const returnValue = getBadWords(lineOfText);

        assert.ok(returnValue.length === 0);
    });

    test('getBadWords returns a populated array if a bad word is found', () => {
        const lineOfText = {
            text: `uh oh, poop is a bad word`
        } as vscode.TextLine;

        const returnValue = getBadWords(lineOfText);

        assert.ok(returnValue.length === 1);
        const badWord = returnValue[0];

        assert.ok(badWord.word === 'poop');
        assert.ok(badWord.indexInLine === 7);
    });

    test('getBadWords matches case insensitive', () => {
        const lineOfText = {
            text: 'FuCk'
        } as vscode.TextLine;

        const returnValue = getBadWords(lineOfText);

        assert.ok(returnValue.length === 1);
        const badWord = returnValue[0];

        assert.ok(badWord.indexInLine === 0);
        assert.ok(badWord.word === 'FuCk');
    });

    test('getBadWords returns a populated array if the same bad word is found twice', () => {
        const lineOfText = {
            text: `uh oh, poop is a bad word.  poop is still a bad word!`
        } as vscode.TextLine;

        const returnValue = getBadWords(lineOfText);

        assert.ok(returnValue.length === 2);
        const firstBadWord = returnValue[0];

        assert.ok(firstBadWord.word === 'poop');
        assert.ok(firstBadWord.indexInLine === 7);

        const secondBadWord = returnValue[1];

        assert.ok(secondBadWord.word === 'poop');
        assert.ok(secondBadWord.indexInLine === 28);
    });

    test('getBadWords returns a populated array if more than 1 bad word is found', () => {
        const lineOfText = {
            text: `uh oh, poop is a bad word.  So is shit`
        } as vscode.TextLine;

        const returnValue = getBadWords(lineOfText);

        assert.ok(returnValue.length === 2);
        const firstBadWord = returnValue[0];

        assert.ok(firstBadWord.word === 'poop');
        assert.ok(firstBadWord.indexInLine === 7);

        const secondBadWord = returnValue[1];

        assert.ok(secondBadWord.word === 'shit');
        assert.ok(secondBadWord.indexInLine === 34);
    });
});
