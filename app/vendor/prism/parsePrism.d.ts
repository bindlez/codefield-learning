import { ParseResult } from "./deserialize.js";
export type Scope = {
    locals?: string[];
    forwarding?: string[];
};
export type Options = {
    filepath?: string;
    line?: number;
    encoding?: string | false;
    frozen_string_literal?: boolean;
    command_line?: string;
    version?: string;
    main_script?: boolean;
    partial_script?: boolean;
    scopes?: (string[] | Scope)[];
};
/**
 * Parse the given source code represented as a Uint8Array.
 *
 * @typedef {{
 *   locals?: string[],
 *   forwarding?: string[]
 * }} Scope
 *
 * @typedef {{
 *   filepath?: string,
 *   line?: number,
 *   encoding?: string | false,
 *   frozen_string_literal?: boolean,
 *   command_line?: string,
 *   version?: string,
 *   main_script?: boolean,
 *   partial_script?: boolean,
 *   scopes?: (string[] | Scope)[]
 * }} Options
 *
 * @param {WebAssembly.Exports} prism
 * @param {Uint8Array} source
 * @param {Options} options
 * @returns {ParseResult}
 */
export declare function parsePrism(prism: WebAssembly.Exports, source: Uint8Array, options?: Options): ParseResult;
export type PackValues = (number | string)[];
export type PackTemplate = string[];
