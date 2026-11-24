import { Location } from "./location.js";
import * as visitors from "./visitor.js";
/**
 * Flags for arguments nodes.
 */
export declare const ArgumentsNodeFlags: {
    CONTAINS_FORWARDING: number;
    CONTAINS_KEYWORDS: number;
    CONTAINS_KEYWORD_SPLAT: number;
    CONTAINS_SPLAT: number;
    CONTAINS_MULTIPLE_SPLATS: number;
};
/**
 * Flags for array nodes.
 */
export declare const ArrayNodeFlags: {
    CONTAINS_SPLAT: number;
};
/**
 * Flags for call nodes.
 */
export declare const CallNodeFlags: {
    SAFE_NAVIGATION: number;
    VARIABLE_CALL: number;
    ATTRIBUTE_WRITE: number;
    IGNORE_VISIBILITY: number;
};
/**
 * Flags for nodes that have unescaped content.
 */
export declare const EncodingFlags: {
    FORCED_UTF8_ENCODING: number;
    FORCED_BINARY_ENCODING: number;
};
/**
 * Flags for integer nodes that correspond to the base of the integer.
 */
export declare const IntegerBaseFlags: {
    BINARY: number;
    DECIMAL: number;
    OCTAL: number;
    HEXADECIMAL: number;
};
/**
 * Flags for interpolated string nodes that indicated mutability if they are also marked as literals.
 */
export declare const InterpolatedStringNodeFlags: {
    FROZEN: number;
    MUTABLE: number;
};
/**
 * Flags for keyword hash nodes.
 */
export declare const KeywordHashNodeFlags: {
    SYMBOL_KEYS: number;
};
/**
 * Flags for while and until loop nodes.
 */
export declare const LoopFlags: {
    BEGIN_MODIFIER: number;
};
/**
 * Flags for parameter nodes.
 */
export declare const ParameterFlags: {
    REPEATED_PARAMETER: number;
};
/**
 * Flags for parentheses nodes.
 */
export declare const ParenthesesNodeFlags: {
    MULTIPLE_STATEMENTS: number;
};
/**
 * Flags for range and flip-flop nodes.
 */
export declare const RangeFlags: {
    EXCLUDE_END: number;
};
/**
 * Flags for regular expression and match last line nodes.
 */
export declare const RegularExpressionFlags: {
    IGNORE_CASE: number;
    EXTENDED: number;
    MULTI_LINE: number;
    ONCE: number;
    EUC_JP: number;
    ASCII_8BIT: number;
    WINDOWS_31J: number;
    UTF_8: number;
    FORCED_UTF8_ENCODING: number;
    FORCED_BINARY_ENCODING: number;
    FORCED_US_ASCII_ENCODING: number;
};
/**
 * Flags for shareable constant nodes.
 */
export declare const ShareableConstantNodeFlags: {
    LITERAL: number;
    EXPERIMENTAL_EVERYTHING: number;
    EXPERIMENTAL_COPY: number;
};
/**
 * Flags for string nodes.
 */
export declare const StringFlags: {
    FORCED_UTF8_ENCODING: number;
    FORCED_BINARY_ENCODING: number;
    FROZEN: number;
    MUTABLE: number;
};
/**
 * Flags for symbol nodes.
 */
export declare const SymbolFlags: {
    FORCED_UTF8_ENCODING: number;
    FORCED_BINARY_ENCODING: number;
    FORCED_US_ASCII_ENCODING: number;
};
export type RubyString = {
    value: string;
    encoding: string;
    validEncoding: boolean;
};
export type Node = (AliasGlobalVariableNode | AliasMethodNode | AlternationPatternNode | AndNode | ArgumentsNode | ArrayNode | ArrayPatternNode | AssocNode | AssocSplatNode | BackReferenceReadNode | BeginNode | BlockArgumentNode | BlockLocalVariableNode | BlockNode | BlockParameterNode | BlockParametersNode | BreakNode | CallAndWriteNode | CallNode | CallOperatorWriteNode | CallOrWriteNode | CallTargetNode | CapturePatternNode | CaseMatchNode | CaseNode | ClassNode | ClassVariableAndWriteNode | ClassVariableOperatorWriteNode | ClassVariableOrWriteNode | ClassVariableReadNode | ClassVariableTargetNode | ClassVariableWriteNode | ConstantAndWriteNode | ConstantOperatorWriteNode | ConstantOrWriteNode | ConstantPathAndWriteNode | ConstantPathNode | ConstantPathOperatorWriteNode | ConstantPathOrWriteNode | ConstantPathTargetNode | ConstantPathWriteNode | ConstantReadNode | ConstantTargetNode | ConstantWriteNode | DefNode | DefinedNode | ElseNode | EmbeddedStatementsNode | EmbeddedVariableNode | EnsureNode | ErrorRecoveryNode | FalseNode | FindPatternNode | FlipFlopNode | FloatNode | ForNode | ForwardingArgumentsNode | ForwardingParameterNode | ForwardingSuperNode | GlobalVariableAndWriteNode | GlobalVariableOperatorWriteNode | GlobalVariableOrWriteNode | GlobalVariableReadNode | GlobalVariableTargetNode | GlobalVariableWriteNode | HashNode | HashPatternNode | IfNode | ImaginaryNode | ImplicitNode | ImplicitRestNode | InNode | IndexAndWriteNode | IndexOperatorWriteNode | IndexOrWriteNode | IndexTargetNode | InstanceVariableAndWriteNode | InstanceVariableOperatorWriteNode | InstanceVariableOrWriteNode | InstanceVariableReadNode | InstanceVariableTargetNode | InstanceVariableWriteNode | IntegerNode | InterpolatedMatchLastLineNode | InterpolatedRegularExpressionNode | InterpolatedStringNode | InterpolatedSymbolNode | InterpolatedXStringNode | ItLocalVariableReadNode | ItParametersNode | KeywordHashNode | KeywordRestParameterNode | LambdaNode | LocalVariableAndWriteNode | LocalVariableOperatorWriteNode | LocalVariableOrWriteNode | LocalVariableReadNode | LocalVariableTargetNode | LocalVariableWriteNode | MatchLastLineNode | MatchPredicateNode | MatchRequiredNode | MatchWriteNode | ModuleNode | MultiTargetNode | MultiWriteNode | NextNode | NilNode | NoBlockParameterNode | NoKeywordsParameterNode | NumberedParametersNode | NumberedReferenceReadNode | OptionalKeywordParameterNode | OptionalParameterNode | OrNode | ParametersNode | ParenthesesNode | PinnedExpressionNode | PinnedVariableNode | PostExecutionNode | PreExecutionNode | ProgramNode | RangeNode | RationalNode | RedoNode | RegularExpressionNode | RequiredKeywordParameterNode | RequiredParameterNode | RescueModifierNode | RescueNode | RestParameterNode | RetryNode | ReturnNode | SelfNode | ShareableConstantNode | SingletonClassNode | SourceEncodingNode | SourceFileNode | SourceLineNode | SplatNode | StatementsNode | StringNode | SuperNode | SymbolNode | TrueNode | UndefNode | UnlessNode | UntilNode | WhenNode | WhileNode | XStringNode | YieldNode);
/**
 * An encoded Ruby string.
 *
 * @typedef {{ value: string, encoding: string, validEncoding: boolean }} RubyString
 */
/**
 * A generic node in the tree.
 *
 * @typedef {(AliasGlobalVariableNode|AliasMethodNode|AlternationPatternNode|AndNode|ArgumentsNode|ArrayNode|ArrayPatternNode|AssocNode|AssocSplatNode|BackReferenceReadNode|BeginNode|BlockArgumentNode|BlockLocalVariableNode|BlockNode|BlockParameterNode|BlockParametersNode|BreakNode|CallAndWriteNode|CallNode|CallOperatorWriteNode|CallOrWriteNode|CallTargetNode|CapturePatternNode|CaseMatchNode|CaseNode|ClassNode|ClassVariableAndWriteNode|ClassVariableOperatorWriteNode|ClassVariableOrWriteNode|ClassVariableReadNode|ClassVariableTargetNode|ClassVariableWriteNode|ConstantAndWriteNode|ConstantOperatorWriteNode|ConstantOrWriteNode|ConstantPathAndWriteNode|ConstantPathNode|ConstantPathOperatorWriteNode|ConstantPathOrWriteNode|ConstantPathTargetNode|ConstantPathWriteNode|ConstantReadNode|ConstantTargetNode|ConstantWriteNode|DefNode|DefinedNode|ElseNode|EmbeddedStatementsNode|EmbeddedVariableNode|EnsureNode|ErrorRecoveryNode|FalseNode|FindPatternNode|FlipFlopNode|FloatNode|ForNode|ForwardingArgumentsNode|ForwardingParameterNode|ForwardingSuperNode|GlobalVariableAndWriteNode|GlobalVariableOperatorWriteNode|GlobalVariableOrWriteNode|GlobalVariableReadNode|GlobalVariableTargetNode|GlobalVariableWriteNode|HashNode|HashPatternNode|IfNode|ImaginaryNode|ImplicitNode|ImplicitRestNode|InNode|IndexAndWriteNode|IndexOperatorWriteNode|IndexOrWriteNode|IndexTargetNode|InstanceVariableAndWriteNode|InstanceVariableOperatorWriteNode|InstanceVariableOrWriteNode|InstanceVariableReadNode|InstanceVariableTargetNode|InstanceVariableWriteNode|IntegerNode|InterpolatedMatchLastLineNode|InterpolatedRegularExpressionNode|InterpolatedStringNode|InterpolatedSymbolNode|InterpolatedXStringNode|ItLocalVariableReadNode|ItParametersNode|KeywordHashNode|KeywordRestParameterNode|LambdaNode|LocalVariableAndWriteNode|LocalVariableOperatorWriteNode|LocalVariableOrWriteNode|LocalVariableReadNode|LocalVariableTargetNode|LocalVariableWriteNode|MatchLastLineNode|MatchPredicateNode|MatchRequiredNode|MatchWriteNode|ModuleNode|MultiTargetNode|MultiWriteNode|NextNode|NilNode|NoBlockParameterNode|NoKeywordsParameterNode|NumberedParametersNode|NumberedReferenceReadNode|OptionalKeywordParameterNode|OptionalParameterNode|OrNode|ParametersNode|ParenthesesNode|PinnedExpressionNode|PinnedVariableNode|PostExecutionNode|PreExecutionNode|ProgramNode|RangeNode|RationalNode|RedoNode|RegularExpressionNode|RequiredKeywordParameterNode|RequiredParameterNode|RescueModifierNode|RescueNode|RestParameterNode|RetryNode|ReturnNode|SelfNode|ShareableConstantNode|SingletonClassNode|SourceEncodingNode|SourceFileNode|SourceLineNode|SplatNode|StatementsNode|StringNode|SuperNode|SymbolNode|TrueNode|UndefNode|UnlessNode|UntilNode|WhenNode|WhileNode|XStringNode|YieldNode)} Node
 */
