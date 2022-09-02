import {createContext, useContext, useState} from 'react';
import {TypeData, TypeDataTree} from '../../types';
import styles from './PropsTable.module.scss';
import Longform from '../Longform';
import {motion, AnimatePresence} from 'framer-motion';

interface Props {
  componentName: string;
  allTypeData: TypeDataTree;
}

function syntaxKindToDeveloperFriendlyString(
  syntaxKind: string | undefined,
): string {
  if (syntaxKind === 'EnumDeclaration') {
    return `enum`;
  } else if (syntaxKind === 'TypeAliasDeclaration') {
    return `type`;
  }
  return `interface`;
}

const toPascalCase = (str: string) =>
  (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join('');

const TypeDataContext = createContext<{
  allTypeData: TypeDataTree;
}>({allTypeData: {}});

function PropsTable({allTypeData, componentName}: Props) {
  const feedbackTitle = '[polaris.shopify.com] Props table feedback';
  const feedbackUrl = `https://github.com/shopify/polaris/issues/new?title=${encodeURIComponent(
    feedbackTitle,
  )}&amp;labels=polaris.shopify.com`;

  const propsName = `${toPascalCase(componentName).replace(/\s/g, '')}Props`;
  const propsForComponent = allTypeData[propsName];

  if (!propsForComponent) {
    throw new Error('Could not find props for component');
  }

  console.log(allTypeData);

  const propsAreDefinedUsingInterface = !!propsForComponent.members;

  return (
    <TypeDataContext.Provider value={{allTypeData}}>
      <div className={styles.PropsTable}>
        <Longform firstParagraphIsLede={false}>
          <h2 id="props">Props</h2>
          <p>
            Want to help make this feature better? Please{' '}
            <a href={feedbackUrl}>share your feedback</a>.
          </p>
        </Longform>

        {!propsAreDefinedUsingInterface && (
          <div className={styles.UnparsablePropsWarning}>
            <p>{`This component uses prop types that our website can't automatically parse.`}</p>
          </div>
        )}

        <InterfaceList allTypeData={allTypeData} typeData={propsForComponent} />
      </div>
    </TypeDataContext.Provider>
  );
}

type ExpandedTypeInfo = {memberName: string | null; typeName: string};

const ExpandedTypesContext = createContext<{
  expandedTypes: ExpandedTypeInfo[];
  expandType: (typeName: string) => void;
}>({expandType: () => undefined, expandedTypes: []});

function InterfaceList({
  allTypeData,
  typeData,
}: {
  allTypeData: TypeDataTree;
  typeData: TypeData;
  level?: number;
}) {
  const [expandedTypes, setExpandedTypes] = useState<ExpandedTypeInfo[]>([]);

  return (
    <motion.div
      className={styles.InterfaceList}
      initial={{opacity: 0, scale: 0.7}}
      animate={{opacity: 1, scale: 1}}
    >
      <div className={styles.InterfaceListHeader}>
        {syntaxKindToDeveloperFriendlyString(typeData.syntaxKind)}{' '}
        {typeData.name}
      </div>

      {!typeData.members && (
        <ExpandedTypesContext.Provider
          value={{
            expandedTypes,
            expandType: (typeName: string) => {
              setExpandedTypes([
                {typeName, memberName: null},
                ...expandedTypes,
              ]);
            },
          }}
        >
          <div className={styles.RawInterfaceValue}>
            <Highlighter type={typeData.value.toString()} />

            {expandedTypes
              .filter((expanded) => expanded.memberName === null)
              .map((expanded) => {
                const typeDataForExpandedType = allTypeData[expanded.typeName];
                if (!typeDataForExpandedType) return null;
                return (
                  <InterfaceList
                    key={expanded.typeName}
                    allTypeData={allTypeData}
                    typeData={typeDataForExpandedType}
                  />
                );
              })}
          </div>
        </ExpandedTypesContext.Provider>
      )}

      {typeData.members && (
        <dl>
          {typeData.members.map(
            ({name, isOptional, description, defaultValue, value}) => {
              const expandType = (typeName: string) =>
                setExpandedTypes([
                  {typeName, memberName: name},
                  ...expandedTypes,
                ]);

              return (
                <ExpandedTypesContext.Provider
                  key={name}
                  value={{expandedTypes, expandType}}
                >
                  <span className={styles.Row}>
                    <dt className={styles.Key}>
                      <span className={styles.MemberName}>
                        {name}
                        {isOptional && <span>?</span>}
                      </span>
                      <span className={styles.ValueText}>
                        <Highlighter type={value.toString()} />
                      </span>
                    </dt>
                    <dd className={styles.Value}>
                      <span className={styles.Description}>
                        {description}
                        {defaultValue && (
                          <>
                            {'. Defaults to '}
                            <span className={styles.Default}>
                              <Highlighter type={defaultValue} />
                            </span>
                            .
                          </>
                        )}
                      </span>

                      <AnimatePresence initial={false}>
                        {expandedTypes
                          .filter((expanded) => expanded.memberName === name)
                          .map((expanded) => {
                            const typeDataForExpandedType =
                              allTypeData[expanded.typeName];
                            if (!typeDataForExpandedType) return null;
                            return (
                              <InterfaceList
                                key={expanded.typeName}
                                allTypeData={allTypeData}
                                typeData={typeDataForExpandedType}
                              />
                            );
                          })}
                      </AnimatePresence>
                    </dd>
                  </span>
                </ExpandedTypesContext.Provider>
              );
            },
          )}
        </dl>
      )}
    </motion.div>
  );
}

function Highlighter({
  type,
  prev = '',
}: {
  type: string;
  prev?: string;
}): JSX.Element {
  const {expandType} = useContext(ExpandedTypesContext);
  const {allTypeData} = useContext(TypeDataContext);
  const [hasBenExpanded, setHasBenExpanded] = useState(false);

  const isString =
    type === 'string' ||
    type.match(/^['][^']+'$/) !== null ||
    type.match(/^["][^"]+"$/) !== null;
  const isType = type.match(/^[A-Z][A-Za-z]+$/) || type === 'any';

  if (isString) {
    return <span className={styles.SyntaxString}>{type}</span>;
  } else if (type === 'boolean') {
    return <span className={styles.SyntaxBoolean}>{type}</span>;
  } else if (type === 'number' || !Number.isNaN(parseInt(type))) {
    return <span className={styles.SyntaxNumber}>{type}</span>;
  } else if (isType) {
    const referencedType = allTypeData[type];
    const referencedTypeExists = !!referencedType;
    const typeCanBeExpanded = referencedTypeExists && !hasBenExpanded;
    let autoInlinedValue =
      referencedType &&
      !referencedType.members &&
      typeof referencedType.value === 'string'
        ? referencedType.value
        : undefined;

    if (autoInlinedValue) {
      const needsParenthesesToMakeSense =
        prev.includes('&') || prev.includes('|');
      if (needsParenthesesToMakeSense) {
        autoInlinedValue = `(${autoInlinedValue})`;
      }
    }

    if (autoInlinedValue) {
      return <Highlighter type={autoInlinedValue} prev={type} />;
    }

    return (
      <span className={styles.SyntaxType}>
        {typeCanBeExpanded ? (
          <button
            className={styles.ExpandableType}
            onClick={() => {
              expandType(type);
              setHasBenExpanded(true);
            }}
          >
            {type}
          </button>
        ) : (
          <span>{type}</span>
        )}
      </span>
    );
  } else if (type.match(/^[a-z]+$/gi) !== null) {
    return <span className={styles.SyntaxKeyword}>{type}</span>;
  } else {
    if (prev === type) {
      return <>{type}</>;
    }
    const tokenRegex = /([^a-z0-9'"/-]+)/gi;
    const tokens = type.split(tokenRegex);
    return (
      <>
        {tokens.map((token, i) => {
          return (
            <Highlighter key={prev + token + i} type={token} prev={type} />
          );
        })}
      </>
    );
  }
}

export default PropsTable;
