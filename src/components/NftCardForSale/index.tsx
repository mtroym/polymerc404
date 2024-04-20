import React from "react"
import styles from './index.module.scss'
import { Button } from "@web3uikit/core"
import Image from "next/image"
import { Gift, Btc} from '@web3uikit/icons'
import classNames from "classnames"

interface IProps {
    className?: string
    name: string
    showBurn?: boolean
    url?: string
    handleNftMint?: () => void,
    btnText2: string
}
const NftCardForSale = (props: IProps) => {
    const { className = '', handleNftMint, name, showBurn = false, url = '/images/nftDemo.jpg', btnText2 } = props
    return (
        <div className={classNames(styles.nftCardForSale, className)}>
            <div className={styles.nftInfo}>
                <div className={styles.image} >
                    <img className={styles.image} src={url} alt=""  style={{ width: '320px', height: '100%'}} />
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <span>{name}</span>
                        <Gift fontSize='24px'/>
                    </div>
                    <div className={styles.like}>
                        <Btc fontSize='20px' style={{ marginRight: '8px' }}/>
                        <span>232</span>
                    </div>
                </div>
            </div>
            <div className={styles.action}>
                {
                    showBurn && 
                    <Button 
                        text="Burn" 
                        type="button" 
                        theme="secondary" 
                        size="large" 
                        onClick={() => {
                            handleNftMint?.()
                        }}
                    />
                }
                <Button 
                    text={btnText2} 
                    type="button" 
                    theme="primary" 
                    size="large" 
                    onClick={() => {
                        handleNftMint?.()
                    }}
                />
            </div>
        </div>
    )
}

export default NftCardForSale