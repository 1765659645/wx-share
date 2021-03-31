import { LogoutOutlined } from '@ant-design/icons';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import { Modal } from 'antd';
import React from 'react';
import type { ConnectProps } from 'umi';
import { connect, history } from 'umi';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import storage from '@/utils/storage';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
} & Partial<ConnectProps> &
  Partial<ProSettings>;

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  function handleLogout() {
    Modal.confirm({
      closable: true,
      onOk: () => {
        storage.clear();
        history.replace('/login');
      },
      content: '确认退出？',
    });
  }

  return (
    <div className={className}>
      <LogoutOutlined
        style={{ lineHeight: '50px', fontSize: '25px', cursor: 'pointer' }}
        onClick={handleLogout}
      />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
