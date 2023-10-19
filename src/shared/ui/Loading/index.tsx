import { Logo } from "foxrave/shared/assets/svg/Logo";

import styles from 'foxrave/shared/assets/css/Loading.module.css';

const Loading = () => {
    return (
        <div className={ styles.pageContainer }>
            <div className={ styles.logoContainer }>
                <div className={ styles.logoSvg }>
                    <Logo/>
                </div>
                <a className={ styles.logo }>
                    FoxRave
                </a>
            </div>
        </div>
    )
}

export default Loading;