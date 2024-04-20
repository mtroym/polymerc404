
import Navbar from '../navigation/navbar';
// import Footer from '../layout/Footer';
import React from 'react';
import styles from './index.module.scss'
import classNames from 'classnames';

interface ILayour {
  children?: React.ReactNode,
  className?: string
  hideHeader?: boolean
  // mainStyle?: StyleSheet
}
const Layout = ({ children, className = '', hideHeader = false }: ILayour) => {
  return (
    <div className={classNames(styles.layoutWrapper, className)}>
        { hideHeader ? null : <Navbar /> }
        <main className={styles.main}>{children}</main>
        <footer>footer</footer>
    </div>
  );
};

export default Layout;