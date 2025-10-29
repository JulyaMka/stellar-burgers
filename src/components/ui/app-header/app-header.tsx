import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const getIconType = (path: string) =>
    location.pathname === path ? 'primary' : 'secondary';

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${location.pathname === '/' ? styles.link_active : ''}`}
          >
            <BurgerIcon type={getIconType('/')} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${location.pathname.startsWith('/feed') ? styles.link_active : ''}`}
          >
            <ListIcon type={getIconType('/feed')} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <Link
          to='/profile'
          className={styles.link_position_last}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ProfileIcon type={getIconType('/profile')} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </nav>
    </header>
  );
};
