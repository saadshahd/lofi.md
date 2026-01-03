/*
 * lofi.md Grammar
 * SYNC: If adding keywords, update both KEYWORD and RAW_LINE patterns
 */

grammar Lofi

entry Document:
    elements+=TopLevelElement*;

TopLevelElement:
    Element | MdBlock | HtmlBlock;

Element:
    keyword=KEYWORD content=STRING? attrs+=Attribute*
    (INDENT children+=ChildElement* DEDENT)?;

ChildElement:
    Element | MdBlock | HtmlBlock;

MdBlock:
    'md' (
        ':' content=RAW_LINE |
        INDENT lines+=RAW_LINE* DEDENT
    );

HtmlBlock:
    'html' INDENT lines+=RAW_LINE* DEDENT;

Attribute:
    name=ID '=' value=(STRING | NUMBER | ID) |
    name=ID;

/*
 * TERMINALS
 * - Order matters for same-length matches
 * - RAW_LINE before ID for priority
 * - WS and NL must be separate for IndentationAwareTokenBuilder
 */

terminal INDENT: 'synthetic:indent';
terminal DEDENT: 'synthetic:dedent';

terminal KEYWORD: /page|section|card|grid|modal|nav|tabs|menu|form|alert|breadcrumb|button|input|checkbox|radio|dropdown|textarea|link|tab|accordion|toggle|slider|heading|text|image|icon|badge|toast|avatar|progress|chart/;

terminal STRING: /"[^"]*"/;
terminal NUMBER: /[0-9]+/;

terminal RAW_LINE: /(?!(?:page|section|card|grid|modal|nav|tabs|menu|form|alert|breadcrumb|button|input|checkbox|radio|dropdown|textarea|link|tab|accordion|toggle|slider|heading|text|image|icon|badge|toast|avatar|progress|chart)(?:\s*"|\s+[a-zA-Z_][a-zA-Z0-9_-]*=))(?!(?:md|html)(?:\s*:|\s))(?!#)(?!=)(?!:)(?!")(?![a-zA-Z_][a-zA-Z0-9_-]*\s*=)(?=[^\r\n]*[^a-zA-Z0-9_\-\r\n])[^\r\n]+/;

terminal ID: /[a-zA-Z_][a-zA-Z0-9_-]*/;

hidden terminal WS: /[\t ]+/;
hidden terminal NL: /[\r\n]+/;
hidden terminal COMMENT: /#[^\r\n]*/;
