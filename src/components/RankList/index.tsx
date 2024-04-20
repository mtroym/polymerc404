
import styles from './index.module.scss'
import RankItem from './RankItem/index'

const demo = [
    {
        rank: 1,
        address: '0x1dc17DE9a516bC03589554fFEd1F583B9cDc4883',
    },
    {
        rank: 2,
        address: '0x1dc17DE9a516bC03589554fFEd1F583B9cDc4883',
    },
    {
        rank: 3,
        address: '0x1dc17DE9a516bC03589554fFEd1F583B9cDc4883',
    },
    {
        rank: 4,
        address: '0x1dc17DE9a516bC03589554fFEd1F583B9cDc4883',
    },
]
const RankList = () => {
    return (
        <div className={styles.rankList}>
            {
                demo.map(item => <div style={{ marginBottom: '24px' }}><RankItem {...item} /></div>)
            }
        </div>
    )
}

export default RankList