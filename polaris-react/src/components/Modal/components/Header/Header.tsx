import React from 'react';

import {DisplayText} from '../../../DisplayText';
import {CloseButton} from '../CloseButton';

import styles from './Header.scss';

export interface HeaderProps {
  id: string;
  titleHidden: boolean;
  closing: boolean;
  children?: React.ReactNode;
  onClose(): void;
}

export function Header({
  id,
  titleHidden,
  closing,
  children,
  onClose,
}: HeaderProps) {
  return (
    <div
      className={titleHidden || !children ? styles.titleHidden : styles.Header}
    >
      <div id={id} className={styles.Title}>
        <DisplayText element="h2" size="small">
          {children}
        </DisplayText>
      </div>
      <CloseButton
        pressed={closing}
        titleHidden={titleHidden}
        onClick={onClose}
      />
    </div>
  );
}