/**
 * Represents the use of the `alias` keyword to alias a global variable.
 *
 *     alias $foo $bar
 *     ^^^^^^^^^^^^^^^
 */
export declare class AliasGlobalVariableNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    newName: Node;
    /**
     * @type Node
     */
    oldName: Node;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new AliasGlobalVariableNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} newName
     * @param {Node} oldName
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, newName: Node, oldName: Node, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `alias` keyword to alias a method.
 *
 *     alias foo bar
 *     ^^^^^^^^^^^^^
 */
export declare class AliasMethodNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    newName: Node;
    /**
     * @type Node
     */
    oldName: Node;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new AliasMethodNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} newName
     * @param {Node} oldName
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, newName: Node, oldName: Node, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an alternation pattern in pattern matching.
 *
 *     foo => bar | baz
 *            ^^^^^^^^^
 */
export declare class AlternationPatternNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    left: Node;
    /**
     * @type Node
     */
    right: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new AlternationPatternNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} left
     * @param {Node} right
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, left: Node, right: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&` operator or the `and` keyword.
 *
 *     left and right
 *     ^^^^^^^^^^^^^^
 */
export declare class AndNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    left: Node;
    /**
     * @type Node
     */
    right: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new AndNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} left
     * @param {Node} right
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, left: Node, right: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a set of arguments to a method or a keyword.
 *
 *     return foo, bar, baz
 *            ^^^^^^^^^^^^^
 */
export declare class ArgumentsNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    arguments_: Node[];
    /**
     * Construct a new ArgumentsNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} arguments_
     */
    constructor(nodeID: number, location: Location, flags: number, arguments_: Node[]);
    /**
     * True if this node has the CONTAINS_FORWARDING flag.
     *
     * @returns {boolean}
     */
    isContainsForwarding(): boolean;
    /**
     * True if this node has the CONTAINS_KEYWORDS flag.
     *
     * @returns {boolean}
     */
    isContainsKeywords(): boolean;
    /**
     * True if this node has the CONTAINS_KEYWORD_SPLAT flag.
     *
     * @returns {boolean}
     */
    isContainsKeywordSplat(): boolean;
    /**
     * True if this node has the CONTAINS_SPLAT flag.
     *
     * @returns {boolean}
     */
    isContainsSplat(): boolean;
    /**
     * True if this node has the CONTAINS_MULTIPLE_SPLATS flag.
     *
     * @returns {boolean}
     */
    isContainsMultipleSplats(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an array literal. This can be a regular array using brackets or a special array using % like %w or %i.
 *
 *     [1, 2, 3]
 *     ^^^^^^^^^
 */
export declare class ArrayNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    elements: Node[];
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new ArrayNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} elements
     * @param {Location | null} openingLoc
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, elements: Node[], openingLoc: Location | null, closingLoc: Location | null);
    /**
     * True if this node has the CONTAINS_SPLAT flag.
     *
     * @returns {boolean}
     */
    isContainsSplat(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an array pattern in pattern matching.
 *
 *     foo in 1, 2
 *            ^^^^
 *
 *     foo in [1, 2]
 *            ^^^^^^
 *
 *     foo in *bar
 *            ^^^^
 *
 *     foo in Bar[]
 *            ^^^^^
 *
 *     foo in Bar[1, 2, 3]
 *            ^^^^^^^^^^^^
 */
export declare class ArrayPatternNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    constant: Node | null;
    /**
     * @type Node[]
     */
    requireds: Node[];
    /**
     * @type Node | null
     */
    rest: Node | null;
    /**
     * @type Node[]
     */
    posts: Node[];
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new ArrayPatternNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} constant
     * @param {Node[]} requireds
     * @param {Node | null} rest
     * @param {Node[]} posts
     * @param {Location | null} openingLoc
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, constant: Node | null, requireds: Node[], rest: Node | null, posts: Node[], openingLoc: Location | null, closingLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a hash key/value pair.
 *
 *     { a => b }
 *       ^^^^^^
 */
export declare class AssocNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    key: Node;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location | null
     */
    operatorLoc: Location | null;
    /**
     * Construct a new AssocNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} key
     * @param {Node} value
     * @param {Location | null} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, key: Node, value: Node, operatorLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a splat in a hash literal.
 *
 *     { **foo }
 *       ^^^^^
 */
export declare class AssocSplatNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    value: Node | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new AssocSplatNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, value: Node | null, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents reading a reference to a field in the previous match.
 *
 *     $'
 *     ^^
 */
export declare class BackReferenceReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new BackReferenceReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a begin statement.
 *
 *     begin
 *       foo
 *     end
 *     ^^^^^
 */
export declare class BeginNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    beginKeywordLoc: Location | null;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type RescueNode | null
     */
    rescueClause: RescueNode | null;
    /**
     * @type ElseNode | null
     */
    elseClause: ElseNode | null;
    /**
     * @type EnsureNode | null
     */
    ensureClause: EnsureNode | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * Construct a new BeginNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} beginKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {RescueNode | null} rescueClause
     * @param {ElseNode | null} elseClause
     * @param {EnsureNode | null} ensureClause
     * @param {Location | null} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, beginKeywordLoc: Location | null, statements: StatementsNode | null, rescueClause: RescueNode | null, elseClause: ElseNode | null, ensureClause: EnsureNode | null, endKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a block argument using `&`.
 *
 *     bar(&args)
 *         ^^^^^
 */
export declare class BlockArgumentNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    expression: Node | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new BlockArgumentNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} expression
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, expression: Node | null, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a block local variable.
 *
 *     a { |; b| }
 *            ^
 */
export declare class BlockLocalVariableNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new BlockLocalVariableNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a block of ruby code.
 *
 *     [1, 2, 3].each { |i| puts x }
 *                    ^^^^^^^^^^^^^^
 */
export declare class BlockNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Node | null
     */
    parameters: Node | null;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new BlockNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {Node | null} parameters
     * @param {Node | null} body
     * @param {Location} openingLoc
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], parameters: Node | null, body: Node | null, openingLoc: Location, closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a block parameter of a method, block, or lambda definition.
 *
 *     def a(&b)
 *           ^^
 *     end
 */
export declare class BlockParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string | null
     */
    name: string | null;
    /**
     * @type Location | null
     */
    nameLoc: Location | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new BlockParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string | null} name
     * @param {Location | null} nameLoc
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string | null, nameLoc: Location | null, operatorLoc: Location);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a block's parameters declaration.
 *
 *     -> (a, b = 1; local) { }
 *        ^^^^^^^^^^^^^^^^^
 *
 *     foo do |a, b = 1; local|
 *            ^^^^^^^^^^^^^^^^^
 *     end
 */
export declare class BlockParametersNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ParametersNode | null
     */
    parameters: ParametersNode | null;
    /**
     * @type Node[]
     */
    locals: Node[];
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new BlockParametersNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ParametersNode | null} parameters
     * @param {Node[]} locals
     * @param {Location | null} openingLoc
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, parameters: ParametersNode | null, locals: Node[], openingLoc: Location | null, closingLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `break` keyword.
 *
 *     break foo
 *     ^^^^^^^^^
 */
export declare class BreakNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new BreakNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, arguments_: ArgumentsNode | null, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator on a call.
 *
 *     foo.bar &&= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class CallAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location | null
     */
    messageLoc: Location | null;
    /**
     * @type string
     */
    readName: string;
    /**
     * @type string
     */
    writeName: string;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new CallAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location | null} messageLoc
     * @param {string} readName
     * @param {string} writeName
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, messageLoc: Location | null, readName: string, writeName: string, operatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a method call, in all of the various forms that can take.
 *
 *     foo
 *     ^^^
 *
 *     foo()
 *     ^^^^^
 *
 *     +foo
 *     ^^^^
 *
 *     foo + bar
 *     ^^^^^^^^^
 *
 *     foo.bar
 *     ^^^^^^^
 *
 *     foo&.bar
 *     ^^^^^^^^
 */
export declare class CallNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location | null
     */
    messageLoc: Location | null;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * @type Location | null
     */
    equalLoc: Location | null;
    /**
     * @type Node | null
     */
    block: Node | null;
    /**
     * Construct a new CallNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {string} name
     * @param {Location | null} messageLoc
     * @param {Location | null} openingLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location | null} closingLoc
     * @param {Location | null} equalLoc
     * @param {Node | null} block
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, name: string, messageLoc: Location | null, openingLoc: Location | null, arguments_: ArgumentsNode | null, closingLoc: Location | null, equalLoc: Location | null, block: Node | null);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of an assignment operator on a call.
 *
 *     foo.bar += baz
 *     ^^^^^^^^^^^^^^
 */
export declare class CallOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location | null
     */
    messageLoc: Location | null;
    /**
     * @type string
     */
    readName: string;
    /**
     * @type string
     */
    writeName: string;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new CallOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location | null} messageLoc
     * @param {string} readName
     * @param {string} writeName
     * @param {string} binaryOperator
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, messageLoc: Location | null, readName: string, writeName: string, binaryOperator: string, binaryOperatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator on a call.
 *
 *     foo.bar ||= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class CallOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location | null
     */
    messageLoc: Location | null;
    /**
     * @type string
     */
    readName: string;
    /**
     * @type string
     */
    writeName: string;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new CallOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location | null} messageLoc
     * @param {string} readName
     * @param {string} writeName
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, messageLoc: Location | null, readName: string, writeName: string, operatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a method call.
 *
 *     foo.bar, = 1
 *     ^^^^^^^
 *
 *     begin
 *     rescue => foo.bar
 *               ^^^^^^^
 *     end
 *
 *     for foo.bar in baz do end
 *         ^^^^^^^
 */
export declare class CallTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    receiver: Node;
    /**
     * @type Location
     */
    callOperatorLoc: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    messageLoc: Location;
    /**
     * Construct a new CallTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} receiver
     * @param {Location} callOperatorLoc
     * @param {string} name
     * @param {Location} messageLoc
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node, callOperatorLoc: Location, name: string, messageLoc: Location);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a local variable in pattern matching.
 *
 *     foo => [bar => baz]
 *             ^^^^^^^^^^
 */
export declare class CapturePatternNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type LocalVariableTargetNode
     */
    target: LocalVariableTargetNode;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new CapturePatternNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} value
     * @param {LocalVariableTargetNode} target
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, value: Node, target: LocalVariableTargetNode, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of a case statement for pattern matching.
 *
 *     case true
 *     in false
 *     end
 *     ^^^^^^^^^
 */
export declare class CaseMatchNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    predicate: Node | null;
    /**
     * @type Node[]
     */
    conditions: Node[];
    /**
     * @type ElseNode | null
     */
    elseClause: ElseNode | null;
    /**
     * @type Location
     */
    caseKeywordLoc: Location;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * Construct a new CaseMatchNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} predicate
     * @param {Node[]} conditions
     * @param {ElseNode | null} elseClause
     * @param {Location} caseKeywordLoc
     * @param {Location} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, predicate: Node | null, conditions: Node[], elseClause: ElseNode | null, caseKeywordLoc: Location, endKeywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of a case statement.
 *
 *     case true
 *     when false
 *     end
 *     ^^^^^^^^^^
 */
export declare class CaseNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    predicate: Node | null;
    /**
     * @type Node[]
     */
    conditions: Node[];
    /**
     * @type ElseNode | null
     */
    elseClause: ElseNode | null;
    /**
     * @type Location
     */
    caseKeywordLoc: Location;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * Construct a new CaseNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} predicate
     * @param {Node[]} conditions
     * @param {ElseNode | null} elseClause
     * @param {Location} caseKeywordLoc
     * @param {Location} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, predicate: Node | null, conditions: Node[], elseClause: ElseNode | null, caseKeywordLoc: Location, endKeywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a class declaration involving the `class` keyword.
 *
 *     class Foo end
 *     ^^^^^^^^^^^^^
 */
export declare class ClassNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Location
     */
    classKeywordLoc: Location;
    /**
     * @type Node
     */
    constantPath: Node;
    /**
     * @type Location | null
     */
    inheritanceOperatorLoc: Location | null;
    /**
     * @type Node | null
     */
    superclass: Node | null;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ClassNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {Location} classKeywordLoc
     * @param {Node} constantPath
     * @param {Location | null} inheritanceOperatorLoc
     * @param {Node | null} superclass
     * @param {Node | null} body
     * @param {Location} endKeywordLoc
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], classKeywordLoc: Location, constantPath: Node, inheritanceOperatorLoc: Location | null, superclass: Node | null, body: Node | null, endKeywordLoc: Location, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to a class variable.
 *
 *     @@target &&= value
 *     ^^^^^^^^^^^^^^^^^^
 */
export declare class ClassVariableAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ClassVariableAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a class variable using an operator that isn't `=`.
 *
 *     @@target += value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class ClassVariableOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * Construct a new ClassVariableOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} binaryOperator
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, binaryOperatorLoc: Location, value: Node, binaryOperator: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to a class variable.
 *
 *     @@target ||= value
 *     ^^^^^^^^^^^^^^^^^^
 */
export declare class ClassVariableOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ClassVariableOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents referencing a class variable.
 *
 *     @@foo
 *     ^^^^^
 */
export declare class ClassVariableReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ClassVariableReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a class variable in a context that doesn't have an explicit value.
 *
 *     @@foo, @@bar = baz
 *     ^^^^^  ^^^^^
 */
export declare class ClassVariableTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ClassVariableTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a class variable.
 *
 *     @@foo = 1
 *     ^^^^^^^^^
 */
export declare class ClassVariableWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new ClassVariableWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, value: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to a constant.
 *
 *     Target &&= value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class ConstantAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ConstantAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a constant using an operator that isn't `=`.
 *
 *     Target += value
 *     ^^^^^^^^^^^^^^^
 */
export declare class ConstantOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * Construct a new ConstantOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} binaryOperator
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, binaryOperatorLoc: Location, value: Node, binaryOperator: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to a constant.
 *
 *     Target ||= value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class ConstantOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ConstantOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to a constant path.
 *
 *     Parent::Child &&= value
 *     ^^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class ConstantPathAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ConstantPathNode
     */
    target: ConstantPathNode;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ConstantPathAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ConstantPathNode} target
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, target: ConstantPathNode, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents accessing a constant through a path of `::` operators.
 *
 *     Foo::Bar
 *     ^^^^^^^^
 */
export declare class ConstantPathNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    parent: Node | null;
    /**
     * @type string | null
     */
    name: string | null;
    /**
     * @type Location
     */
    delimiterLoc: Location;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * Construct a new ConstantPathNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} parent
     * @param {string | null} name
     * @param {Location} delimiterLoc
     * @param {Location} nameLoc
     */
    constructor(nodeID: number, location: Location, flags: number, parent: Node | null, name: string | null, delimiterLoc: Location, nameLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a constant path using an operator that isn't `=`.
 *
 *     Parent::Child += value
 *     ^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class ConstantPathOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ConstantPathNode
     */
    target: ConstantPathNode;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * Construct a new ConstantPathOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ConstantPathNode} target
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} binaryOperator
     */
    constructor(nodeID: number, location: Location, flags: number, target: ConstantPathNode, binaryOperatorLoc: Location, value: Node, binaryOperator: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to a constant path.
 *
 *     Parent::Child ||= value
 *     ^^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class ConstantPathOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ConstantPathNode
     */
    target: ConstantPathNode;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ConstantPathOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ConstantPathNode} target
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, target: ConstantPathNode, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a constant path in a context that doesn't have an explicit value.
 *
 *     Foo::Foo, Bar::Bar = baz
 *     ^^^^^^^^  ^^^^^^^^
 */
export declare class ConstantPathTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    parent: Node | null;
    /**
     * @type string | null
     */
    name: string | null;
    /**
     * @type Location
     */
    delimiterLoc: Location;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * Construct a new ConstantPathTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} parent
     * @param {string | null} name
     * @param {Location} delimiterLoc
     * @param {Location} nameLoc
     */
    constructor(nodeID: number, location: Location, flags: number, parent: Node | null, name: string | null, delimiterLoc: Location, nameLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a constant path.
 *
 *     ::Foo = 1
 *     ^^^^^^^^^
 *
 *     Foo::Bar = 1
 *     ^^^^^^^^^^^^
 *
 *     ::Foo::Bar = 1
 *     ^^^^^^^^^^^^^^
 */
export declare class ConstantPathWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ConstantPathNode
     */
    target: ConstantPathNode;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ConstantPathWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ConstantPathNode} target
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, target: ConstantPathNode, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents referencing a constant.
 *
 *     Foo
 *     ^^^
 */
export declare class ConstantReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ConstantReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a constant in a context that doesn't have an explicit value.
 *
 *     Foo, Bar = baz
 *     ^^^  ^^^
 */
export declare class ConstantTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ConstantTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a constant.
 *
 *     Foo = 1
 *     ^^^^^^^
 */
export declare class ConstantWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new ConstantWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, value: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a method definition.
 *
 *     def method
 *     end
 *     ^^^^^^^^^^
 */
export declare class DefNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type ParametersNode | null
     */
    parameters: ParametersNode | null;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Location
     */
    defKeywordLoc: Location;
    /**
     * @type Location | null
     */
    operatorLoc: Location | null;
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * @type Location | null
     */
    equalLoc: Location | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * Construct a new DefNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node | null} receiver
     * @param {ParametersNode | null} parameters
     * @param {Node | null} body
     * @param {string[]} locals
     * @param {Location} defKeywordLoc
     * @param {Location | null} operatorLoc
     * @param {Location | null} lparenLoc
     * @param {Location | null} rparenLoc
     * @param {Location | null} equalLoc
     * @param {Location | null} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, receiver: Node | null, parameters: ParametersNode | null, body: Node | null, locals: string[], defKeywordLoc: Location, operatorLoc: Location | null, lparenLoc: Location | null, rparenLoc: Location | null, equalLoc: Location | null, endKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `defined?` keyword.
 *
 *     defined?(a)
 *     ^^^^^^^^^^^
 */
export declare class DefinedNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new DefinedNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} lparenLoc
     * @param {Node} value
     * @param {Location | null} rparenLoc
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, lparenLoc: Location | null, value: Node, rparenLoc: Location | null, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an `else` clause in a `case`, `if`, or `unless` statement.
 *
 *     if a then b else c end
 *                 ^^^^^^^^^^
 */
export declare class ElseNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    elseKeywordLoc: Location;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * Construct a new ElseNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} elseKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {Location | null} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, elseKeywordLoc: Location, statements: StatementsNode | null, endKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an interpolated set of statements.
 *
 *     "foo #{bar}"
 *          ^^^^^^
 */
export declare class EmbeddedStatementsNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new EmbeddedStatementsNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {StatementsNode | null} statements
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, statements: StatementsNode | null, closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an interpolated variable.
 *
 *     "foo #@bar"
 *          ^^^^^
 */
export declare class EmbeddedVariableNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    variable: Node;
    /**
     * Construct a new EmbeddedVariableNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} operatorLoc
     * @param {Node} variable
     */
    constructor(nodeID: number, location: Location, flags: number, operatorLoc: Location, variable: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an `ensure` clause in a `begin` statement.
 *
 *     begin
 *       foo
 *     ensure
 *     ^^^^^^
 *       bar
 *     end
 */
export declare class EnsureNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    ensureKeywordLoc: Location;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * Construct a new EnsureNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} ensureKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {Location} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, ensureKeywordLoc: Location, statements: StatementsNode | null, endKeywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a node that is either missing or unexpected and results in a syntax error.
 */
export declare class ErrorRecoveryNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    unexpected: Node | null;
    /**
     * Construct a new ErrorRecoveryNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} unexpected
     */
    constructor(nodeID: number, location: Location, flags: number, unexpected: Node | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the literal `false` keyword.
 *
 *     false
 *     ^^^^^
 */
export declare class FalseNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new FalseNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a find pattern in pattern matching.
 *
 *     foo in *bar, baz, *qux
 *            ^^^^^^^^^^^^^^^
 *
 *     foo in [*bar, baz, *qux]
 *            ^^^^^^^^^^^^^^^^^
 *
 *     foo in Foo(*bar, baz, *qux)
 *            ^^^^^^^^^^^^^^^^^^^^
 *
 *     foo => *bar, baz, *qux
 *            ^^^^^^^^^^^^^^^
 */
export declare class FindPatternNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    constant: Node | null;
    /**
     * @type SplatNode
     */
    left: SplatNode;
    /**
     * @type Node[]
     */
    requireds: Node[];
    /**
     * @type SplatNode
     */
    right: SplatNode;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new FindPatternNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} constant
     * @param {SplatNode} left
     * @param {Node[]} requireds
     * @param {SplatNode} right
     * @param {Location | null} openingLoc
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, constant: Node | null, left: SplatNode, requireds: Node[], right: SplatNode, openingLoc: Location | null, closingLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `..` or `...` operators to create flip flops.
 *
 *     baz if foo .. bar
 *            ^^^^^^^^^^
 */
export declare class FlipFlopNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    left: Node | null;
    /**
     * @type Node | null
     */
    right: Node | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new FlipFlopNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} left
     * @param {Node | null} right
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, left: Node | null, right: Node | null, operatorLoc: Location);
    /**
     * True if this node has the EXCLUDE_END flag.
     *
     * @returns {boolean}
     */
    isExcludeEnd(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a floating point number literal.
 *
 *     1.0
 *     ^^^
 */
export declare class FloatNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type number
     */
    value: number;
    /**
     * Construct a new FloatNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {number} value
     */
    constructor(nodeID: number, location: Location, flags: number, value: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `for` keyword.
 *
 *     for i in a end
 *     ^^^^^^^^^^^^^^
 */
export declare class ForNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    index: Node;
    /**
     * @type Node
     */
    collection: Node;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    forKeywordLoc: Location;
    /**
     * @type Location
     */
    inKeywordLoc: Location;
    /**
     * @type Location | null
     */
    doKeywordLoc: Location | null;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * Construct a new ForNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} index
     * @param {Node} collection
     * @param {StatementsNode | null} statements
     * @param {Location} forKeywordLoc
     * @param {Location} inKeywordLoc
     * @param {Location | null} doKeywordLoc
     * @param {Location} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, index: Node, collection: Node, statements: StatementsNode | null, forKeywordLoc: Location, inKeywordLoc: Location, doKeywordLoc: Location | null, endKeywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents forwarding all arguments to this method to another method.
 *
 *     def foo(...)
 *       bar(...)
 *           ^^^
 *     end
 */
export declare class ForwardingArgumentsNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new ForwardingArgumentsNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the forwarding parameter in a method, block, or lambda declaration.
 *
 *     def foo(...)
 *             ^^^
 *     end
 */
export declare class ForwardingParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new ForwardingParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `super` keyword without parentheses or arguments, but which might have a block.
 *
 *     super
 *     ^^^^^
 *
 *     super { 123 }
 *     ^^^^^^^^^^^^^
 *
 * If it has any other arguments, it would be a `SuperNode` instead.
 */
export declare class ForwardingSuperNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type BlockNode | null
     */
    block: BlockNode | null;
    /**
     * Construct a new ForwardingSuperNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} keywordLoc
     * @param {BlockNode | null} block
     */
    constructor(nodeID: number, location: Location, flags: number, keywordLoc: Location, block: BlockNode | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to a global variable.
 *
 *     $target &&= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class GlobalVariableAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new GlobalVariableAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a global variable using an operator that isn't `=`.
 *
 *     $target += value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class GlobalVariableOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * Construct a new GlobalVariableOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} binaryOperator
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, binaryOperatorLoc: Location, value: Node, binaryOperator: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to a global variable.
 *
 *     $target ||= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class GlobalVariableOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new GlobalVariableOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents referencing a global variable.
 *
 *     $foo
 *     ^^^^
 */
export declare class GlobalVariableReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new GlobalVariableReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a global variable in a context that doesn't have an explicit value.
 *
 *     $foo, $bar = baz
 *     ^^^^  ^^^^
 */
export declare class GlobalVariableTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new GlobalVariableTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a global variable.
 *
 *     $foo = 1
 *     ^^^^^^^^
 */
export declare class GlobalVariableWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new GlobalVariableWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, value: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a hash literal.
 *
 *     { a => b }
 *     ^^^^^^^^^^
 */
export declare class HashNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Node[]
     */
    elements: Node[];
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new HashNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Node[]} elements
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, elements: Node[], closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a hash pattern in pattern matching.
 *
 *     foo => { a: 1, b: 2 }
 *            ^^^^^^^^^^^^^^
 *
 *     foo => { a: 1, b: 2, **c }
 *            ^^^^^^^^^^^^^^^^^^^
 *
 *     foo => Bar[a: 1, b: 2]
 *            ^^^^^^^^^^^^^^^
 *
 *     foo in { a: 1, b: 2 }
 *            ^^^^^^^^^^^^^^
 */
export declare class HashPatternNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    constant: Node | null;
    /**
     * @type Node[]
     */
    elements: Node[];
    /**
     * @type Node | null
     */
    rest: Node | null;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new HashPatternNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} constant
     * @param {Node[]} elements
     * @param {Node | null} rest
     * @param {Location | null} openingLoc
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, constant: Node | null, elements: Node[], rest: Node | null, openingLoc: Location | null, closingLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `if` keyword, either in the block form or the modifier form, or a ternary expression.
 *
 *     bar if foo
 *     ^^^^^^^^^^
 *
 *     if foo then bar end
 *     ^^^^^^^^^^^^^^^^^^^
 *
 *     foo ? bar : baz
 *     ^^^^^^^^^^^^^^^
 */
export declare class IfNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    ifKeywordLoc: Location | null;
    /**
     * @type Node
     */
    predicate: Node;
    /**
     * @type Location | null
     */
    thenKeywordLoc: Location | null;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Node | null
     */
    subsequent: Node | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * Construct a new IfNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} ifKeywordLoc
     * @param {Node} predicate
     * @param {Location | null} thenKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {Node | null} subsequent
     * @param {Location | null} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, ifKeywordLoc: Location | null, predicate: Node, thenKeywordLoc: Location | null, statements: StatementsNode | null, subsequent: Node | null, endKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an imaginary number literal.
 *
 *     1.0i
 *     ^^^^
 */
export declare class ImaginaryNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    numeric: Node;
    /**
     * Construct a new ImaginaryNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} numeric
     */
    constructor(nodeID: number, location: Location, flags: number, numeric: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a node that is implicitly being added to the tree but doesn't correspond directly to a node in the source.
 *
 *     { foo: }
 *       ^^^^
 *
 *     { Foo: }
 *       ^^^^
 *
 *     foo in { bar: }
 *              ^^^^
 */
export declare class ImplicitNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new ImplicitNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents using a trailing comma to indicate an implicit rest parameter.
 *
 *     foo { |bar,| }
 *               ^
 *
 *     foo in [bar,]
 *                ^
 *
 *     for foo, in bar do end
 *            ^
 *
 *     foo, = bar
 *        ^
 */
export declare class ImplicitRestNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new ImplicitRestNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `in` keyword in a case statement.
 *
 *     case a; in b then c end
 *             ^^^^^^^^^^^
 */
export declare class InNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    pattern: Node;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    inKeywordLoc: Location;
    /**
     * @type Location | null
     */
    thenKeywordLoc: Location | null;
    /**
     * Construct a new InNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} pattern
     * @param {StatementsNode | null} statements
     * @param {Location} inKeywordLoc
     * @param {Location | null} thenKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, pattern: Node, statements: StatementsNode | null, inKeywordLoc: Location, thenKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator on a call to the `[]` method.
 *
 *     foo.bar[baz] &&= value
 *     ^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class IndexAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type BlockArgumentNode | null
     */
    block: BlockArgumentNode | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new IndexAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location} openingLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} closingLoc
     * @param {BlockArgumentNode | null} block
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, openingLoc: Location, arguments_: ArgumentsNode | null, closingLoc: Location, block: BlockArgumentNode | null, operatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of an assignment operator on a call to `[]`.
 *
 *     foo.bar[baz] += value
 *     ^^^^^^^^^^^^^^^^^^^^^
 */
export declare class IndexOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type BlockArgumentNode | null
     */
    block: BlockArgumentNode | null;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new IndexOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location} openingLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} closingLoc
     * @param {BlockArgumentNode | null} block
     * @param {string} binaryOperator
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, openingLoc: Location, arguments_: ArgumentsNode | null, closingLoc: Location, block: BlockArgumentNode | null, binaryOperator: string, binaryOperatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator on a call to `[]`.
 *
 *     foo.bar[baz] ||= value
 *     ^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class IndexOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    receiver: Node | null;
    /**
     * @type Location | null
     */
    callOperatorLoc: Location | null;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type BlockArgumentNode | null
     */
    block: BlockArgumentNode | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new IndexOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} receiver
     * @param {Location | null} callOperatorLoc
     * @param {Location} openingLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} closingLoc
     * @param {BlockArgumentNode | null} block
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node | null, callOperatorLoc: Location | null, openingLoc: Location, arguments_: ArgumentsNode | null, closingLoc: Location, block: BlockArgumentNode | null, operatorLoc: Location, value: Node);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to an index.
 *
 *     foo[bar], = 1
 *     ^^^^^^^^
 *
 *     begin
 *     rescue => foo[bar]
 *               ^^^^^^^^
 *     end
 *
 *     for foo[bar] in baz do end
 *         ^^^^^^^^
 */
export declare class IndexTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    receiver: Node;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type BlockArgumentNode | null
     */
    block: BlockArgumentNode | null;
    /**
     * Construct a new IndexTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} receiver
     * @param {Location} openingLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} closingLoc
     * @param {BlockArgumentNode | null} block
     */
    constructor(nodeID: number, location: Location, flags: number, receiver: Node, openingLoc: Location, arguments_: ArgumentsNode | null, closingLoc: Location, block: BlockArgumentNode | null);
    /**
     * True if this node has the SAFE_NAVIGATION flag.
     *
     * @returns {boolean}
     */
    isSafeNavigation(): boolean;
    /**
     * True if this node has the VARIABLE_CALL flag.
     *
     * @returns {boolean}
     */
    isVariableCall(): boolean;
    /**
     * True if this node has the ATTRIBUTE_WRITE flag.
     *
     * @returns {boolean}
     */
    isAttributeWrite(): boolean;
    /**
     * True if this node has the IGNORE_VISIBILITY flag.
     *
     * @returns {boolean}
     */
    isIgnoreVisibility(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to an instance variable.
 *
 *     @target &&= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class InstanceVariableAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new InstanceVariableAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to an instance variable using an operator that isn't `=`.
 *
 *     @target += value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class InstanceVariableOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * Construct a new InstanceVariableOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} binaryOperator
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, binaryOperatorLoc: Location, value: Node, binaryOperator: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to an instance variable.
 *
 *     @target ||= value
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class InstanceVariableOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new InstanceVariableOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents referencing an instance variable.
 *
 *     @foo
 *     ^^^^
 */
export declare class InstanceVariableReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new InstanceVariableReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to an instance variable in a context that doesn't have an explicit value.
 *
 *     @foo, @bar = baz
 *     ^^^^  ^^^^
 */
export declare class InstanceVariableTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new InstanceVariableTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to an instance variable.
 *
 *     @foo = 1
 *     ^^^^^^^^
 */
export declare class InstanceVariableWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new InstanceVariableWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, value: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an integer number literal.
 *
 *     1
 *     ^
 */
export declare class IntegerNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type number
     */
    value: number;
    /**
     * Construct a new IntegerNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {number} value
     */
    constructor(nodeID: number, location: Location, flags: number, value: number);
    /**
     * True if this node has the BINARY flag.
     *
     * @returns {boolean}
     */
    isBinary(): boolean;
    /**
     * True if this node has the DECIMAL flag.
     *
     * @returns {boolean}
     */
    isDecimal(): boolean;
    /**
     * True if this node has the OCTAL flag.
     *
     * @returns {boolean}
     */
    isOctal(): boolean;
    /**
     * True if this node has the HEXADECIMAL flag.
     *
     * @returns {boolean}
     */
    isHexadecimal(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a regular expression literal that contains interpolation that is being used in the predicate of a conditional to implicitly match against the last line read by an IO object.
 *
 *     if /foo #{bar} baz/ then end
 *        ^^^^^^^^^^^^^^^^
 */
export declare class InterpolatedMatchLastLineNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Node[]
     */
    parts: Node[];
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new InterpolatedMatchLastLineNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Node[]} parts
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, parts: Node[], closingLoc: Location);
    /**
     * True if this node has the IGNORE_CASE flag.
     *
     * @returns {boolean}
     */
    isIgnoreCase(): boolean;
    /**
     * True if this node has the EXTENDED flag.
     *
     * @returns {boolean}
     */
    isExtended(): boolean;
    /**
     * True if this node has the MULTI_LINE flag.
     *
     * @returns {boolean}
     */
    isMultiLine(): boolean;
    /**
     * True if this node has the ONCE flag.
     *
     * @returns {boolean}
     */
    isOnce(): boolean;
    /**
     * True if this node has the EUC_JP flag.
     *
     * @returns {boolean}
     */
    isEucJp(): boolean;
    /**
     * True if this node has the ASCII_8BIT flag.
     *
     * @returns {boolean}
     */
    isAscii8bit(): boolean;
    /**
     * True if this node has the WINDOWS_31J flag.
     *
     * @returns {boolean}
     */
    isWindows31j(): boolean;
    /**
     * True if this node has the UTF_8 flag.
     *
     * @returns {boolean}
     */
    isUtf8(): boolean;
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FORCED_US_ASCII_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUsAsciiEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a regular expression literal that contains interpolation.
 *
 *     /foo #{bar} baz/
 *     ^^^^^^^^^^^^^^^^
 */
export declare class InterpolatedRegularExpressionNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Node[]
     */
    parts: Node[];
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new InterpolatedRegularExpressionNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Node[]} parts
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, parts: Node[], closingLoc: Location);
    /**
     * True if this node has the IGNORE_CASE flag.
     *
     * @returns {boolean}
     */
    isIgnoreCase(): boolean;
    /**
     * True if this node has the EXTENDED flag.
     *
     * @returns {boolean}
     */
    isExtended(): boolean;
    /**
     * True if this node has the MULTI_LINE flag.
     *
     * @returns {boolean}
     */
    isMultiLine(): boolean;
    /**
     * True if this node has the ONCE flag.
     *
     * @returns {boolean}
     */
    isOnce(): boolean;
    /**
     * True if this node has the EUC_JP flag.
     *
     * @returns {boolean}
     */
    isEucJp(): boolean;
    /**
     * True if this node has the ASCII_8BIT flag.
     *
     * @returns {boolean}
     */
    isAscii8bit(): boolean;
    /**
     * True if this node has the WINDOWS_31J flag.
     *
     * @returns {boolean}
     */
    isWindows31j(): boolean;
    /**
     * True if this node has the UTF_8 flag.
     *
     * @returns {boolean}
     */
    isUtf8(): boolean;
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FORCED_US_ASCII_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUsAsciiEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a string literal that contains interpolation.
 *
 *     "foo #{bar} baz"
 *     ^^^^^^^^^^^^^^^^
 */
export declare class InterpolatedStringNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Node[]
     */
    parts: Node[];
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new InterpolatedStringNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} openingLoc
     * @param {Node[]} parts
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location | null, parts: Node[], closingLoc: Location | null);
    /**
     * True if this node has the FROZEN flag.
     *
     * @returns {boolean}
     */
    isFrozen(): boolean;
    /**
     * True if this node has the MUTABLE flag.
     *
     * @returns {boolean}
     */
    isMutable(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a symbol literal that contains interpolation.
 *
 *     :"foo #{bar} baz"
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class InterpolatedSymbolNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Node[]
     */
    parts: Node[];
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * Construct a new InterpolatedSymbolNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} openingLoc
     * @param {Node[]} parts
     * @param {Location | null} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location | null, parts: Node[], closingLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an xstring literal that contains interpolation.
 *
 *     `foo #{bar} baz`
 *     ^^^^^^^^^^^^^^^^
 */
