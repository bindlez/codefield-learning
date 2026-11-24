import { ParseResult } from "./deserialize.js";
export * from "./location.js";
export * from "./source.js";
export * from "./visitor.js";
export * from "./nodes.js";
export type Options = import("./parsePrism.js").Options;
/**
 * Load the prism wasm module and return a parse function. The function takes
 * the source as bytes in the encoding it is written in, which is what the
 * parser reads and what the locations in the result are offsets into.
 *
 * @typedef {import("./parsePrism.js").Options} Options
 *
 * @returns {Promise<(source: Uint8Array, options?: Options) => ParseResult>}
 */
export declare function loadPrism(): Promise<(source: Uint8Array, options?: Options) => ParseResult>;
