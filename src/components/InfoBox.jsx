import React from 'react';

import { Card, CardContent, Typography } from '@material-ui/core';
import numeral from 'numeral';

import styles from './InfoBox.module.css';

function InfoBox({ title, cases, total, active, isRed, isGrey, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`${styles.infoBox} ${active && styles.selected} ${isRed && styles.red} ${isGrey && styles.grey}`}>
            <CardContent>
                <Typography className={styles.title} >
                    {title}
                </Typography>
                <h2 className={styles.cases}>{numeral(cases).format("0,0")}</h2>
                <Typography className={styles.total} >
                    <h5>Total</h5> {numeral(total).format("0,0")}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
