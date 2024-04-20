import React from 'react'
import styles from './index.module.scss'
import { IRankItem } from '../type'
import { Avatar, Typography } from '@web3uikit/core'
import classNames from 'classnames'

const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAAAXNSR0IArs4c6QAAAw1JREFUeF7tnLtrFFEUxs+dzJrdjQkxGDQ+wQek0FipjQr+A6JgYWelf0DAJhZ26cRGELHRFDFWimCRwkK0EC0UEVxfQTFZIqy70XXc3ew85DYZFvaec3dnIix+086ZO/f+5tsz35x776qlxXsRJTzmCmWaerrItnJ46wC9XPbYmL3D/fR5pZGoNwc25+jhmf2J2tAXK4BpzxBgDNoCGIDpLO1AMVAMFJPO63r+9W3Wx2hfof0Fd8x/+UlPvlXZmDAiagQhG1NdDWlwg8PG5Fz+fM0P6drJXWwbNmNS/Vcus2BsTNe58RGaPr6D7Yw2gNoIcofNvRYuTLBtvC3V6NT9j4nNJsCYki8UY3C+AAMwawRsPmiRY5BjYgJQjEENVmDO373K+phy3aeRrCv6aRsfIzVSqQe0KdvHhkn30T5m9t2P5AYvjUKVNOBePJ/K13UvDlzqM8CsZ9lBot+L56EYKKYz3UIxUEyHipEM3u6Ndbp0yGdbdckjnwbYmKYapJra3lnv2kQPhQW2DYeaFFKGjZl5H9KL0hAbI35Ent3XR3dOLAuDHqZMtMLG/HLGUwGzJXjM3sdXeXKjP2zMzQ9jNPmMf9gA0+3XNRRjIAcwANNCADkGOSYmgLeSQQ1WYCoLk2wFz6GAGpmDrC+YK5RoprDKxuRdRZ6v2Bg9vSpNwSrip3kVBfTo9E72PqVqkcayvO9S/teLLBjtWMvOEQFMb63By0VLJDlogDElXyimPRkoBoqJCSDHGNQAMAATE7BZMm+lGGkm0mbpVq8tNbPpr1gMBxjD7xFgAKa1HoMcY3C+AAMwawTwVjLkTSsw0l4CvUfgwacKW48Zzbs0dXQbG3P91Xcq/m4mLlRJS83S6q9YDLdZ32+z2E8PSD+ppMeeW2/YJtLqL8B0O0uQ1hOAYgxPAGAAJiaA5GtQA8D8T2CO3ZhmJ9y8ZkATo3nWO9hsvtRtpOFjpD/XsNn78LzokTal3CH6GJtSYVLT9q+vt/n3EoDp1uBBMQZyAAMwraVNaXsxFAPFQDE2r+u/lhCVNdhXkskAAAAASUVORK5CYII='
const TopThreeStyles: Record<number, string> = {
    1: 'first',
    2: 'second',
    3: 'third'
}
const RankItem = (props: IRankItem) => {
    const { address, avatar = defaultAvatar, rank } = props
    return (
        <div className={ styles.rankItem }>
            <div className={styles.left}>
                <span className={classNames(styles.rank, styles[TopThreeStyles[rank]])}>{rank}</span>
                <div className={styles.avatar}>
                    <Avatar theme='image' isRounded={true} image={avatar} size={48}/>
                </div>
                <div>
                    <Typography color="#fff">{address}</Typography>
                </div>
            </div>
            <div className={styles.right}>
                <Typography color="rgb(25 200 74)" fontSize="20px">{'+43K XP'}</Typography>
                <Typography color="rgb(189 193 199)" fontSize="16px">Total: {14}XP</Typography>
            </div>
        </div>
    )
}

export default RankItem