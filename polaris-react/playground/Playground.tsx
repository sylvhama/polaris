import React, {useState, useCallback} from 'react';

import {Page, Frame, Toast, Button} from '../src';

export function Playground() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="It's toasty" onDismiss={toggleActive} />
  ) : null;

  return (
    <div style={{height: '250px'}}>
      <Frame>
        <Page title="Toast example using Box">
          <Button onClick={toggleActive}>Show Toast (with 📦)</Button>
          {toastMarkup}
        </Page>
      </Frame>
    </div>
  );
}
