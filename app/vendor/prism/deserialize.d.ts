import * as nodes from "./nodes.js";
import { Location } from "./location.js";
export type Comment = {
    type: number;
    location: Location;
};
export type MagicComment = {
    startLocation: Location;
    endLocation: Location;
};
export type ParseError = {
    type: string;
    message: string;
    location: Location;
    level: string;
};
export type ParseWarning = {
    type: string;
    message: string;
    location: Location;
    level: string;
};
export type ParseResult = {
    value: ProgramNode;
    comments: Comment[];
    magicComments: MagicComment[];
    errors: ParseError[];
    warnings: ParseWarning[];
};
/**
 * A comment in the source code.
 *
 * @typedef {{ type: number, location: Location }} Comment
 */
/**
 * A magic comment in the source code.
 *
 * @typedef {{ startLocation: Location, endLocation: Location }} MagicComment
 */
/**
 * An error in the source code.
 *
 * @typedef {{ type: string, message: string, location: Location, level: string }} ParseError
 */
/**
 * A warning in the source code.
 *
 * @typedef {{ type: string, message: string, location: Location, level: string }} ParseWarning
 */
/**
 * The result of parsing the source code.
 *
 * @typedef {{ value: ProgramNode, comments: Comment[], magicComments: MagicComment[], errors: ParseError[], warnings: ParseWarning[] }} ParseResult
 */
/**
 * The result of calling parse.
 */
export declare class ParseResult {
    /**
     * @type {nodes.ProgramNode}
     */
    value: nodes.ProgramNode;
    /**
     * @type {Comment[]}
     */
    comments: Comment[];
    /**
     * @type {MagicComment[]}
     */
    magicComments: MagicComment[];
    /**
     * @type {Location | null}
     */
    dataLoc: Location | null;
    /**
     * @type {ParseError[]}
     */
    errors: ParseError[];
    /**
     * @type {ParseWarning[]}
     */
    warnings: ParseWarning[];
    /**
     * @type {boolean}
     */
    continuable: boolean;
    /**
     * @param {nodes.ProgramNode} value
     * @param {Comment[]} comments
     * @param {MagicComment[]} magicComments
     * @param {Location | null} dataLoc
     * @param {ParseError[]} errors
     * @param {ParseWarning[]} warnings
     * @param {boolean} continuable
     */
    constructor(value: nodes.ProgramNode, comments: Comment[], magicComments: MagicComment[], dataLoc: Location | null, errors: ParseError[], warnings: ParseWarning[], continuable: boolean);
}
/**
 * Accept two Uint8Arrays, one for the source and one for the serialized format.
 * Return the AST corresponding to the serialized form.
 *
 * @param {Uint8Array} source
 * @param {Uint8Array} array
 * @returns {ParseResult}
 * @throws {Error}
 */
export declare function deserialize(source: Uint8Array, array: Uint8Array): ParseResult;
