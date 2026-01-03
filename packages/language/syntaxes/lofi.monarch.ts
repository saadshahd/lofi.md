// Monarch syntax highlighting for the lofi language.
export default {
    keywords: [
        'html','md'
    ],
    operators: [
        ':','='
    ],
    symbols: /:|=/,

    tokenizer: {
        initial: [
            { regex: /synthetic:indent/, action: {"token":"INDENT"} },
            { regex: /synthetic:dedent/, action: {"token":"DEDENT"} },
            { regex: /page|section|card|grid|modal|nav|tabs|menu|form|alert|breadcrumb|button|input|checkbox|radio|dropdown|textarea|link|tab|accordion|toggle|slider|heading|text|image|icon|badge|toast|avatar|progress|chart/, action: {"token":"KEYWORD"} },
            { regex: /"[^"]*"/, action: {"token":"string"} },
            { regex: /[0-9]+/, action: {"token":"NUMBER"} },
            { regex: /[a-zA-Z_][a-zA-Z0-9_-]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /(?!(?:page|section|card|grid|modal|nav|tabs|menu|form|alert|breadcrumb|button|input|checkbox|radio|dropdown|textarea|link|tab|accordion|toggle|slider|heading|text|image|icon|badge|toast|avatar|progress|chart)(?:\s*"|\s+[a-zA-Z_][a-zA-Z0-9_-]*=))(?!(?:md|html)(?:\s*:|\s))(?!#)(?!=)(?!:)(?!")(?![a-zA-Z_][a-zA-Z0-9_-]*\s*=)(?=[^\r\n]*[^a-zA-Z0-9_\-\r\n])[^\r\n]+/, action: {"token":"white"} },
            { regex: /[\t ]+/, action: {"token":"white"} },
            { regex: /[\r\n]+/, action: {"token":"white"} },
            { regex: /#[^\r\n]*/, action: {"token":"comment"} },
        ],
        comment: [
        ],
    }
};
