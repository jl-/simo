import * as list from './list';
import * as heading from './heading';
import * as quotation from './quotation';

export const builtinPatterns = [
    heading, list, quotation
];

export function mergePatterns (patterns) {
    return patterns || builtinPatterns;
}
