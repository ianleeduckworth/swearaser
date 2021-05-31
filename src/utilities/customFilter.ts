import Filter = require('bad-words');
const customFilter = new Filter();

/**
 * A list of words that are not part of the filter, that should also be flagged
 */
const blackList: string[] = [
    'rangus',
    'dangus',
    'dong',
];

/**
 * A list of words commonly thought of as profane that should not be flagged
 */
const whiteList: string[] = [];

const state = {
    configComplete: false,
};

function configure() {
    customFilter.addWords(...blackList);
    customFilter.removeWords(...whiteList);
    state.configComplete = true;
}

export default {
    isProfane: function(word: string) {
        const { configComplete } = state; 
        if (!configComplete) {
            configure();
        }
        
        return customFilter.isProfane(word);
    },
    refreshLists: function() {
        configure();
    }
};