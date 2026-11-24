/**
 * A source of Ruby code that has been parsed. Locations hold a pointer to the
 * source they came from, which is what allows them to resolve line numbers,
 * columns, and the source code that they represent.
 */
export declare class Source {
    #private;
    /**
     * The bytes of the source code, in the encoding that it was parsed in.
     *
     * @type {Uint8Array}
     */
    bytes: Uint8Array;
    /**
     * The name of the encoding that the source code is in, as determined by the
     * parser options or by the encoding magic comment.
     *
     * @type {string}
     */
    encoding: string;
    /**
     * The line number that the source starts on.
     *
     * @type {number}
     */
    startLine: number;
    /**
     * The byte offset of the start of each line in the source code. The first
     * element is always 0 to mark the first line.
     *
     * @type {number[]}
     */
    offsets: number[];
    /**
     * Construct a new Source.
     *
     * @param {Uint8Array} bytes
     * @param {string} encoding
     * @param {number} startLine
     * @param {number[]} offsets
     */
    constructor(bytes: Uint8Array, encoding: string, startLine: number, offsets: number[]);
    /**
     * Decode the given byte range of the source code into a string. Because a
     * byte range can begin or end in the middle of a multi-byte character, bytes
     * that do not form a whole character are decoded into replacement
     * characters.
     *
     * @param {number} byteOffset
     * @param {number} length
     * @param {TextDecoder | null} decoder
     * @returns {string}
     */
    slice(byteOffset: number, length: number, decoder?: TextDecoder | null): string;
    /**
     * The line number that the given byte offset is on.
     *
     * @param {number} byteOffset
     * @returns {number}
     */
    line(byteOffset: number): number;
    /**
     * The byte offset of the start of the line that the given byte offset is on.
     *
     * @param {number} byteOffset
     * @returns {number}
     */
    lineStart(byteOffset: number): number;
    /**
     * The byte offset of the end of the line that the given byte offset is on.
     *
     * @param {number} byteOffset
     * @returns {number}
     */
    lineEnd(byteOffset: number): number;
    /**
     * The column in bytes of the given byte offset from the start of its line.
     *
     * @param {number} byteOffset
     * @returns {number}
     */
    column(byteOffset: number): number;
    /**
     * The column in code units of the given byte offset from the start of its
     * line, counted in the given position encoding. A code unit is the smallest
     * unit of an encoding form, so utf-8 counts bytes, utf-16 counts sixteen bit
     * units where characters outside the basic multilingual plane take two, and
     * utf-32 counts whole codepoints.
     *
     * These are the three position encodings of the language server protocol,
     * spelled the way the protocol spells them, so a negotiated value can be
     * passed straight through. It defaults to utf-16 because that is what the
     * protocol defaults to.
     *
     * The prefix of the line is decoded through this source's own encoding
     * first, so a given character resolves to the same column no matter which
     * encoding the source was parsed in.
     *
     * @param {number} byteOffset
     * @param {"utf-8" | "utf-16" | "utf-32"} encoding
     * @returns {number}
     */
    codeUnitsColumn(byteOffset: number, encoding?: "utf-8" | "utf-16" | "utf-32"): number;
    /**
     * Binary search through the offsets to find the index of the line that the
     * given byte offset is on.
     *
     * @param {number} byteOffset
     * @returns {number}
     */
    findLine(byteOffset: number): number;
}
