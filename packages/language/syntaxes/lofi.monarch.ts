// Monarch syntax highlighting for the lofi language.
export default {
    keywords: [
        'html','md'
    ],
    operators: [
        
    ],
    symbols: /(?:)/,

    tokenizer: {
        initial: [
            { regex: /synthetic:indent/, action: {"token":"INDENT"} },
            { regex: /synthetic:dedent/, action: {"token":"DEDENT"} },
            { regex: /"[^"]*"/, action: {"token":"string"} },
            { regex: /[0-9]+/, action: {"token":"NUMBER"} },
            { regex: /true|false|yes|no/, action: {"token":"BOOLEAN"} },
            { regex: /[a-zA-Z_][a-zA-Z0-9_-]*=/, action: {"token":"ATTR_NAME"} },
            { regex: /[a-zA-Z_][a-zA-Z0-9_-]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /(?![a-zA-Z_"0-9=:#])[^\r\n]+/, action: {"token":"white"} },
            { regex: /[\t ]+/, action: {"token":"white"} },
            { regex: /[\r\n]+/, action: {"token":"white"} },
            { regex: /#[^\r\n]*/, action: {"token":"comment"} },
        ],
        comment: [
        ],
    }
};
