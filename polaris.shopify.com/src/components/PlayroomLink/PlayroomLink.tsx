import {createUrl} from 'playroom';
import styles from './PlayroomLink.module.scss';

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
  code: string;
}

const PlayroomButton = (props: Props) => {
  const {code} = props;

  const encodedCode = createUrl({
    // TODO: Don't hard code this
    baseUrl: '/sandbox/',
    code: getAppCode(code), //encodeURL(getAppCode(code));
    themes: ['locale:en'],
  });

  return (
    <a href={encodedCode} className={styles.Link}>
      Edit in Playroom
    </a>
  );
};

export default PlayroomButton;
