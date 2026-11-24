/**
 * An object that can be used to decode a byte array into a string.
 *
 * @typedef {{ decode: (bytes: Uint8Array) => string }} Decoder
 */
export type Decoder = {
    decode: (bytes: Uint8Array) => string;
};
/**
 * Get a Decoder from the encoding name. If the encoding is not supported, a
 * decoder that treats each byte as a single character is returned.
 *
 * @param {string} name
 * @param {{ fatal: boolean }} options
 * @returns {Decoder}
 */
export declare function getDecoder(name: string, options?: {
    fatal: boolean;
}): Decoder;
