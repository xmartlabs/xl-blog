import { constants } from '../config/constants';

const { errorText } = constants;

/**
 * Utility function to concat classNames.
 *
 * Usage: classnames('css_class1', 'css_class1')
 *
 * Can be used with objects where the keys are css classes and the
 * values are booleans that decide if classes are active or not:
 *
 * Example: classnames('input', { 'input-error': has_errors })
 *
 * @param  {...any} args
 * @returns string
 */
function classnames(...args) {
  if (args.length === 1) {
    const [firstEntry] = args;
    if (firstEntry && typeof firstEntry === 'object') {
      /* firstEntry's keys whose value is truthy */
      const activeClasses = Object.entries(firstEntry)
        .filter(([, value]) => value).map(([key]) => key);
      return activeClasses.join(' ');
    }
    return firstEntry;
  }
  return args.filter((entry) => !!entry).map((value) => classnames(value)).join(' ');
}

const translateErrors = (error = {}) => {
  const result = {};
  Object.keys(error).forEach((key) => {
    result[key] = error[key].map((value) => errorText[key][value]).join('\n');
  });
  return result;
};

export { classnames, translateErrors };
