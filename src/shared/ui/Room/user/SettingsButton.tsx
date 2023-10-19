import Image from "next/image";

import styles from "foxrave/shared/assets/css/SettingsButton.module.css";

interface ButtonProps {
    title: string;
    image: string;
    onClick: () => void;
}

export default function SettingsButton({ title, image, onClick }: ButtonProps) {
    return (
        <div className={ styles.container } onClick={ onClick }>
            <div className={ styles.iconContainer }>
                <Image className={ styles.icon } src={ image } alt={ title } width={ 70 } height={ 70 }/>
            </div>

            <div className={ styles.textContainer }>
                <span className={ styles.text }>{ title }</span>
            </div>
        </div>
    )
}