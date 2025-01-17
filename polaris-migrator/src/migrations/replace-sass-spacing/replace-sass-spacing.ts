import {FileInfo} from 'jscodeshift';
import postcss, {Plugin} from 'postcss';
import valueParser, {Node, WordNode, FunctionNode} from 'postcss-value-parser';

const spacingMap = {
  none: '--p-space-0',
  'extra-tight': '--p-space-1',
  tight: '--p-space-2',
  'base-tight': '--p-space-3',
  '': '--p-space-4',
  base: '--p-space-4',
  loose: '--p-space-5',
  'extra-loose': '--p-space-8',
};

type Spacing = keyof typeof spacingMap;

function isSpacingFn(node: Node): node is FunctionNode {
  return node.type === 'function' && node.value === 'spacing';
}

function isOperator(node: Node): boolean {
  return (
    node.value === '+' ||
    node.value === '-' ||
    node.value === '*' ||
    node.value === '/'
  );
}

const plugin = (): Plugin => ({
  postcssPlugin: 'ReplaceSassSpacing',
  Declaration(decl) {
    const parsed = valueParser(decl.value);

    // Skip if the value contains calculations
    const containsCalculation = parsed.nodes.some(isOperator);
    if (containsCalculation) return;

    parsed.walk((node) => {
      if (!isSpacingFn(node)) return;
      const hasNodes = Boolean(node.nodes && node.nodes.length);
      const spacing = hasNodes ? node.nodes[0].value : '';
      const newSpacing = spacingMap[spacing as Spacing];

      node.value = 'var';
      node.nodes = hasNodes ? node.nodes : [{type: 'word'} as WordNode];
      node.nodes[0].value = newSpacing;
    });

    decl.value = parsed.toString();
  },
});

export default function replaceSassSpacing(file: FileInfo) {
  return postcss(plugin()).process(file.source, {
    syntax: require('postcss-scss'),
  }).css;
}
