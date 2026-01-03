// TODO: Implement full grammar from ROADMAP.md preview
// See .claude/rules/langium.md for patterns

grammar Lofi

entry Document: elements+=Element*;

Element: keyword=KEYWORD;

terminal KEYWORD: /page|card|button/;
