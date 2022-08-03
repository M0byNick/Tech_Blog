module.exports = {
    format_date: date => {
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
    },
    format_plural_words: (word, count) => {
        if(count !== 1) {
            return `${words}s`;
        }
        return word;
    }
};