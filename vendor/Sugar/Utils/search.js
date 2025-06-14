// calculate, how many string `a`
// requires edits, to become string `b`
const searchStringEditDistance = (a, b) => {
    // Levenshtein distance
    // https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    if (a === b)
        return 0;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
};
// calculate, how many characters string `b`
// contains of a string `a`
const searchCharsContains = (a, b) => {
    if (a === b) {
        return a.length;
    }
    let contains = 0;
    const ind = new Set();
    for (let i = 0; i < b.length; i++) {
        ind.add(b.charAt(i));
    }
    for (let i = 0; i < a.length; i++) {
        if (ind.has(a.charAt(i))) {
            contains++;
        }
    }
    return contains;
};
// tokenize string into array of tokens
const searchStringTokenize = (name) => {
    const tokens = [];
    // camelCase
    // upperCASE123
    const string = name.replace(/([^A-Z])([A-Z][^A-Z])/g, '$1 $2').replace(/([A-Z0-9]{2,})/g, ' $1');
    // space notation
    // dash-notation
    // underscore_notation
    const parts = string.split(/([\s\-_])/);
    // filter valid tokens
    for (let i = 0; i < parts.length; i++) {
        parts[i] = parts[i].toLowerCase().trim();
        if (parts[i] && parts[i] !== '-' && parts[i] !== '_') {
            tokens.push(parts[i]);
        }
    }
    return tokens;
};
const _searchItems = (items, search, args) => {
    const results = [];
    for (const item of items) {
        // direct hit
        if (item.subFull !== Infinity) {
            results.push(item);
            if (item.edits === Infinity) {
                item.edits = 0;
            }
            if (item.sub === Infinity) {
                item.sub = item.subFull;
            }
            continue;
        }
        else if (item.name === search || item.name.indexOf(search) === 0) {
            results.push(item);
            if (item.edits === Infinity) {
                item.edits = 0;
            }
            if (item.sub === Infinity) {
                item.sub = 0;
            }
            continue;
        }
        // check if name contains enough of search characters
        const contains = searchCharsContains(search, item.name);
        if (contains / search.length < args.containsCharsTolerance) {
            continue;
        }
        let editsCandidate = Infinity;
        let subCandidate = Infinity;
        // for each token
        for (let t = 0; t < item.tokens.length; t++) {
            // direct token match
            if (item.tokens[t] === search) {
                editsCandidate = 0;
                subCandidate = t;
                break;
            }
            const edits = searchStringEditDistance(search, item.tokens[t]);
            if ((subCandidate === Infinity || edits < editsCandidate) && item.tokens[t].indexOf(search) !== -1) {
                // search is a substring of a token
                subCandidate = t;
                editsCandidate = edits;
                continue;
            }
            else if (subCandidate === Infinity && edits < editsCandidate) {
                // new edits candidate, not a substring of a token
                if ((edits / Math.max(search.length, item.tokens[t].length)) <= args.editsDistanceTolerance) {
                    // check if edits tolerance is satisfied
                    editsCandidate = edits;
                }
            }
        }
        // no match candidate
        if (editsCandidate === Infinity) {
            continue;
        }
        // add new result
        results.push(item);
        item.edits = item.edits === Infinity ? editsCandidate : item.edits + editsCandidate;
        item.sub = item.sub === Infinity ? subCandidate : item.sub + subCandidate;
    }
    return results;
};
/**
 * Perform search through items.
 *
 * @param items - Array of objects to search through.
 * @param searchKey - The property name to search within each item.
 * @param search - String to search for.
 * @param args - Search arguments.
 * @returns Array of found items.
 * @example
 * const items = [
 *     { text: 'Item 1', id: 1 },
 *     { text: 'Item 2', id: 2 }
 * ];
 * const results = searchItems(items, 'text', 'item');
 */
const searchItems = (items, searchKey, search = '', args = {}) => {
    var _a, _b;
    search = search.toLowerCase().trim();
    if (!search)
        return [];
    const searchTokens = searchStringTokenize(search);
    if (!searchTokens.length)
        return [];
    args.containsCharsTolerance = (_a = args.containsCharsTolerance) !== null && _a !== void 0 ? _a : 0.5;
    args.editsDistanceTolerance = (_b = args.editsDistanceTolerance) !== null && _b !== void 0 ? _b : 0.5;
    let records = items.map((item) => {
        const subInd = item[searchKey].toLowerCase().trim().indexOf(search);
        return {
            name: item[searchKey],
            item: item,
            tokens: searchStringTokenize(item[searchKey]),
            edits: Infinity,
            subFull: (subInd !== -1) ? subInd : Infinity,
            sub: Infinity
        };
    });
    // search each token
    for (let i = 0; i < searchTokens.length; i++) {
        records = _searchItems(records, searchTokens[i], args);
    }
    // sort result first by substring? then by edits number
    records.sort((a, b) => {
        if (a.subFull !== b.subFull) {
            return a.subFull - b.subFull;
        }
        else if (a.sub !== b.sub) {
            return a.sub - b.sub;
        }
        else if (a.edits !== b.edits) {
            return a.edits - b.edits;
        }
        return a.name.length - b.name.length;
    });
    // return only items without match information
    let recordItems = records.map((record) => record.item);
    // limit number of results
    if (args.hasOwnProperty('limitResults') && recordItems.length > args.limitResults) {
        recordItems = recordItems.slice(0, args.limitResults);
    }
    return recordItems;
};

export { searchItems };
//# sourceMappingURL=search.js.map
