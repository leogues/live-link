export type CssVariableHelper = {
  get: ({ variableName }: getProps) => string;
  set: ({ variableName, value }: setProps) => void;
};

export type getProps = {
  variableName: string;
};

export type setProps = {
  variableName: string;
  value: string;
};

export const cssVariableHelper = (element: HTMLElement): CssVariableHelper => {
  const get = ({ variableName }: getProps): string => {
    const formatedVariableName = `--${variableName}`;
    return getComputedStyle(element).getPropertyValue(formatedVariableName);
  };

  const set = ({ variableName, value }: setProps): void => {
    const formatedVariableName = `--${variableName}`;
    element.style.setProperty(formatedVariableName, value);
  };

  return { get, set };
};
