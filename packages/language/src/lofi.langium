/*
 * lofi.md Grammar
 *
 * Design: ID for all identifiers, semantic validation for keywords
 * - All element names are ID tokens (no KEYWORD terminal)
 * - ATTR_NAME terminal includes '=' for lexer-level disambiguation
 * - Validator checks element.keyword ∈ VALID_KEYWORDS (single source of truth)
 * - All attrs require = (eliminates boolean shorthand ambiguity)
 * - Post-lexer collapsing handles raw content in md/html blocks
 *
 * Architecture (Hickey-compliant):
 * - Lexer: produces tokens (ID, ATTR_NAME, STRING, NUMBER, BOOLEAN)
 * - Parser: structural meaning from position
 * - Validator: semantic checks (is this a valid element name?)
 *
 * Why ATTR_NAME includes '='?
 * - LL(1) parser can't disambiguate ID (element) from ID (attr) without lookahead
 * - ATTR_NAME=/name=/ lexes differently from ID=/name/
 * - Parser sees ATTR_NAME → definitely attribute, ID → definitely element
 * - Post-processing strips trailing '=' for clean API
 */

grammar Lofi

entry Document:
    elements+=TopLevelElement*;

TopLevelElement:
    Element | MdBlock | HtmlBlock;

Element:
    keyword=ID content=STRING? attrs+=Attribute*
    (INDENT children+=ChildElement* DEDENT)?;

ChildElement:
    Element | MdBlock | HtmlBlock;

MdBlock:
    'md' INDENT lines+=RAW_LINE+ DEDENT;

HtmlBlock:
    'html' INDENT lines+=RAW_LINE+ DEDENT;

/*
 * Attribute parsing:
 * - All attrs require = sign: name=value
 * - Boolean attrs use =true, =false, =1, =0, =yes, =no
 * - This eliminates ambiguity between attrs and sibling elements
 */
Attribute:
    name=ATTR_NAME value=(STRING | NUMBER | BOOLEAN | ID);

/*
 * TERMINALS
 * - No KEYWORD terminal — all identifiers are ID
 * - BOOLEAN before ID (to match true/false first)
 * - RAW_LINE is simple — post-lexer collapsing handles block content
 */

terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';

terminal STRING: /"[^"]*"/;
terminal NUMBER: /[0-9]+/;
terminal BOOLEAN: /true|false|yes|no/;
terminal ATTR_NAME: /[a-zA-Z_][a-zA-Z0-9_-]*=/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_-]*/;

/*
 * RAW_LINE: Pattern for md/html block content
 * Must NOT match element-like patterns (handled by post-lexer collapsing)
 * Negative lookahead excludes: identifiers, strings, numbers, =, :, #
 */
terminal RAW_LINE: /(?![a-zA-Z_"0-9=:#])[^\r\n]+/;

hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;
hidden terminal COMMENT: /#[^\r\n]*/;
