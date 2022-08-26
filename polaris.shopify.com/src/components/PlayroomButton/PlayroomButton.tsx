import {createUrl} from 'playroom';

const getAppCode = (code: string) => {
  const lineWithFunctionName = code
    .split('\n')
    .filter((name) => name.match(/function .*Example/g))?.[0];
  const functionName = lineWithFunctionName
    ? lineWithFunctionName.replace('function ', '').replace('() {', '')
    : 'Example';
  const exportLine = `export default ${functionName};`;
  let appCode = '';

  appCode += code;
  appCode += '\n';
  appCode += exportLine;

  return appCode;
};

interface Props {
  className: string;
  code: string;
}

const PlayroomButton = (props: Props) => {
  const {className, code} = props;

  const encodedCode = createUrl({
    // TODO: Don't hard code this
    baseUrl: '/sandbox/',
    code: getAppCode(code), //encodeURL(getAppCode(code));
    themes: ['locale:en'],
  });

  return (
    <a href={encodedCode} className={className}>
      Edit in Playroom
    </a>
  );
};

export default PlayroomButton;
