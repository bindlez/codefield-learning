import { Source } from "./source.js";
/**
 * A location in the source code. Locations are stored as byte offsets into the
 * source, because bytes are the unit that the parser itself works in. They hold
 * a pointer to the source they came from so that they can resolve line numbers,
 * columns, and the source code that they represent.
 */
export declare class Location {
    #private;
    /**
     * The byte offset from the beginning of the source where this location
     * starts.
     *
     * @type {number}
     */
    startOffset: number;
    /**
     * The length of this location in bytes.
     *
     * @type {number}
     */
    length: number;
    /**
     * Construct a new Location.
     *
     * @param {Source} source
     * @param {number} startOffset
     * @param {number} length
     */
    constructor(source: Source, startOffset: number, length: number);
    /**
     * The byte offset from the beginning of the source where this location ends.
     *
     * @returns {number}
     */
    endOffset(): number;
    /**
     * The line number where this location starts.
     *
     * @returns {number}
     */
    startLine(): number;
    /**
     * The line number where this location ends.
     *
     * @returns {number}
     */
    endLine(): number;
    /**
     * The column in bytes where this location starts from the start of its line.
     *
     * @returns {number}
     */
    startColumn(): number;
    /**
     * The column in bytes where this location ends from the start of its line.
     *
     * @returns {number}
     */
    endColumn(): number;
    /**
     * The column in code units where this location starts from the start of its
     * line, counted in the given position encoding.
     *
     * @param {"utf-8" | "utf-16" | "utf-32"} encoding
     * @returns {number}
     */
    startCodeUnitsColumn(encoding?: "utf-8" | "utf-16" | "utf-32"): number;
    /**
     * The column in code units where this location ends from the start of its
     * line, counted in the given position encoding.
     *
     * @param {"utf-8" | "utf-16" | "utf-32"} encoding
     * @returns {number}
     */
    endCodeUnitsColumn(encoding?: "utf-8" | "utf-16" | "utf-32"): number;
    /**
     * The source code that this location represents.
     *
     * @param {TextDecoder | null} decoder
     * @returns {string}
     */
    slice(decoder?: TextDecoder | null): string;
}
