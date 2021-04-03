import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Link href="/">
        <a>
          <img src="/images/Logo.svg" alt="logo"/>
        </a>
      </Link>
    </div>
  );
}
