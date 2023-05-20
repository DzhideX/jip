const { Index } = require("flexsearch");

// const index = new Index("memory");

// This option indexes every possible word combination, resulting in a much better search experience.
// However, it also results in a much larger index. Due to the smaller number of JIPs at the moment.
// If the index starts getting too large, we can revisit this in the future.
// Link to docs: https://github.com/nextapps-de/flexsearch#tokenizer-prefix-search

const index = new Index({
  tokenize: "full",
});

export default index;
