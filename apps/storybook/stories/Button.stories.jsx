// TODO: Visual regression test for button element
//
// Pattern:
// import { parse } from '@lofi/language';
// import { generate } from '@lofi/html';
//
// const meta = {
//   title: 'Elements/Button',
//   render: (args) => {
//     const ast = parse(`button "${args.label}" ${args.variant}`);
//     const html = generate(ast);
//     return <div dangerouslySetInnerHTML={{ __html: html }} />;
//   },
// } satisfies Meta;

export default { title: "Elements/Button" };
export const Primary = () => <div>TODO: generate()</div>;
