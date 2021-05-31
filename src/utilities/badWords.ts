import * as vscode from 'vscode';
import { badWords } from '../data/badWords';
import { WordWithIndex } from "../types/diagnostics";

/**
 * Breaks down a string into its individual words and maps an index representing where that word is in the larger line of text
 * @param lineOfText Line of text to be checked
 * @returns {WordWithIndex[]} An array representing each word in the lineOfText and an associated index
 */
export function splitWithIndex(lineOfText: vscode.TextLine): WordWithIndex[] {
    const { text } = lineOfText;
    const regex = /\W/g;
    
    let results = [] as WordWithIndex[];
    let m: RegExpExecArray | null = null;
    let p = 0;
    while (p = regex.lastIndex, m = regex.exec(text)) {
        const word = text.substring(p, m.index);

        if (!word) {
            continue;
        }

        results.push({
            word: word,
            indexInLine: p
        });
    }

    const word = text.substring(p);

    if (!!word) {
        results.push({
            word: word,
            indexInLine: p
        });
    }

    return results;
}

/**
 * Gets an array of bad words (as well as the index of each) within a line of text
 * @param lineOfText Line of text to be checked
 * @returns {WordWithIndex[]} an array of all bad words inside lineOfText and an associated index
 */
 export function getBadWords(lineOfText: vscode.TextLine): WordWithIndex[] {
    const foundBadWords = [] as WordWithIndex[];

    const splitLine = splitWithIndex(lineOfText);

    for (let splitLineIndex = 0; splitLineIndex < splitLine.length; splitLineIndex++) {
        const { word, indexInLine } = splitLine[splitLineIndex];
        if (badWords.find(badWord => badWord.toUpperCase() === word.toUpperCase())) {
            foundBadWords.push({
                word,
                indexInLine: indexInLine,
            });
        }
    }

    return foundBadWords;
 }