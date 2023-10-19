import { useContext, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";

import { Button, Card, Grid, Spacer, Text } from "@nextui-org/react";

import toast from "react-hot-toast";

import { Crop, PixelCrop, ReactCrop } from "react-image-crop";

import { API_URL } from "foxrave/http";

import { Context } from "foxrave/pages/_app";

import AuthService from "foxrave/services/AuthService";
import StorageService from "foxrave/services/StorageService";

import { Mood } from "foxrave/models/response/AuthResponse";

import { useDebounceEffect } from 'foxrave/shared/types/useDebounceEffect';
import { canvasPreview } from 'foxrave/shared/types/canvasPreview';

import styles from 'foxrave/shared/assets/css/Setup.module.css';

import 'react-image-crop/dist/ReactCrop.css'

const VerifyCard = () => {
    const placeholder = `${API_URL}/storage/avatar/1`;

    const router = useRouter();

    const { store } = useContext(Context)

    const [step, setStep] = useState<number>(1);
    const [mood, setMood] = useState<number>(0);

    const [emojis, setEmojis] = useState<Mood[]>([]);

    useEffect(() => {
        StorageService.getMoods().then(result => {
            setEmojis(result.data.moods);
        });
    }, []);

    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    });

    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [scale, setScale] = useState(1)

    const imgRef = useRef<HTMLImageElement>(null)
    const blobUrlRef = useRef('')

    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                await canvasPreview (
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    0
                )
            }
        }, 100, [completedCrop, scale]
    )

    const handleAvatarSelect = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            // @ts-ignore
            setSelectedAvatar(e.target.result);
        };

        reader.readAsDataURL(file);
    };

    function onDownloadCropClick() {
        if (!previewCanvasRef.current) {
            throw new Error('Crop canvas does not exist')
        }

        previewCanvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                throw new Error('Failed to create blob')
            }

            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current)
            }

            blobUrlRef.current = URL.createObjectURL(blob)

            const { readAndCompressImage } = (await import('browser-image-resizer'));

            readAndCompressImage(new File([blob], `${store.user.id}.png`), {
                quality: 1,
                maxWidth: 100,
                maxHeight: 100
            })
                .then((blob) => {
                    AuthService.uploadAvatar(blob, `${store.user.id}.png`)
                        .then(response => {
                            store.setUser(response.data.user)
                            toast.success(response.data.message)

                            setStep(2);
                        })
                        .catch(error => {
                            toast.error("Произошла ошибка.")
                            console.log(error)
                        })
                })
        })
    }

    const handleAvatarUpload = () => {
        if (completedCrop && previewCanvasRef.current) {
            toast("Загрузка...")

            onDownloadCropClick()
        } else {
            toast.error("Обрежь картинку перед загрузкой!")
        }
    };


    const handleMoodSet = () => {
        AuthService.setMood(mood).then((response) => {
            store.setUser(response.data.user)
            router.push("/")
        })
    }

    const renderContent = (step: number) => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Text size={20}>
                            Шаг: 1 из 2 | Фото профиля
                        </Text>

                        <Spacer y={0.2}/>

                        <label htmlFor="avatarInput" className={styles.fileInputLabel}>
                            <input
                                id="avatarInput"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarSelect}
                                className={styles.fileInput}
                            />
                            Выбрать файл
                        </label>

                        <Spacer y={0.5}/>

                        <ReactCrop
                            aspect={1}
                            crop={crop}
                            onChange={(crop, percentCrop) => setCrop(crop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            className={ styles.settingsAvatarSet }
                        >
                            <img
                                crossOrigin="anonymous"
                                ref={imgRef}
                                src={ selectedAvatar ? selectedAvatar : placeholder }
                                alt={'Crop'}
                                className={ styles.settingsAvatarSetImage }
                            />
                        </ReactCrop>

                        <Spacer y={1}/>

                        {
                            !!completedCrop && (
                                <>
                                    <Grid.Container justify={"center"}>
                                        <Text b size={23} color="inherit" css={{ d: "flex" }}>
                                            Результат
                                        </Text>
                                    </Grid.Container>

                                    <Spacer y={0.1}/>

                                    <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                            margin: '0 auto',
                                            border: '3px solid rgba(163, 43, 255, 0.82)',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            width: "200px",
                                            height: "200px",
                                        }}
                                    />

                                    <Spacer y={1}/>

                                    <Button onPress={() => handleAvatarUpload()}>
                                        Далее
                                    </Button>
                                </>
                            )
                        }
                    </>
                )
            case 2:
                return (
                    <>
                        <Text size={20}>
                            Шаг: 2 из 2 | Выбери статус
                        </Text>
                            <Spacer y={2}/>

                        <Grid.Container gap={1} justify="center">
                            { emojis.map((data, index) =>
                                (
                                    <Grid onClick={ () => setMood(data.id) } key={ data.id }>
                                        <div className={`${styles.emoticonSettingsButton} ${mood === data.id ? styles.emoticonSettingsSelectedButton : ''}`}>
                                            <img
                                                src={ data.url }
                                                alt="Emoticon"
                                                className={ styles.emoticonSettingsGrid }
                                            />
                                        </div>
                                    </Grid>
                                ))
                            }
                        </Grid.Container>

                        <Spacer y={2}/>
                        {
                            mood != 0 && <Button onPress={handleMoodSet}>Готово</Button>
                        }

                        <Spacer y={0.2}/>
                    </>
                )
        }
    }

    return (
        <Card css={{
            maxWidth: 365,
            margin: "0 auto"
        }}>
            <Card.Header>
                <Text className={ styles.text }>
                    Давайте настроим ваш профиль
                </Text>

            </Card.Header>

            <Card.Body css={{
                margin: "0 auto",
                textAlign: "center",
                maxWidth: 320
            }}>
                {renderContent(step)}
            </Card.Body>
        </Card>
    )
}

export default VerifyCard;