export declare class InterpolatedXStringNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Node[]
     */
    parts: Node[];
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new InterpolatedXStringNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Node[]} parts
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, parts: Node[], closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents reading from the implicit `it` local variable.
 *
 *     -> { it }
 *          ^^
 */
export declare class ItLocalVariableReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new ItLocalVariableReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an implicit set of parameters through the use of the `it` keyword within a block or lambda.
 *
 *     -> { it + it }
 *     ^^^^^^^^^^^^^^
 */
export declare class ItParametersNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new ItParametersNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a hash literal without opening and closing braces.
 *
 *     foo(a: b)
 *         ^^^^
 */
export declare class KeywordHashNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    elements: Node[];
    /**
     * Construct a new KeywordHashNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} elements
     */
    constructor(nodeID: number, location: Location, flags: number, elements: Node[]);
    /**
     * True if this node has the SYMBOL_KEYS flag.
     *
     * @returns {boolean}
     */
    isSymbolKeys(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a keyword rest parameter to a method, block, or lambda definition.
 *
 *     def a(**b)
 *           ^^^
 *     end
 */
export declare class KeywordRestParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string | null
     */
    name: string | null;
    /**
     * @type Location | null
     */
    nameLoc: Location | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new KeywordRestParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string | null} name
     * @param {Location | null} nameLoc
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string | null, nameLoc: Location | null, operatorLoc: Location);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents using a lambda literal (not the lambda method call).
 *
 *     ->(value) { value * 2 }
 *     ^^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class LambdaNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type Node | null
     */
    parameters: Node | null;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * Construct a new LambdaNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {Location} operatorLoc
     * @param {Location} openingLoc
     * @param {Location} closingLoc
     * @param {Node | null} parameters
     * @param {Node | null} body
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], operatorLoc: Location, openingLoc: Location, closingLoc: Location, parameters: Node | null, body: Node | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `&&=` operator for assignment to a local variable.
 *
 *     target &&= value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class LocalVariableAndWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    name: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * Construct a new LocalVariableAndWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     * @param {string} name
     * @param {number} depth
     */
    constructor(nodeID: number, location: Location, flags: number, nameLoc: Location, operatorLoc: Location, value: Node, name: string, depth: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents assigning to a local variable using an operator that isn't `=`.
 *
 *     target += value
 *     ^^^^^^^^^^^^^^^
 */
export declare class LocalVariableOperatorWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    binaryOperatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    name: string;
    /**
     * @type string
     */
    binaryOperator: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * Construct a new LocalVariableOperatorWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} nameLoc
     * @param {Location} binaryOperatorLoc
     * @param {Node} value
     * @param {string} name
     * @param {string} binaryOperator
     * @param {number} depth
     */
    constructor(nodeID: number, location: Location, flags: number, nameLoc: Location, binaryOperatorLoc: Location, value: Node, name: string, binaryOperator: string, depth: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||=` operator for assignment to a local variable.
 *
 *     target ||= value
 *     ^^^^^^^^^^^^^^^^
 */
export declare class LocalVariableOrWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type string
     */
    name: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * Construct a new LocalVariableOrWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     * @param {string} name
     * @param {number} depth
     */
    constructor(nodeID: number, location: Location, flags: number, nameLoc: Location, operatorLoc: Location, value: Node, name: string, depth: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents reading a local variable. Note that this requires that a local variable of the same name has already been written to in the same scope, otherwise it is parsed as a method call.
 *
 *     foo
 *     ^^^
 */
export declare class LocalVariableReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * Construct a new LocalVariableReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {number} depth
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, depth: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a local variable in a context that doesn't have an explicit value.
 *
 *     foo, bar = baz
 *     ^^^  ^^^
 *
 *     foo => baz
 *            ^^^
 */
export declare class LocalVariableTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * Construct a new LocalVariableTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {number} depth
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, depth: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing to a local variable.
 *
 *     foo = 1
 *     ^^^^^^^
 */
export declare class LocalVariableWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type number
     */
    depth: number;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new LocalVariableWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {number} depth
     * @param {Location} nameLoc
     * @param {Node} value
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, depth: number, nameLoc: Location, value: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a regular expression literal used in the predicate of a conditional to implicitly match against the last line read by an IO object.
 *
 *     if /foo/i then end
 *        ^^^^^^
 */
export declare class MatchLastLineNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    contentLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type RubyString
     */
    unescaped: RubyString;
    /**
     * Construct a new MatchLastLineNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Location} contentLoc
     * @param {Location} closingLoc
     * @param {RubyString} unescaped
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, contentLoc: Location, closingLoc: Location, unescaped: RubyString);
    /**
     * True if this node has the IGNORE_CASE flag.
     *
     * @returns {boolean}
     */
    isIgnoreCase(): boolean;
    /**
     * True if this node has the EXTENDED flag.
     *
     * @returns {boolean}
     */
    isExtended(): boolean;
    /**
     * True if this node has the MULTI_LINE flag.
     *
     * @returns {boolean}
     */
    isMultiLine(): boolean;
    /**
     * True if this node has the ONCE flag.
     *
     * @returns {boolean}
     */
    isOnce(): boolean;
    /**
     * True if this node has the EUC_JP flag.
     *
     * @returns {boolean}
     */
    isEucJp(): boolean;
    /**
     * True if this node has the ASCII_8BIT flag.
     *
     * @returns {boolean}
     */
    isAscii8bit(): boolean;
    /**
     * True if this node has the WINDOWS_31J flag.
     *
     * @returns {boolean}
     */
    isWindows31j(): boolean;
    /**
     * True if this node has the UTF_8 flag.
     *
     * @returns {boolean}
     */
    isUtf8(): boolean;
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FORCED_US_ASCII_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUsAsciiEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the modifier `in` operator.
 *
 *     foo in bar
 *     ^^^^^^^^^^
 */
export declare class MatchPredicateNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Node
     */
    pattern: Node;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new MatchPredicateNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} value
     * @param {Node} pattern
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, value: Node, pattern: Node, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `=>` operator.
 *
 *     foo => bar
 *     ^^^^^^^^^^
 */
export declare class MatchRequiredNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * @type Node
     */
    pattern: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new MatchRequiredNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} value
     * @param {Node} pattern
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, value: Node, pattern: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents writing local variables using a regular expression match with named capture groups.
 *
 *     /(?<foo>bar)/ =~ baz
 *     ^^^^^^^^^^^^^^^^^^^^
 */
export declare class MatchWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type CallNode
     */
    call: CallNode;
    /**
     * @type Node[]
     */
    targets: Node[];
    /**
     * Construct a new MatchWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {CallNode} call
     * @param {Node[]} targets
     */
    constructor(nodeID: number, location: Location, flags: number, call: CallNode, targets: Node[]);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a module declaration involving the `module` keyword.
 *
 *     module Foo end
 *     ^^^^^^^^^^^^^^
 */
export declare class ModuleNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Location
     */
    moduleKeywordLoc: Location;
    /**
     * @type Node
     */
    constantPath: Node;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new ModuleNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {Location} moduleKeywordLoc
     * @param {Node} constantPath
     * @param {Node | null} body
     * @param {Location} endKeywordLoc
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], moduleKeywordLoc: Location, constantPath: Node, body: Node | null, endKeywordLoc: Location, name: string);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a multi-target expression.
 *
 *     a, (b, c) = 1, 2, 3
 *        ^^^^^^
 *
 * This can be a part of `MultiWriteNode` as above, or the target of a `for` loop
 *
 *     for a, b in [[1, 2], [3, 4]]
 *         ^^^^
 */
export declare class MultiTargetNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    lefts: Node[];
    /**
     * @type Node | null
     */
    rest: Node | null;
    /**
     * @type Node[]
     */
    rights: Node[];
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * Construct a new MultiTargetNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} lefts
     * @param {Node | null} rest
     * @param {Node[]} rights
     * @param {Location | null} lparenLoc
     * @param {Location | null} rparenLoc
     */
    constructor(nodeID: number, location: Location, flags: number, lefts: Node[], rest: Node | null, rights: Node[], lparenLoc: Location | null, rparenLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a write to a multi-target expression.
 *
 *     a, b, c = 1, 2, 3
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class MultiWriteNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    lefts: Node[];
    /**
     * @type Node | null
     */
    rest: Node | null;
    /**
     * @type Node[]
     */
    rights: Node[];
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new MultiWriteNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} lefts
     * @param {Node | null} rest
     * @param {Node[]} rights
     * @param {Location | null} lparenLoc
     * @param {Location | null} rparenLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, lefts: Node[], rest: Node | null, rights: Node[], lparenLoc: Location | null, rparenLoc: Location | null, operatorLoc: Location, value: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `next` keyword.
 *
 *     next 1
 *     ^^^^^^
 */
export declare class NextNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new NextNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {ArgumentsNode | null} arguments_
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, arguments_: ArgumentsNode | null, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `nil` keyword.
 *
 *     nil
 *     ^^^
 */
export declare class NilNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new NilNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of `&nil` inside method arguments.
 *
 *     def a(&nil)
 *           ^^^^
 *     end
 */
export declare class NoBlockParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new NoBlockParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} operatorLoc
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, operatorLoc: Location, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of `**nil` inside method arguments.
 *
 *     def a(**nil)
 *           ^^^^^
 *     end
 */
export declare class NoKeywordsParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new NoKeywordsParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} operatorLoc
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, operatorLoc: Location, keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an implicit set of parameters through the use of numbered parameters within a block or lambda.
 *
 *     -> { _1 + _2 }
 *     ^^^^^^^^^^^^^^
 */
export declare class NumberedParametersNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type number
     */
    maximum: number;
    /**
     * Construct a new NumberedParametersNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {number} maximum
     */
    constructor(nodeID: number, location: Location, flags: number, maximum: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents reading a numbered reference to a capture in the previous match.
 *
 *     $1
 *     ^^
 */
export declare class NumberedReferenceReadNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type number
     */
    number: number;
    /**
     * Construct a new NumberedReferenceReadNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {number} number
     */
    constructor(nodeID: number, location: Location, flags: number, number: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an optional keyword parameter to a method, block, or lambda definition.
 *
 *     def a(b: 1)
 *           ^^^^
 *     end
 */
export declare class OptionalKeywordParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new OptionalKeywordParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, value: Node);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an optional parameter to a method, block, or lambda definition.
 *
 *     def a(b = 1)
 *           ^^^^^
 *     end
 */
export declare class OptionalParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    value: Node;
    /**
     * Construct a new OptionalParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     * @param {Location} operatorLoc
     * @param {Node} value
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location, operatorLoc: Location, value: Node);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `||` operator or the `or` keyword.
 *
 *     left or right
 *     ^^^^^^^^^^^^^
 */
export declare class OrNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    left: Node;
    /**
     * @type Node
     */
    right: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new OrNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} left
     * @param {Node} right
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, left: Node, right: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the list of parameters on a method, block, or lambda definition.
 *
 *     def a(b, c, d)
 *           ^^^^^^^
 *     end
 */
export declare class ParametersNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    requireds: Node[];
    /**
     * @type Node[]
     */
    optionals: Node[];
    /**
     * @type Node | null
     */
    rest: Node | null;
    /**
     * @type Node[]
     */
    posts: Node[];
    /**
     * @type Node[]
     */
    keywords: Node[];
    /**
     * @type Node | null
     */
    keywordRest: Node | null;
    /**
     * @type Node | null
     */
    block: Node | null;
    /**
     * Construct a new ParametersNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} requireds
     * @param {Node[]} optionals
     * @param {Node | null} rest
     * @param {Node[]} posts
     * @param {Node[]} keywords
     * @param {Node | null} keywordRest
     * @param {Node | null} block
     */
    constructor(nodeID: number, location: Location, flags: number, requireds: Node[], optionals: Node[], rest: Node | null, posts: Node[], keywords: Node[], keywordRest: Node | null, block: Node | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a parenthesized expression
 *
 *     (10 + 34)
 *     ^^^^^^^^^
 */
export declare class ParenthesesNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new ParenthesesNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} body
     * @param {Location} openingLoc
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, body: Node | null, openingLoc: Location, closingLoc: Location);
    /**
     * True if this node has the MULTIPLE_STATEMENTS flag.
     *
     * @returns {boolean}
     */
    isMultipleStatements(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `^` operator for pinning an expression in a pattern matching expression.
 *
 *     foo in ^(bar)
 *            ^^^^^^
 */
export declare class PinnedExpressionNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    expression: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Location
     */
    lparenLoc: Location;
    /**
     * @type Location
     */
    rparenLoc: Location;
    /**
     * Construct a new PinnedExpressionNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} expression
     * @param {Location} operatorLoc
     * @param {Location} lparenLoc
     * @param {Location} rparenLoc
     */
    constructor(nodeID: number, location: Location, flags: number, expression: Node, operatorLoc: Location, lparenLoc: Location, rparenLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `^` operator for pinning a variable in a pattern matching expression.
 *
 *     foo in ^bar
 *            ^^^^
 */
export declare class PinnedVariableNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    variable: Node;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new PinnedVariableNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} variable
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, variable: Node, operatorLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `END` keyword.
 *
 *     END { foo }
 *     ^^^^^^^^^^^
 */
export declare class PostExecutionNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new PostExecutionNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {StatementsNode | null} statements
     * @param {Location} keywordLoc
     * @param {Location} openingLoc
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, statements: StatementsNode | null, keywordLoc: Location, openingLoc: Location, closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `BEGIN` keyword.
 *
 *     BEGIN { foo }
 *     ^^^^^^^^^^^^^
 */
export declare class PreExecutionNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * Construct a new PreExecutionNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {StatementsNode | null} statements
     * @param {Location} keywordLoc
     * @param {Location} openingLoc
     * @param {Location} closingLoc
     */
    constructor(nodeID: number, location: Location, flags: number, statements: StatementsNode | null, keywordLoc: Location, openingLoc: Location, closingLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * The top level node of any parse tree.
 */
export declare class ProgramNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type StatementsNode
     */
    statements: StatementsNode;
    /**
     * Construct a new ProgramNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {StatementsNode} statements
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], statements: StatementsNode);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `..` or `...` operators.
 *
 *     1..2
 *     ^^^^
 *
 *     c if a =~ /left/ ... b =~ /right/
 *          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class RangeNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node | null
     */
    left: Node | null;
    /**
     * @type Node | null
     */
    right: Node | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new RangeNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node | null} left
     * @param {Node | null} right
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, left: Node | null, right: Node | null, operatorLoc: Location);
    /**
     * True if this node has the EXCLUDE_END flag.
     *
     * @returns {boolean}
     */
    isExcludeEnd(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a rational number literal.
 *
 *     1.0r
 *     ^^^^
 */
export declare class RationalNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type number
     */
    numerator: number;
    /**
     * @type number
     */
    denominator: number;
    /**
     * Construct a new RationalNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {number} numerator
     * @param {number} denominator
     */
    constructor(nodeID: number, location: Location, flags: number, numerator: number, denominator: number);
    /**
     * True if this node has the BINARY flag.
     *
     * @returns {boolean}
     */
    isBinary(): boolean;
    /**
     * True if this node has the DECIMAL flag.
     *
     * @returns {boolean}
     */
    isDecimal(): boolean;
    /**
     * True if this node has the OCTAL flag.
     *
     * @returns {boolean}
     */
    isOctal(): boolean;
    /**
     * True if this node has the HEXADECIMAL flag.
     *
     * @returns {boolean}
     */
    isHexadecimal(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `redo` keyword.
 *
 *     redo
 *     ^^^^
 */
export declare class RedoNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new RedoNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a regular expression literal with no interpolation.
 *
 *     /foo/i
 *     ^^^^^^
 */
export declare class RegularExpressionNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    contentLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type RubyString
     */
    unescaped: RubyString;
    /**
     * Construct a new RegularExpressionNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Location} contentLoc
     * @param {Location} closingLoc
     * @param {RubyString} unescaped
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, contentLoc: Location, closingLoc: Location, unescaped: RubyString);
    /**
     * True if this node has the IGNORE_CASE flag.
     *
     * @returns {boolean}
     */
    isIgnoreCase(): boolean;
    /**
     * True if this node has the EXTENDED flag.
     *
     * @returns {boolean}
     */
    isExtended(): boolean;
    /**
     * True if this node has the MULTI_LINE flag.
     *
     * @returns {boolean}
     */
    isMultiLine(): boolean;
    /**
     * True if this node has the ONCE flag.
     *
     * @returns {boolean}
     */
    isOnce(): boolean;
    /**
     * True if this node has the EUC_JP flag.
     *
     * @returns {boolean}
     */
    isEucJp(): boolean;
    /**
     * True if this node has the ASCII_8BIT flag.
     *
     * @returns {boolean}
     */
    isAscii8bit(): boolean;
    /**
     * True if this node has the WINDOWS_31J flag.
     *
     * @returns {boolean}
     */
    isWindows31j(): boolean;
    /**
     * True if this node has the UTF_8 flag.
     *
     * @returns {boolean}
     */
    isUtf8(): boolean;
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FORCED_US_ASCII_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUsAsciiEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a required keyword parameter to a method, block, or lambda definition.
 *
 *     def a(b: )
 *           ^^
 *     end
 */
export declare class RequiredKeywordParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * @type Location
     */
    nameLoc: Location;
    /**
     * Construct a new RequiredKeywordParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     * @param {Location} nameLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string, nameLoc: Location);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a required parameter to a method, block, or lambda definition.
 *
 *     def a(b)
 *           ^
 *     end
 */
export declare class RequiredParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string
     */
    name: string;
    /**
     * Construct a new RequiredParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string} name
     */
    constructor(nodeID: number, location: Location, flags: number, name: string);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an expression modified with a rescue.
 *
 *     foo rescue nil
 *     ^^^^^^^^^^^^^^
 */
export declare class RescueModifierNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    expression: Node;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Node
     */
    rescueExpression: Node;
    /**
     * Construct a new RescueModifierNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} expression
     * @param {Location} keywordLoc
     * @param {Node} rescueExpression
     */
    constructor(nodeID: number, location: Location, flags: number, expression: Node, keywordLoc: Location, rescueExpression: Node);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a rescue statement.
 *
 *     begin
 *     rescue Foo, *splat, Bar => ex
 *       foo
 *     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *     end
 *
 * `Foo, *splat, Bar` are in the `exceptions` field. `ex` is in the `reference` field.
 */
export declare class RescueNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Node[]
     */
    exceptions: Node[];
    /**
     * @type Location | null
     */
    operatorLoc: Location | null;
    /**
     * @type Node | null
     */
    reference: Node | null;
    /**
     * @type Location | null
     */
    thenKeywordLoc: Location | null;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type RescueNode | null
     */
    subsequent: RescueNode | null;
    /**
     * Construct a new RescueNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} keywordLoc
     * @param {Node[]} exceptions
     * @param {Location | null} operatorLoc
     * @param {Node | null} reference
     * @param {Location | null} thenKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {RescueNode | null} subsequent
     */
    constructor(nodeID: number, location: Location, flags: number, keywordLoc: Location, exceptions: Node[], operatorLoc: Location | null, reference: Node | null, thenKeywordLoc: Location | null, statements: StatementsNode | null, subsequent: RescueNode | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a rest parameter to a method, block, or lambda definition.
 *
 *     def a(*b)
 *           ^^
 *     end
 */
export declare class RestParameterNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string | null
     */
    name: string | null;
    /**
     * @type Location | null
     */
    nameLoc: Location | null;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * Construct a new RestParameterNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string | null} name
     * @param {Location | null} nameLoc
     * @param {Location} operatorLoc
     */
    constructor(nodeID: number, location: Location, flags: number, name: string | null, nameLoc: Location | null, operatorLoc: Location);
    /**
     * True if this node has the REPEATED_PARAMETER flag.
     *
     * @returns {boolean}
     */
    isRepeatedParameter(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `retry` keyword.
 *
 *     retry
 *     ^^^^^
 */
export declare class RetryNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new RetryNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `return` keyword.
 *
 *     return 1
 *     ^^^^^^^^
 */
export declare class ReturnNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * Construct a new ReturnNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} keywordLoc
     * @param {ArgumentsNode | null} arguments_
     */
    constructor(nodeID: number, location: Location, flags: number, keywordLoc: Location, arguments_: ArgumentsNode | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the `self` keyword.
 *
 *     self
 *     ^^^^
 */
export declare class SelfNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new SelfNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * This node wraps a constant write to indicate that when the value is written, it should have its shareability state modified.
 *
 *     # shareable_constant_value: literal
 *     C = { a: 1 }
 *     ^^^^^^^^^^^^
 */
export declare class ShareableConstantNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node
     */
    write: Node;
    /**
     * Construct a new ShareableConstantNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node} write
     */
    constructor(nodeID: number, location: Location, flags: number, write: Node);
    /**
     * True if this node has the LITERAL flag.
     *
     * @returns {boolean}
     */
    isLiteral(): boolean;
    /**
     * True if this node has the EXPERIMENTAL_EVERYTHING flag.
     *
     * @returns {boolean}
     */
    isExperimentalEverything(): boolean;
    /**
     * True if this node has the EXPERIMENTAL_COPY flag.
     *
     * @returns {boolean}
     */
    isExperimentalCopy(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a singleton class declaration involving the `class` keyword.
 *
 *     class << self end
 *     ^^^^^^^^^^^^^^^^^
 */
export declare class SingletonClassNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type string[]
     */
    locals: string[];
    /**
     * @type Location
     */
    classKeywordLoc: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node
     */
    expression: Node;
    /**
     * @type Node | null
     */
    body: Node | null;
    /**
     * @type Location
     */
    endKeywordLoc: Location;
    /**
     * Construct a new SingletonClassNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {string[]} locals
     * @param {Location} classKeywordLoc
     * @param {Location} operatorLoc
     * @param {Node} expression
     * @param {Node | null} body
     * @param {Location} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, locals: string[], classKeywordLoc: Location, operatorLoc: Location, expression: Node, body: Node | null, endKeywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `__ENCODING__` keyword.
 *
 *     __ENCODING__
 *     ^^^^^^^^^^^^
 */
export declare class SourceEncodingNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new SourceEncodingNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `__FILE__` keyword.
 *
 *     __FILE__
 *     ^^^^^^^^
 */
export declare class SourceFileNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type RubyString
     */
    filepath: RubyString;
    /**
     * Construct a new SourceFileNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {RubyString} filepath
     */
    constructor(nodeID: number, location: Location, flags: number, filepath: RubyString);
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FROZEN flag.
     *
     * @returns {boolean}
     */
    isFrozen(): boolean;
    /**
     * True if this node has the MUTABLE flag.
     *
     * @returns {boolean}
     */
    isMutable(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `__LINE__` keyword.
 *
 *     __LINE__
 *     ^^^^^^^^
 */
export declare class SourceLineNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new SourceLineNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the splat operator.
 *
 *     [*a]
 *      ^^
 */
export declare class SplatNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    operatorLoc: Location;
    /**
     * @type Node | null
     */
    expression: Node | null;
    /**
     * Construct a new SplatNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} operatorLoc
     * @param {Node | null} expression
     */
    constructor(nodeID: number, location: Location, flags: number, operatorLoc: Location, expression: Node | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a set of statements contained within some scope.
 *
 *     foo; bar; baz
 *     ^^^^^^^^^^^^^
 */
export declare class StatementsNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    body: Node[];
    /**
     * Construct a new StatementsNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} body
     */
    constructor(nodeID: number, location: Location, flags: number, body: Node[]);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a string literal, a string contained within a `%w` list, or plain string content within an interpolated string.
 *
 *     "foo"
 *     ^^^^^
 *
 *     %w[foo]
 *        ^^^
 *
 *     "foo #{bar} baz"
 *      ^^^^      ^^^^
 */
export declare class StringNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location
     */
    contentLoc: Location;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * @type RubyString
     */
    unescaped: RubyString;
    /**
     * Construct a new StringNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} openingLoc
     * @param {Location} contentLoc
     * @param {Location | null} closingLoc
     * @param {RubyString} unescaped
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location | null, contentLoc: Location, closingLoc: Location | null, unescaped: RubyString);
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FROZEN flag.
     *
     * @returns {boolean}
     */
    isFrozen(): boolean;
    /**
     * True if this node has the MUTABLE flag.
     *
     * @returns {boolean}
     */
    isMutable(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `super` keyword with parentheses or arguments.
 *
 *     super()
 *     ^^^^^^^
 *
 *     super foo, bar
 *     ^^^^^^^^^^^^^^
 *
 * If no arguments are provided (except for a block), it would be a `ForwardingSuperNode` instead.
 */
export declare class SuperNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * @type Node | null
     */
    block: Node | null;
    /**
     * Construct a new SuperNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} keywordLoc
     * @param {Location | null} lparenLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location | null} rparenLoc
     * @param {Node | null} block
     */
    constructor(nodeID: number, location: Location, flags: number, keywordLoc: Location, lparenLoc: Location | null, arguments_: ArgumentsNode | null, rparenLoc: Location | null, block: Node | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents a symbol literal or a symbol contained within a `%i` list.
 *
 *     :foo
 *     ^^^^
 *
 *     %i[foo]
 *        ^^^
 */
export declare class SymbolNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location | null
     */
    openingLoc: Location | null;
    /**
     * @type Location
     */
    contentLoc: Location;
    /**
     * @type Location | null
     */
    closingLoc: Location | null;
    /**
     * @type RubyString
     */
    unescaped: RubyString;
    /**
     * Construct a new SymbolNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location | null} openingLoc
     * @param {Location} contentLoc
     * @param {Location | null} closingLoc
     * @param {RubyString} unescaped
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location | null, contentLoc: Location, closingLoc: Location | null, unescaped: RubyString);
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * True if this node has the FORCED_US_ASCII_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUsAsciiEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the literal `true` keyword.
 *
 *     true
 *     ^^^^
 */
export declare class TrueNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * Construct a new TrueNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     */
    constructor(nodeID: number, location: Location, flags: number);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `undef` keyword.
 *
 *     undef :foo, :bar, :baz
 *     ^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class UndefNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Node[]
     */
    names: Node[];
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * Construct a new UndefNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Node[]} names
     * @param {Location} keywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, names: Node[], keywordLoc: Location);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `unless` keyword, either in the block form or the modifier form.
 *
 *     bar unless foo
 *     ^^^^^^^^^^^^^^
 *
 *     unless foo then bar end
 *     ^^^^^^^^^^^^^^^^^^^^^^^
 */
export declare class UnlessNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    unlessKeywordLoc: Location;
    /**
     * @type Node
     */
    predicate: Node;
    /**
     * @type Location | null
     */
    thenKeywordLoc: Location | null;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * @type ElseNode | null
     */
    elseClause: ElseNode | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * Construct a new UnlessNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} unlessKeywordLoc
     * @param {Node} predicate
     * @param {Location | null} thenKeywordLoc
     * @param {StatementsNode | null} statements
     * @param {ElseNode | null} elseClause
     * @param {Location | null} endKeywordLoc
     */
    constructor(nodeID: number, location: Location, flags: number, unlessKeywordLoc: Location, predicate: Node, thenKeywordLoc: Location | null, statements: StatementsNode | null, elseClause: ElseNode | null, endKeywordLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `until` keyword, either in the block form or the modifier form.
 *
 *     bar until foo
 *     ^^^^^^^^^^^^^
 *
 *     until foo do bar end
 *     ^^^^^^^^^^^^^^^^^^^^
 */
export declare class UntilNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    untilKeywordLoc: Location;
    /**
     * @type Location | null
     */
    doKeywordLoc: Location | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * @type Node
     */
    predicate: Node;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * Construct a new UntilNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} untilKeywordLoc
     * @param {Location | null} doKeywordLoc
     * @param {Location | null} endKeywordLoc
     * @param {Node} predicate
     * @param {StatementsNode | null} statements
     */
    constructor(nodeID: number, location: Location, flags: number, untilKeywordLoc: Location, doKeywordLoc: Location | null, endKeywordLoc: Location | null, predicate: Node, statements: StatementsNode | null);
    /**
     * True if this node has the BEGIN_MODIFIER flag.
     *
     * @returns {boolean}
     */
    isBeginModifier(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `when` keyword within a case statement.
 *
 *     case true
 *     when true
 *     ^^^^^^^^^
 *     end
 */
export declare class WhenNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    whenKeywordLoc: Location;
    /**
     * @type Node[]
     */
    conditions: Node[];
    /**
     * @type Location | null
     */
    thenKeywordLoc: Location | null;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * Construct a new WhenNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} whenKeywordLoc
     * @param {Node[]} conditions
     * @param {Location | null} thenKeywordLoc
     * @param {StatementsNode | null} statements
     */
    constructor(nodeID: number, location: Location, flags: number, whenKeywordLoc: Location, conditions: Node[], thenKeywordLoc: Location | null, statements: StatementsNode | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `while` keyword, either in the block form or the modifier form.
 *
 *     bar while foo
 *     ^^^^^^^^^^^^^
 *
 *     while foo do bar end
 *     ^^^^^^^^^^^^^^^^^^^^
 */
export declare class WhileNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    whileKeywordLoc: Location;
    /**
     * @type Location | null
     */
    doKeywordLoc: Location | null;
    /**
     * @type Location | null
     */
    endKeywordLoc: Location | null;
    /**
     * @type Node
     */
    predicate: Node;
    /**
     * @type StatementsNode | null
     */
    statements: StatementsNode | null;
    /**
     * Construct a new WhileNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} whileKeywordLoc
     * @param {Location | null} doKeywordLoc
     * @param {Location | null} endKeywordLoc
     * @param {Node} predicate
     * @param {StatementsNode | null} statements
     */
    constructor(nodeID: number, location: Location, flags: number, whileKeywordLoc: Location, doKeywordLoc: Location | null, endKeywordLoc: Location | null, predicate: Node, statements: StatementsNode | null);
    /**
     * True if this node has the BEGIN_MODIFIER flag.
     *
     * @returns {boolean}
     */
    isBeginModifier(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents an xstring literal with no interpolation.
 *
 *     `foo`
 *     ^^^^^
 */
export declare class XStringNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    openingLoc: Location;
    /**
     * @type Location
     */
    contentLoc: Location;
    /**
     * @type Location
     */
    closingLoc: Location;
    /**
     * @type RubyString
     */
    unescaped: RubyString;
    /**
     * Construct a new XStringNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} openingLoc
     * @param {Location} contentLoc
     * @param {Location} closingLoc
     * @param {RubyString} unescaped
     */
    constructor(nodeID: number, location: Location, flags: number, openingLoc: Location, contentLoc: Location, closingLoc: Location, unescaped: RubyString);
    /**
     * True if this node has the FORCED_UTF8_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedUtf8Encoding(): boolean;
    /**
     * True if this node has the FORCED_BINARY_ENCODING flag.
     *
     * @returns {boolean}
     */
    isForcedBinaryEncoding(): boolean;
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
/**
 * Represents the use of the `yield` keyword.
 *
 *     yield 1
 *     ^^^^^^^
 */
export declare class YieldNode {
    #private;
    /**
     * @type number
     */
    nodeID: number;
    /**
     * @type {Location}
     */
    location: Location;
    /**
     * @type Location
     */
    keywordLoc: Location;
    /**
     * @type Location | null
     */
    lparenLoc: Location | null;
    /**
     * @type ArgumentsNode | null
     */
    arguments_: ArgumentsNode | null;
    /**
     * @type Location | null
     */
    rparenLoc: Location | null;
    /**
     * Construct a new YieldNode.
     *
     * @param {number} nodeID
     * @param {Location} location
     * @param {number} flags
     * @param {Location} keywordLoc
     * @param {Location | null} lparenLoc
     * @param {ArgumentsNode | null} arguments_
     * @param {Location | null} rparenLoc
     */
    constructor(nodeID: number, location: Location, flags: number, keywordLoc: Location, lparenLoc: Location | null, arguments_: ArgumentsNode | null, rparenLoc: Location | null);
    /**
     * Accept a visitor for this node.
     *
     * @param {visitors.Visitor} visitor
     */
    accept(visitor: visitors.Visitor): void;
    /**
     * Returns all child nodes of the current node.
     *
     * @returns {(Node | null)[]} An array of child nodes.
     */
    childNodes(): (Node | null)[];
    /**
     * Compact and return an array of child nodes.
     *
     * @returns {Node[]} An array of compacted child nodes.
     */
    compactChildNodes(): Node[];
    /**
     * Transforms the Node to a JavaScript object.
     *
     * @returns {Object}
     */
    toJSON(): Object;
}
