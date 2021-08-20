const fs = require('fs');

const getRecordClasses = () => {
    const starterPath = __dirname + '/../../src/record';
    return fs.readdirSync(starterPath).map(filename => {
        return require(starterPath + '/' + filename);
    });
};

const syncAll = async () => {
    const recs = getRecordClasses();
    for (const rec of recs) {
        await rec.synchronize();
    }
};

module.exports = {
    syncAll,
};