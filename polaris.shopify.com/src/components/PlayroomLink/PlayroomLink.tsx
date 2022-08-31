import {createUrl} from 'playroom';

const getAppCode = (code: string) => {
  const codeLines = code.split('\n');
  let lineWithFunctionName = codeLines.findIndex((name) =>
    name.match(/function .*Example/g),
  );

  if (lineWithFunctionName === -1) {
    lineWithFunctionName = 0;
  }

  return `{(${codeLines.slice(lineWithFunctionName).join('\n').trim()})()}`;
};

interface Props {
  className: string;
  code: string;
}

const PlayroomButton = (props: Props) => {
  const {code, className} = props;

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
