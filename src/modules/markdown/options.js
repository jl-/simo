import * as List from './list';
import * as Heading from './heading';
import * as Quotation from './quotation';

export const builtinPatterns = [
    List, Heading, Quotation
];

export function mergePatterns (patterns) {
    return patterns || builtinPatterns;
}
