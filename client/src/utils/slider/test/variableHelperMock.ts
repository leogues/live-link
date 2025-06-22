import { getProps, setProps } from '../../cssVariableHelper';

export const variableMock = {
  ['slider-item-width-aspect']: '16',
  ['slider-item-height-aspect']: '9',
  ['slider-item-margin']: '20px',
  ['slider-index']: '0',
  ['slider-height']: '0px',
  ['slider-items-per-row']: '0',
};

export const variableHelper = () => {
  const get = ({ variableName }: getProps): string => {
    const variableKey = variableName as keyof typeof variableMock;
    return variableMock[variableKey];
  };

  const set = ({ variableName, value }: setProps): void => {
    const variableKey = variableName as keyof typeof variableMock;
    variableMock[variableKey] = value;
  };

  return {
    get,
    set,
  };
};
