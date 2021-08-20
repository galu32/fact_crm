const forceEscape = (str) => `\`${str}\``;

const parseType = (type, length) => {
    switch(type) {
    case 'integer':
        return 'INT';
    case 'double':
        return 'DOUBLE';
    case 'boolean':
        'TINYINT(1)';
    default: 
        return `VARCHAR(${length || 255})`;
    }
};

const getFieldAlter = ({type, fieldName, length, auto_increment}) => {
    return `${fieldName} ${parseType(type,length)}${auto_increment ? ' AUTO_INCREMENT ' : ''}`;
};

const getFieldsAlter = (fieldsArray) => {
    return fieldsArray.map(field => getFieldAlter(field))
        .join(', \n');
};

module.exports = {
    
    CREATE_TABLE: (table, fields) => 
        ({ SQL: `CREATE TABLE IF NOT EXISTS ${forceEscape(table)} (
            ${getFieldsAlter(fields)},
            PRIMARY KEY (internalId)
            ) ENGINE=INNODB;`,
        PLACEHOLDERS: [],
        }),

    UPDATE: (table, fields) => 
        ({ SQL: `UPDATE ${forceEscape(table)} SET ? WHERE internalId = ?;`,
            PLACEHOLDERS: [fields, fields.internalId]
        }),

    INSERT: (table, fields) => 
        ({ SQL: `INSERT INTO ${forceEscape(table)} SET ?;`,
            PLACEHOLDERS: [fields]
        }),

    DELETE: (table, internalId, deleteField = 'internalId') => 
        ({ SQL: `DELETE FROM ${forceEscape(table)} WHERE ${deleteField} = ?;`,
            PLACEHOLDERS: [internalId]
        }),

    BRING: (table, internalId, bringField = 'internalId') =>
        ({ SQL: `SELECT * FROM ${forceEscape(table)} WHERE ${bringField} = ?;`,
            PLACEHOLDERS: [internalId]
        }),

    FIND_ALL: (table) => 
        ({ SQL: `SELECT * FROM ${forceEscape(table)};`,
            PLACEHOLDERS: []
        }),

};