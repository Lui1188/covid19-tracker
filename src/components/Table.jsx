import React from 'react';

import numeral from 'numeral';

import styles from './Table.module.css';

function TableOne({ countries }) {
    return (
        <div className={styles.tables}>
            <table className={styles.tableOne}>
                <tr className={styles.header}>
                    <th>County</th>
                    <th>Cases 1M pop</th>
                    <th>Tests 1M pop</th>
                    <th>Population</th>
                </tr>
                {countries.map(({ country, population, casesPerOneMillion, testsPerOneMillion }) => (
                    <tr className={styles.body}>
                        <td>{country}</td>
                        <td>
                            <strong>{numeral(casesPerOneMillion).format("0,0")}</strong>
                        </td>
                        <td>
                            <strong>{numeral(testsPerOneMillion).format("0,0")}</strong>
                        </td>
                        <td>
                            <strong>{numeral(population).format("0,0")}</strong>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

function TableTotal({ countries }) {
    return (
        <div className={styles.tables}>
            <table className={styles.tableTotal}>
                <thead>
                    <tr className={styles.header}>
                        <th>County</th>
                        <th>Cases</th>
                        <th>Tests</th>
                    </tr>
                </thead>
                <tbody>
                    {countries.map(({ country, cases, tests }) => (
                        <tr className={styles.body}>
                            <td>{country}</td>
                            <td>
                                <strong>{numeral(cases).format("0,0")}</strong>
                            </td>
                            <td>
                                <strong>{numeral(tests).format("0,0")}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export { TableOne, TableTotal };
